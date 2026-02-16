---
layout: home

hero:
  name: "emusks"
  text: "Reverse-engineered Twitter API client"
  tagline: Log in and interact with the unofficial X API using any client identity — web, Android, iOS, or TweetDeck
  image: /logo.svg
  actions:
    - theme: brand
      text: Get started →
      link: /getting-started/
    - theme: alt
      text: View on GitHub
      link: https://github.com/tiagozip/emusks

features:
  - icon: 🎭
    title: Emulate any client
    details: Choose which Twitter client to impersonate — Web, Android, iPhone, TweetDeck, or more — each with correct bearer tokens and HTTP fingerprints.
  - icon: ⚡
    title: Full API coverage
    details: Access almost every feature on the platform — tweets, DMs, communities, spaces, bookmarks, lists, and more — through a clean JavaScript interface.
  - icon: 🔐
    title: Login with token or password
    details: Log in with an auth token or username/password, with built-in support for 2FA, email verification, and elevated access.
  - icon: 🌐
    title: Proxy support
    details: Route all traffic through HTTP or SOCKS5 proxies for IP rotation, rate limit management, or restricted network access.
  - icon: 🧩
    title: Execute raw queries
    details: Drop down to raw GraphQL, v1.1, or v2 API calls for undocumented endpoints or full control over requests and responses.
  - icon: 📦
    title: Zero config
    details: Ships with ESM support, and sensible defaults. Install, import, and start building in seconds.
---

<style>
.quick-start {
  max-width: 688px;
  margin: 0 auto;
  padding: 48px 24px 24px;
}

.quick-start h2 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.quick-start p {
  color: var(--vp-c-text-2);
  margin-bottom: 24px;
  line-height: 1.7;
}

.namespace-grid {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 24px 64px;
}

.namespace-grid h2 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 32px;
  letter-spacing: -0.02em;
  text-align: center;
}

.ns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.ns-card {
  display: block;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-alt);
  text-decoration: none !important;
  transition: border-color 0.2s, background-color 0.2s;
}

.ns-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
}

.ns-card code {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.ns-card span {
  display: block;
  margin-top: 6px;
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}
</style>

<div class="quick-start">

## Quick start

Install the package and start interacting with Twitter in just a few lines:

```sh
bun add emusks
```

```js
import Emusks from "emusks";

const client = new Emusks();
await client.login("your_auth_token");

const tweet = await client.tweets.create("Hello from emusks! 🚀");
console.log(`i tweeted to https://x.com/i/status/${tweet.id}`);

// like the tweet
await client.tweets.like(tweet.id);

// get a user
const user = await client.users.getByUsername("elonmusk");
console.log(`${user.name} has ${user.stats.followers.count} followers`);

// follow them
await client.users.follow(user.id);

// search for tweets
const results = await client.search.tweets("javascript");

// get your home timeline
const home = await client.timelines.home();
```

</div>

<div class="namespace-grid">

## API

<div class="ns-grid">
  <a class="ns-card" href="/tweets/tweets">
    <code>client.tweets</code>
    <span>Create, delete, like, retweet, pin, and schedule tweets</span>
  </a>
  <a class="ns-card" href="/tweets/timelines">
    <code>client.timelines</code>
    <span>Home feed, user tweets, media, likes, and highlights</span>
  </a>
  <a class="ns-card" href="/users/users">
    <code>client.users</code>
    <span>Get profiles, follow, block, mute, and manage relationships</span>
  </a>
  <a class="ns-card" href="/users/direct-messages">
    <code>client.dms</code>
    <span>Inbox, conversations, search, and message management</span>
  </a>
  <a class="ns-card" href="/discovery/search">
    <code>client.search</code>
    <span>Search tweets, users, media, lists, and communities</span>
  </a>
  <a class="ns-card" href="/tweets/bookmarks">
    <code>client.bookmarks</code>
    <span>Bookmark tweets, manage folders, and search saved content</span>
  </a>
  <a class="ns-card" href="/users/lists">
    <code>client.lists</code>
    <span>Create, manage, and subscribe to curated lists</span>
  </a>
  <a class="ns-card" href="/users/communities">
    <code>client.communities</code>
    <span>Join, create, moderate, and explore communities</span>
  </a>
  <a class="ns-card" href="/discovery/spaces">
    <code>client.spaces</code>
    <span>Get details, search, and subscribe to live audio rooms</span>
  </a>
  <a class="ns-card" href="/discovery/trends">
    <code>client.trends</code>
    <span>Explore trending topics, locations, and AI summaries</span>
  </a>
  <a class="ns-card" href="/discovery/topics">
    <code>client.topics</code>
    <span>Follow, unfollow, and discover topics of interest</span>
  </a>
  <a class="ns-card" href="/account/settings">
    <code>client.account</code>
    <span>Settings, security, sessions, 2FA, and preferences</span>
  </a>
  <a class="ns-card" href="/account/notifications">
    <code>client.notifications</code>
    <span>Notification timeline, badges, and push settings</span>
  </a>
  <a class="ns-card" href="/tweets/media">
    <code>client.media</code>
    <span>Media metadata, alt text, and subtitle management</span>
  </a>
</div>

</div>
