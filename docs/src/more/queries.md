# Running queries

Beyond the high-level helper namespaces, emusks gives you direct access to Twitter's underlying API layers. This is useful when you need to call endpoints that aren't wrapped by a helper, experiment with new or undocumented features, or get the raw unprocessed response from Twitter.

Twitter/X uses three main API layers internally. emusks exposes all three.

## GraphQL API

Twitter's primary modern API layer. Most features — tweets, users, timelines, communities, and more — are powered by GraphQL endpoints.

```js
const res = await client.graphql("UserByScreenName", {
  variables: { screen_name: "elonmusk" },
});

console.log(res.data.user.result);
```

The first argument is the **operation name** — the name of the GraphQL query or mutation as defined by Twitter internally. The second argument is an options object where you can pass `variables`, `features`, and other GraphQL parameters.

You can get these from devtools. emusks will automatically handle obtaining query IDs and other necessary metadata for you.

## v1.1 REST API

The legacy REST API. Still actively used for account management, media uploads, user lookups, friendships, mutes, blocks, and many other features.

```js
const res = await client.v1_1("users/lookup", {
  params: { screen_name: "elonmusk" },
});

console.log(res);
```

The first argument is the **endpoint path** (without the `/1.1/` prefix or `.json` suffix). The second argument is an options object where you can pass `params` (query parameters) and other request options.

## v2 API

Twitter's v2 API layer, used for adaptive search, guide settings, badge counts, and some other features.

```js
const res = await client.v2("search/adaptive", {
  params: { q: "hello", count: 10 },
});

console.log(res);
```

## When to use raw query APIs

These APIs are extremely powerful and flexible, and in fact what emusks uses internally to implement everything else. However, they also require more work to use effectively, since you need to understand Twitter's internal API structure and handle the raw responses yourself.

You'll also need to beware that, unlike query APIs, all other functions parse and normalize Twitter's deeply nested, inconsistent API responses into clean JavaScript objects. Raw API methods return the response exactly as Twitter sends it, which are harder to work with and subject to change without warning.