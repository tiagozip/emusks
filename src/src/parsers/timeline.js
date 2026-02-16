import parseTweet from "./tweet.js";
import parseUser from "./user.js";

/**
 * Recursively find the `instructions` array from any Twitter timeline response.
 *
 * Known response shapes:
 *   data.home.home_timeline_urt.instructions
 *   data.user.result.timeline_v2.timeline.instructions
 *   data.search_by_raw_query.search_timeline.timeline.instructions
 *   data.bookmark_timeline_v2.timeline.instructions
 *   data.bookmark_search_timeline.timeline.instructions
 *   data.list.tweets_timeline.timeline.instructions
 *   data.timeline_by_id.timeline.instructions
 *   ... and many more
 */
function findInstructions(obj) {
  if (!obj || typeof obj !== "object") return null;

  if (Array.isArray(obj.instructions)) {
    return obj.instructions;
  }

  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val && typeof val === "object") {
      const found = findInstructions(val);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Extract tweet results from a single timeline entry.
 */
function extractTweetFromEntry(entry) {
  // Standard tweet entry
  const tweetResult =
    entry?.content?.itemContent?.tweet_results?.result ||
    entry?.item?.itemContent?.tweet_results?.result;
  if (tweetResult) {
    return parseTweet(tweetResult);
  }
  return null;
}

/**
 * Extract user results from a single timeline entry.
 */
function extractUserFromEntry(entry) {
  const userResult =
    entry?.content?.itemContent?.user_results?.result ||
    entry?.item?.itemContent?.user_results?.result;
  if (userResult) {
    return parseUser(userResult);
  }
  return null;
}

/**
 * Parse a raw Twitter timeline/search/bookmark GraphQL response into
 * `{ tweets, users, nextCursor, previousCursor }`.
 *
 * Works universally across all timeline-shaped endpoints.
 */
export default function parseTimeline(raw) {
  const instructions = findInstructions(raw?.data || raw);

  if (!instructions) {
    return { tweets: [], users: [], nextCursor: null, previousCursor: null, raw };
  }

  const tweets = [];
  const users = [];
  let nextCursor = null;
  let previousCursor = null;

  for (const instruction of instructions) {
    const entries =
      instruction.entries || // TimelineAddEntries
        instruction.entry // TimelineReplaceEntry (single)
        ? [instruction.entry]
        : null;

    if (instruction.type === "TimelineAddEntries" || instruction.entries) {
      for (const entry of instruction.entries || []) {
        processEntry(entry, tweets, users);

        // Extract cursors
        if (entry.entryId?.startsWith("cursor-bottom") || entry.entryId?.includes("cursor-bottom")) {
          nextCursor =
            entry.content?.value || entry.content?.itemContent?.value || null;
        }
        if (entry.entryId?.startsWith("cursor-top") || entry.entryId?.includes("cursor-top")) {
          previousCursor =
            entry.content?.value || entry.content?.itemContent?.value || null;
        }
      }
    }

    if (instruction.type === "TimelineReplaceEntry" && instruction.entry) {
      processEntry(instruction.entry, tweets, users);
      if (instruction.entry.entryId?.includes("cursor-bottom")) {
        nextCursor =
          instruction.entry.content?.value ||
          instruction.entry.content?.itemContent?.value ||
          null;
      }
    }
  }

  return { tweets, users, nextCursor, previousCursor, raw };
}

function processEntry(entry, tweets, users) {
  // Direct tweet entry (tweet-*)
  const tweet = extractTweetFromEntry(entry);
  if (tweet) {
    tweets.push(tweet);
    return;
  }

  // Direct user entry (user-*)
  const user = extractUserFromEntry(entry);
  if (user) {
    users.push(user);
    return;
  }

  // Module entries (conversationthread-*, profile-grid-*, etc.)
  if (entry.content?.items) {
    for (const item of entry.content.items) {
      const t = extractTweetFromEntry(item);
      if (t) tweets.push(t);
      const u = extractUserFromEntry(item);
      if (u) users.push(u);
    }
  }
}
