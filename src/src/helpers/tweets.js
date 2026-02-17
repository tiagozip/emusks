import getCycleTLS from "../cycletls.js";
import parseTweet from "../parsers/tweet.js";

async function createPollCard(instance, poll) {
  if (!poll.choices || poll.choices.length < 2)
    throw new Error("a poll must have at least 2 choices");
  if (poll.choices.length > 4) throw new Error("a poll must not have more than 4 choices");

  const hasImages = poll.choices.some((c) => typeof c === "object" && c.image);
  const allImages = poll.choices.every((c) => typeof c === "object" && c.image);
  if (hasImages && !allImages)
    throw new Error("either all poll choices must have images, or none of them");

  const labels = poll.choices.map((c) => (typeof c === "object" ? c.label : c));

  for (const label of labels) {
    if (typeof label !== "string" || label.length === 0)
      throw new Error("each poll choice must have a non-empty label");
    if (label.length > 25) throw new Error(`poll choice "${label}" exceeds the 25-character limit`);
  }

  const duration = poll.duration_minutes ?? 1440;
  if (duration < 5 || duration > 10080)
    throw new Error("poll duration must be between 5 and 10 080 minutes (7 days)");

  const cycleTLS = await getCycleTLS();

  const cardObj = {
    "twitter:api:api:endpoint": "1",
    "twitter:long:duration_minutes": duration,
  };

  if (hasImages) {
    cardObj["twitter:card"] = "poll_choice_images";
    for (let i = 0; i < poll.choices.length; i++) {
      cardObj[`twitter:string:choice${i + 1}_label`] = labels[i];
      cardObj[`twitter:image:choice${i + 1}_image:src:id`] = `mis://${poll.choices[i].image}`;
    }
  } else {
    cardObj["twitter:card"] = `poll${poll.choices.length}choice_text_only`;
    for (let i = 0; i < labels.length; i++) {
      cardObj[`twitter:string:choice${i + 1}_label`] = labels[i];
    }
  }

  const cardData = JSON.stringify(cardObj);

  const res = await cycleTLS(
    "https://caps.x.com/v2/cards/create.json",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        authorization: `Bearer ${instance.auth.client.bearer}`,
        "content-type": "application/x-www-form-urlencoded",
        "x-csrf-token": instance.auth.csrfToken,
        "x-twitter-active-user": "yes",
        "x-twitter-auth-type": "OAuth2Session",
        "x-twitter-client-language": "en",
        priority: "u=1, i",
        "sec-ch-ua": "Not(A:Brand;v=8, Chromium;v=144",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "macOS",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        cookie:
          instance.auth.client.headers.cookie +
          (instance.elevatedCookies ? `; ${instance.elevatedCookies}` : ""),
      },
      body: `card_data=${encodeURIComponent(cardData)}`,
      userAgent:
        instance.auth.client.fingerprints?.userAgent ||
        instance.auth.client.fingerprints?.["user-agent"],
      ja3: instance.auth.client.fingerprints?.ja3,
      ja4r: instance.auth.client.fingerprints?.ja4r,
      proxy: instance.proxy || undefined,
      referrer: "https://x.com/",
    },
    "post",
  );

  const data = await res.json();
  if (!data?.card_uri) {
    throw new Error(`failed to create poll card: ${JSON.stringify(data)}`);
  }
  return data.card_uri;
}

export async function create(text, opts = {}) {
  let cardUri = opts.cardUri;

  if (opts.poll) {
    if (cardUri) throw new Error("a tweet can\u0027t have both a poll and a cardUri");
    cardUri = await createPollCard(this, opts.poll);
  }

  const mediaIds = opts.mediaIds ? [...opts.mediaIds] : [];

  if (opts.gif) {
    const gif = opts.gif;
    const gifUrl = gif.original_image?.url || gif.url;
    if (!gifUrl) throw new Error("gif must have a url or original_image.url");

    const provider = gif.found_media_origin?.provider || gif.provider;
    const gifId = gif.found_media_origin?.id || gif.id;
    const altText = gif.alt_text || gif.altText;

    const uploaded = await this.media.createFromUrl(gifUrl, {
      origin: provider && gifId ? { provider, id: gifId } : undefined,
      altText,
    });
    mediaIds.push(uploaded.media_id);
  }

  const res = await this.graphql("CreateTweet", {
    body: {
      variables: {
        tweet_text: text,
        dark_request: false,
        card_uri: cardUri || undefined,
        media: {
          media_entities: mediaIds.map((id) => ({
            media_id: id,
            tagged_users: [],
          })),
          possibly_sensitive: opts.sensitive || false,
        },
        semantic_annotation_ids: [],
        ...(opts.replyTo
          ? {
              reply: {
                in_reply_to_tweet_id: opts.replyTo,
                exclude_reply_user_ids: [],
              },
            }
          : {}),
        ...(opts.quoteTweetId
          ? { attachment_url: `https://x.com/i/status/${opts.quoteTweetId}` }
          : {}),
        ...(opts.conversationControl
          ? { conversation_control: { mode: opts.conversationControl } }
          : {}),
        ...opts.variables,
      },
    },
  });
  const tweet = res?.data?.create_tweet?.tweet_results?.result;
  return tweet ? parseTweet(tweet) : res;
}

