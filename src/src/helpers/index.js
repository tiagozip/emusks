import * as account from "./account.js";
import * as bookmarks from "./bookmarks.js";
import * as communities from "./communities.js";
import * as dms from "./dms.js";
import * as lists from "./lists.js";
import * as media from "./media.js";
import * as notifications from "./notifications.js";
import * as search from "./search.js";
import * as spaces from "./spaces.js";
import * as syndication from "./syndication.js";
import * as timelines from "./timelines.js";
import * as topics from "./topics.js";
import * as trends from "./trends.js";
import * as tweets from "./tweets.js";
import * as users from "./users.js";

function namespace(proto, name, methods) {
  Object.defineProperty(proto, name, {
    get() {
      const bound = {};
      for (const [k, fn] of Object.entries(methods)) {
        if (typeof fn === "function") bound[k] = fn.bind(this);
      }
      Object.defineProperty(this, name, {
        value: bound,
        writable: true,
        configurable: true,
      });
      return bound;
    },
    configurable: true,
  });
}

export default function initHelpers(proto) {
  namespace(proto, "tweets", tweets);
  namespace(proto, "users", users);
  namespace(proto, "timelines", timelines);
  namespace(proto, "bookmarks", bookmarks);
  namespace(proto, "dms", dms);
  namespace(proto, "lists", lists);
  namespace(proto, "communities", communities);
  namespace(proto, "search", search);
  namespace(proto, "spaces", spaces);
  namespace(proto, "account", account);
  namespace(proto, "notifications", notifications);
  namespace(proto, "trends", trends);
  namespace(proto, "topics", topics);
  namespace(proto, "media", media);
  namespace(proto, "syndication", syndication);
}
