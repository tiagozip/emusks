# Search

Search tweets, users, media, and more across Twitter/X. Most of these support [Search operators](../more/search-operators.md).

## `search.tweets(query, opts?)`

Search for tweets (Top results). Uses the GraphQL `SearchTimeline` query with `product: "Top"`.

| Option | Type | Description |
| --- | --- | --- |
| `query` | `string` | Search query (supports Twitter search operators) |
| `opts.count` | `number` | Number of results (default 20) |
| `opts.cursor` | `string` | Pagination cursor |
| `opts.querySource` | `string` | Query source (default `"typed_query"`) |
| `opts.product` | `string` | Override the product type (default `"Top"`) |
| `opts.variables` | `object` | Additional GraphQL variables |

```js
const { tweets, nextCursor } = await client.search.tweets("javascript");

// With search operators
const { tweets: elonTweets } = await client.search.tweets("from:elonmusk AI");

// Paginate
const page2 = await client.search.tweets("javascript", { cursor: nextCursor });
```

## `search.latest(query, opts?)`

Search for tweets sorted by latest (chronological). Uses the GraphQL `SearchTimeline` query with `product: "Latest"`.

| Option             | Type     | Description                            |
| ------------------ | -------- | -------------------------------------- |
| `query`            | `string` | Search query                           |
| `opts.count`       | `number` | Number of results (default 20)         |
| `opts.cursor`      | `string` | Pagination cursor                      |
| `opts.querySource` | `string` | Query source (default `"typed_query"`) |
| `opts.variables`   | `object` | Additional GraphQL variables           |

```js
const { tweets } = await client.search.latest("breaking news");
```

## `search.users(query, opts?)`

Search for user profiles. Uses the GraphQL `SearchTimeline` query with `product: "People"`.

| Option             | Type     | Description                            |
| ------------------ | -------- | -------------------------------------- |
| `query`            | `string` | Search query                           |
| `opts.count`       | `number` | Number of results (default 20)         |
| `opts.cursor`      | `string` | Pagination cursor                      |
| `opts.querySource` | `string` | Query source (default `"typed_query"`) |
| `opts.variables`   | `object` | Additional GraphQL variables           |

```js
const { users } = await client.search.users("elon");
```

## `search.media(query, opts?)`

Search for tweets containing media (images, videos, GIFs). Uses the GraphQL `SearchTimeline` query with `product: "Media"`.

| Option             | Type     | Description                            |
| ------------------ | -------- | -------------------------------------- |
| `query`            | `string` | Search query                           |
| `opts.count`       | `number` | Number of results (default 20)         |
| `opts.cursor`      | `string` | Pagination cursor                      |
| `opts.querySource` | `string` | Query source (default `"typed_query"`) |
| `opts.variables`   | `object` | Additional GraphQL variables           |

```js
const { tweets } = await client.search.media("cute cats");
```

## `search.lists(query, opts?)`

Search for Twitter/X lists. Uses the GraphQL `SearchTimeline` query with `product: "Lists"`.

| Option             | Type     | Description                            |
| ------------------ | -------- | -------------------------------------- |
| `query`            | `string` | Search query                           |
| `opts.count`       | `number` | Number of results (default 20)         |
| `opts.cursor`      | `string` | Pagination cursor                      |
| `opts.querySource` | `string` | Query source (default `"typed_query"`) |
| `opts.variables`   | `object` | Additional GraphQL variables           |

```js
const { tweets } = await client.search.lists("tech news");
```

## `search.typeahead(query, params?)`

Get typeahead/autocomplete suggestions. Uses the v1.1 `search/typeahead` endpoint. Returns events, users, topics, and lists matching the query.

| Param | Type | Description |
| --- | --- | --- |
| `query` | `string` | Search query |
| `params.src` | `string` | Source context (default `"search_box"`) |
| `params.result_type` | `string` | Types to return (default `"events,users,topics,lists"`) |

```js
const suggestions = await client.search.typeahead("elon");
console.log(suggestions.users);
console.log(suggestions.topics);
```

## `search.communities(query, opts?)`

Search for posts within communities globally. Uses the GraphQL `GlobalCommunitiesPostSearchTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `query`          | `string` | Search query                   |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets } = await client.search.communities("web development");
```

## `search.communitiesLatest(query, opts?)`

Search for the latest posts within communities globally. Uses the GraphQL `GlobalCommunitiesLatestPostSearchTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `query`          | `string` | Search query                   |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets } = await client.search.communitiesLatest("open source");
```

## `search.adaptive(query, params?)`

Perform an "adaptive search" via the v2 API. Uses the v2 `search/adaptive` endpoint. Returns raw search results with full tweet and user objects.

::: warning
This hasn't been fully tested yet and may have some quirks. It also doesn't support all the operators and features of the normal GraphQL search.

**Using the [normal search methods](#search-tweets-query-opts) over this one is recommended for most use cases** unless you have a specific reason for needing to use v2 search or want to experiment with it.
:::

| Param | Type | Description |
| --- | --- | --- |
| `query` | `string` | Search query |
| `params.count` | `number` | Number of results (default 20) |
| `params.query_source` | `string` | Query source (default `"typed_query"`) |
| `params.pc` | `number` | Promoted content flag (default 1) |
| `params.spelling_corrections` | `number` | Enable spelling corrections (default 1) |

```js
const results = await client.search.adaptive("machine learning", { count: 50 });
```

## Full example

```js
// Search tweets with different modes
const { tweets: top } = await client.search.tweets("React vs Vue");
const { tweets: latest } = await client.search.latest("React vs Vue");
const { tweets: mediaTweets } = await client.search.media("React vs Vue");

// Search for users
const { users: devs } = await client.search.users("javascript developer");

// Get autocomplete suggestions
const suggestions = await client.search.typeahead("type");

// Search with the v2 adaptive endpoint
const adaptive = await client.search.adaptive("web development", { count: 30 });

// Search within communities
const { tweets: communityResults } =
  await client.search.communities("open source");

// Advanced search with operators
const { tweets: advanced } = await client.search.tweets(
  'from:github "open source" min_faves:100 lang:en since:2025-01-01',
);

// Paginate through results
let cursor;
for (let i = 0; i < 5; i++) {
  const page = await client.search.tweets("javascript", { count: 20, cursor });
  // process page.tweets...
  cursor = page.nextCursor;
  if (!cursor) break;
}

// Find lists about a topic
const { tweets: listResults } = await client.search.lists("machine learning");
```