export async function createNote(text, opts = {}) {
  const res = await this.graphql("CreateNoteTweet", {
    body: {
      variables: {
        tweet_text: text,
        dark_request: false,
        media: {
          media_entities:
            opts.mediaIds?.map((id) => ({
              media_id: id,
              tagged_users: [],
            })) || [],
          possibly_sensitive: opts.sensitive || false,
        },
        semantic_annotation_ids: [],
        richtext_options: { richtext_tags: opts.richtext_tags || [] },
        ...(opts.replyTo
          ? {
              reply: {
                in_reply_to_tweet_id: opts.replyTo,
                exclude_reply_user_ids: [],
              },
            }
          : {}),
        ...opts.variables,
      },
    },
  });
  const tweet = res?.data?.notetweet_create?.tweet_results?.result;
  return tweet ? parseTweet(tweet) : res;
}

export async function remove(tweetId) {
  return await this.graphql("DeleteTweet", {
    body: { variables: { tweet_id: tweetId, dark_request: false } },
  });
}

export async function like(tweetId) {
  return await this.graphql("FavoriteTweet", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function unlike(tweetId) {
  return await this.graphql("UnfavoriteTweet", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function retweet(tweetId) {
  return await this.graphql("CreateRetweet", {
    body: { variables: { tweet_id: tweetId, dark_request: false } },
  });
}

export async function unretweet(tweetId) {
  return await this.graphql("DeleteRetweet", {
    body: { variables: { source_tweet_id: tweetId, dark_request: false } },
  });
}

export async function pin(tweetId) {
  return await this.graphql("PinTweet", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function unpin(tweetId) {
  return await this.graphql("UnpinTweet", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function get(tweetId) {
  const res = await this.graphql("TweetResultByRestId", {
    variables: {
      tweetId,
      withCommunity: false,
      includePromotedContent: false,
      withVoice: false,
    },
    fieldToggles: {
      withArticlePlainText: false,
      withArticleRichContentState: false,
      withAuxiliaryUserLabels: false,
    },
  });
  const tweet = res?.data?.tweetResult?.result;
  return tweet ? parseTweet(tweet) : res;
}

export async function getMany(tweetIds) {
  const res = await this.graphql("TweetResultsByRestIds", {
    variables: {
      tweetIds,
      withCommunity: false,
      includePromotedContent: false,
      withVoice: false,
    },
    fieldToggles: {
      withArticlePlainText: false,
      withArticleRichContentState: false,
      withAuxiliaryUserLabels: false,
    },
  });
  const results = res?.data?.tweetResult || [];
  return Array.isArray(results) ? results.map((r) => (r?.result ? parseTweet(r.result) : r)) : res;
}

export async function detail(tweetId, opts = {}) {
  return await this.graphql("TweetDetail", {
    variables: {
      focalTweetId: tweetId,
      with_rux_injections: false,
      rankingMode: "Relevance",
      includePromotedContent: true,
      withCommunity: true,
      withQuickPromoteEligibilityTweetFields: true,
      withBirdwatchNotes: true,
      withVoice: true,
      ...opts.variables,
    },
    fieldToggles: {
      withArticlePlainText: false,
      withArticleRichContentState: false,
      withAuxiliaryUserLabels: false,
    },
  });
}

export async function editHistory(tweetId) {
  return await this.graphql("TweetEditHistory", {
    variables: { tweetId, withQuickPromoteEligibilityTweetFields: true },
  });
}

export async function retweeters(tweetId, opts = {}) {
  return await this.graphql("Retweeters", {
    variables: {
      tweetId,
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: false,
    },
  });
}

export async function highlight(tweetId) {
  return await this.graphql("CreateHighlight", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function unhighlight(tweetId) {
  return await this.graphql("DeleteHighlight", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function schedule(text, scheduledAt, opts = {}) {
  return await this.graphql("CreateScheduledTweet", {
    body: {
      variables: {
        post_tweet_request: {
          status: text,
          ...(opts.mediaIds ? { media_ids: opts.mediaIds } : {}),
          ...(opts.replyTo ? { in_reply_to_status_id: opts.replyTo } : {}),
          auto_populate_reply_metadata: true,
        },
        execute_at: Math.floor(new Date(scheduledAt).getTime() / 1000),
      },
    },
  });
}

export async function deleteScheduled(scheduledTweetId) {
  return await this.graphql("DeleteScheduledTweet", {
    body: { variables: { scheduled_tweet_id: scheduledTweetId } },
  });
}

export async function getScheduled() {
  return await this.graphql("FetchScheduledTweets", {
    variables: {},
  });
}

export async function moderate(tweetId) {
  return await this.graphql("ModerateTweet", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function unmoderate(tweetId) {
  return await this.graphql("UnmoderateTweet", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function pinReply(tweetId) {
  return await this.graphql("PinReply", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function unpinReply(tweetId) {
  return await this.graphql("UnpinReply", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function setConversationControl(tweetId, mode) {
  return await this.graphql("ConversationControlChange", {
    body: { variables: { tweet_id: tweetId, mode } },
  });
}

export async function removeConversationControl(tweetId) {
  return await this.graphql("ConversationControlDelete", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function unmention(tweetId) {
  return await this.graphql("UnmentionUserFromConversation", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function createThread(items) {
  if (!Array.isArray(items) || items.length < 2)
    throw new Error("a thread must have at least 2 tweets");

  const tweets = [];
  let lastId = null;

  for (const item of items) {
    const opts = typeof item === "string" ? {} : { ...item };
    const text = typeof item === "string" ? item : item.text;

    if (lastId) opts.replyTo = lastId;

    const tweet = await create.call(this, text, opts);
    tweets.push(tweet);
    lastId = tweet.id;
  }

  return tweets;
}

export async function similar(tweetId) {
  return await this.graphql("SimilarPosts", {
    variables: { tweet_id: tweetId },
  });
}
