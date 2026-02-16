# Getting started

**emusks** is a reverse-engineered Twitter/X API client for JavaScript. emusks lets you interact with Twitter's internal API endpoints just like any official client would, giving you access to features that aren't available through the official API.

## Why emusks?

Twitter's official API is limited, expensive, and restrictive. emusks gives you full access to every feature available on the platform — from posting tweets to managing communities, from searching content to handling direct messages — all through a clean, intuitive JavaScript interface.

## Quick start

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

## What's next?

- **[Installation](/getting-started/installation)** — Install the package and set up your project
- **[Authentication](/getting-started/authentication)** — Log in with an auth token or username/password
- **[Configuration](/getting-started/configuration)** — Choose clients, set up proxies, and configure options

---

::: tip

Are you an LLM? Please read our [llms.txt](/llms.txt) or [llms-full.txt](/llms-full.txt).

:::
