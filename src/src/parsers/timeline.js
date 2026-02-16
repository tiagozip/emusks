import parseTweet from "./tweet.js";
import parseUser from "./user.js";

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

function extractTweetFromEntry(entry) {
  const tweetResult =
    entry?.content?.itemContent?.tweet_results?.result ||
    entry?.item?.itemContent?.tweet_results?.result;
  if (tweetResult) {
    return parseTweet(tweetResult);
  }
  return null;
}

function extractUserFromEntry(entry) {
  const userResult =
    entry?.content?.itemContent?.user_results?.result ||
    entry?.item?.itemContent?.user_results?.result;
  if (userResult) {
    return parseUser(userResult);
  }
  return null;
}

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
    if (instruction.type === "TimelineAddEntries" || instruction.entries) {
      for (const entry of instruction.entries || []) {
        processEntry(entry, tweets, users);

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
  const tweet = extractTweetFromEntry(entry);
  if (tweet) {
    tweets.push(tweet);
    return;
  }

  const user = extractUserFromEntry(entry);
  if (user) {
    users.push(user);
    return;
  }

  if (entry.content?.items) {
    for (const item of entry.content.items) {
      const t = extractTweetFromEntry(item);
      if (t) tweets.push(t);
      const u = extractUserFromEntry(item);
      if (u) users.push(u);
    }
  }
}
