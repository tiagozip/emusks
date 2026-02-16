import account from "./account.js";
import bookmarks from "./bookmarks.js";
import communities from "./communities.js";
import dms from "./dms.js";
import lists from "./lists.js";
import media from "./media.js";
import notifications from "./notifications.js";
import search from "./search.js";
import spaces from "./spaces.js";
import timelines from "./timelines.js";
import topics from "./topics.js";
import trends from "./trends.js";
import tweets from "./tweets.js";
import users from "./users.js";

export default (client) => ({
  tweets: tweets(client),
  users: users(client),
  timelines: timelines(client),
  bookmarks: bookmarks(client),
  dms: dms(client),
  lists: lists(client),
  communities: communities(client),
  search: search(client),
  spaces: spaces(client),
  account: account(client),
  notifications: notifications(client),
  trends: trends(client),
  topics: topics(client),
  media: media(client),
  syndication: syndication(client),
});
