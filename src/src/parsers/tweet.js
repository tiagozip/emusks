import parseUser from "./user.js";

export default function parseTweet(tweet) {
  const get = (obj, path, fallback = undefined) =>
    path
      .split(".")
      .reduce((o, k) => (o && o[k] !== undefined ? o[k] : fallback), obj);
  const data = tweet.data?.tweet || tweet;

  const legacy = data.legacy || data;
  const core = data.core || {};
  const views = data.views || {};

  return {
    id: tweet.rest_id || legacy.id_str || tweet.id || tweet.id_str,
    text: legacy.full_text || legacy.text || tweet.text,
    created_at: legacy.created_at || tweet.created_at,
    conversation_id: legacy.conversation_id_str || tweet.conversation_id_str,
    in_reply_to_status_id:
      legacy.in_reply_to_status_id_str || tweet.in_reply_to_status_id_str,
    in_reply_to_user_id:
      legacy.in_reply_to_user_id_str || tweet.in_reply_to_user_id_str,
    in_reply_to_screen_name:
      legacy.in_reply_to_screen_name || tweet.in_reply_to_screen_name,

    user: (() => {
      const raw =
        get(core, "user_results.result") ||
        get(data, "core.user_results.result") ||
        data.user;
      return raw ? parseUser(raw) : null;
    })(),

    stats: {
      retweets: legacy.retweet_count || tweet.retweet_count || 0,
      likes: legacy.favorite_count || tweet.favorite_count || 0,
      replies: legacy.reply_count || tweet.reply_count || 0,
      quotes: legacy.quote_count || tweet.quote_count || 0,
      bookmarks: legacy.bookmark_count || tweet.bookmark_count || 0,
      views: get(views, "count") || 0,
    },

    engagement: {
      retweeted: legacy.retweeted || tweet.retweeted || false,
      liked: legacy.favorited || tweet.favorited || false,
      bookmarked: legacy.bookmarked || tweet.bookmarked || false,
    },

    media:
      tweet.extended_entities?.media ||
      legacy.extended_entities?.media ||
      legacy.entities?.media ||
      tweet.entities?.media ||
      [],
    urls: legacy.entities?.urls || tweet.entities?.urls || [],
    hashtags: legacy.entities?.hashtags || tweet.entities?.hashtags || [],
    user_mentions:
      legacy.entities?.user_mentions || tweet.entities?.user_mentions || [],

    source: legacy.source || tweet.source,
    lang: legacy.lang || tweet.lang,

    quoting: get(tweet, "quoted_status_result.result")
      ? parseTweet(get(tweet, "quoted_status_result.result"))
      : null,

    edit_control: data.edit_control || {},
    card: data.card || null,
    unmention_data: data.unmention_data || {},

    misc: {
      display_text_range: legacy.display_text_range || tweet.display_text_range,
      is_translatable: tweet.is_translatable || false,
      possibly_sensitive:
        legacy.possibly_sensitive || tweet.possibly_sensitive || false,
      withheld_copyright:
        legacy.withheld_copyright || tweet.withheld_copyright || false,
      withheld_in_countries:
        legacy.withheld_in_countries || tweet.withheld_in_countries || [],
    },
  };
}
