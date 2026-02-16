import getCycleTLS from "../cycletls.js";
import parseTweet from "../parsers/tweet.js";

async function createPollCard(client, poll) {
  if (!poll.choices || poll.choices.length < 2)
    throw new Error("a poll must have at least 2 choices");
  if (poll.choices.length > 4)
    throw new Error("a poll must not have more than 4 choices");

  const hasImages = poll.choices.some((c) => typeof c === "object" && c.image);
  const allImages = poll.choices.every((c) => typeof c === "object" && c.image);
  if (hasImages && !allImages)
    throw new Error(
      "either all poll choices must have images, or none of them",
    );

  const labels = poll.choices.map((c) => (typeof c === "object" ? c.label : c));

  for (const label of labels) {
    if (typeof label !== "string" || label.length === 0)
      throw new Error("each poll choice must have a non-empty label");
    if (label.length > 25)
      throw new Error(`poll choice "${label}" exceeds the 25-character limit`);
  }

  const duration = poll.duration_minutes ?? 1440;
  if (duration < 5 || duration > 10080)
    throw new Error(
      "poll duration must be between 5 and 10 080 minutes (7 days)",
    );

  const cycleTLS = await getCycleTLS();

  const cardObj = {
    "twitter:api:api:endpoint": "1",
    "twitter:long:duration_minutes": duration,
  };

  if (hasImages) {
    cardObj["twitter:card"] = `poll_choice_images`;
    for (let i = 0; i < poll.choices.length; i++) {
      cardObj[`twitter:string:choice${i + 1}_label`] = labels[i];
      cardObj[`twitter:image:choice${i + 1}_image:src:id`] =
        `mis://${poll.choices[i].image}`;
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
        authorization: `Bearer ${client.auth.client.bearer}`,
        "content-type": "application/x-www-form-urlencoded",
        "x-csrf-token": client.auth.csrfToken,
        "x-twitter-active-user": "yes",
        "x-twitter-auth-type": "OAuth2Session",
        "x-twitter-client-language": "en",
        priority: "u=1, i",
        "sec-ch-ua": '"Not(A:Brand";v="8", "Chromium";v="144"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        cookie:
          client.auth.client.headers.cookie +
          (client.elevatedCookies ? `; ${client.elevatedCookies}` : ""),
      },
      body: `card_data=${encodeURIComponent(cardData)}`,
      userAgent:
        client.auth.client.fingerprints?.userAgent ||
        client.auth.client.fingerprints?.["user-agent"],
      ja3: client.auth.client.fingerprints?.ja3,
      ja4r: client.auth.client.fingerprints?.ja4r,
      proxy: client.proxy || undefined,
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

export default (client) => ({
  async create(text, opts = {}) {
    let cardUri = opts.cardUri;

    if (opts.poll) {
      if (cardUri)
        throw new Error("a tweet can't have both a poll and a cardUri");
      cardUri = await createPollCard(client, opts.poll);
    }

    const res = await client.graphql("CreateTweet", {
      body: {
        variables: {
          tweet_text: text,
          dark_request: false,
          card_uri: cardUri || undefined,
          media: {
            media_entities:
              opts.mediaIds?.map((id) => ({
                media_id: id,
                tagged_users: [],
              })) || [],
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
  },

  async createNote(text, opts = {}) {
    const res = await client.graphql("CreateNoteTweet", {
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
  },

  async delete(tweetId) {
    return await client.graphql("DeleteTweet", {
      body: { variables: { tweet_id: tweetId, dark_request: false } },
    });
  },

  async like(tweetId) {
    return await client.graphql("FavoriteTweet", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async unlike(tweetId) {
    return await client.graphql("UnfavoriteTweet", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async retweet(tweetId) {
    return await client.graphql("CreateRetweet", {
      body: { variables: { tweet_id: tweetId, dark_request: false } },
    });
  },

  async unretweet(tweetId) {
    return await client.graphql("DeleteRetweet", {
      body: { variables: { source_tweet_id: tweetId, dark_request: false } },
    });
  },

  async pin(tweetId) {
    return await client.graphql("PinTweet", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async unpin(tweetId) {
    return await client.graphql("UnpinTweet", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async get(tweetId) {
    const res = await client.graphql("TweetResultByRestId", {
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
  },

  async getMany(tweetIds) {
    const res = await client.graphql("TweetResultsByRestIds", {
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
    return Array.isArray(results)
      ? results.map((r) => (r?.result ? parseTweet(r.result) : r))
      : res;
  },

  async detail(tweetId, opts = {}) {
    return await client.graphql("TweetDetail", {
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
  },

  async editHistory(tweetId) {
    return await client.graphql("TweetEditHistory", {
      variables: { tweetId, withQuickPromoteEligibilityTweetFields: true },
    });
  },

  async retweeters(tweetId, opts = {}) {
    return await client.graphql("Retweeters", {
      variables: {
        tweetId,
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: false,
      },
    });
  },

  async highlight(tweetId) {
    return await client.graphql("CreateHighlight", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async unhighlight(tweetId) {
    return await client.graphql("DeleteHighlight", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async schedule(text, scheduledAt, opts = {}) {
    return await client.graphql("CreateScheduledTweet", {
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
  },

  async deleteScheduled(scheduledTweetId) {
    return await client.graphql("DeleteScheduledTweet", {
      body: { variables: { scheduled_tweet_id: scheduledTweetId } },
    });
  },

  async getScheduled() {
    return await client.graphql("FetchScheduledTweets", {
      variables: {},
    });
  },

  async moderate(tweetId) {
    return await client.graphql("ModerateTweet", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async unmoderate(tweetId) {
    return await client.graphql("UnmoderateTweet", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async pinReply(tweetId) {
    return await client.graphql("PinReply", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async unpinReply(tweetId) {
    return await client.graphql("UnpinReply", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async setConversationControl(tweetId, mode) {
    return await client.graphql("ConversationControlChange", {
      body: { variables: { tweet_id: tweetId, mode } },
    });
  },

  async removeConversationControl(tweetId) {
    return await client.graphql("ConversationControlDelete", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async unmention(tweetId) {
    return await client.graphql("UnmentionUserFromConversation", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async createThread(items) {
    if (!Array.isArray(items) || items.length < 2)
      throw new Error("a thread must have at least 2 tweets");

    const tweets = [];
    let lastId = null;

    for (const item of items) {
      const opts = typeof item === "string" ? {} : { ...item };
      const text = typeof item === "string" ? item : item.text;

      if (lastId) opts.replyTo = lastId;

      const tweet = await this.create(text, opts);
      tweets.push(tweet);
      lastId = tweet.id;
    }

    return tweets;
  },

  async similar(tweetId) {
    return await client.graphql("SimilarPosts", {
      variables: { tweet_id: tweetId },
    });
  },
});
