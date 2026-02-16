# Timelines

Fetch home timelines and other feed-like content.

## Response format

All timeline methods return a parsed object:

```js
{
  tweets: [ /* parsed tweet objects */ ],
  users: [ /* parsed user objects (when applicable) */ ],
  nextCursor: "DAABCgAB...",      // pass to opts.cursor for the next page
  previousCursor: "DAABCgAA...",  // pass to opts.cursor to go back
  raw: { /* original Twitter response */ },
}
```

## `timelines.home(opts?)`

Get your home timeline (algorithmic). Uses the GraphQL `HomeTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets, nextCursor } = await client.timelines.home();
console.log(tweets[0].text);

// Paginate
const page2 = await client.timelines.home({ cursor: nextCursor });

// Fetch more
const big = await client.timelines.home({ count: 50 });
```

## `timelines.homeLatest(opts?)`

Get your home timeline sorted by latest (chronological). Uses the GraphQL `HomeLatestTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets } = await client.timelines.homeLatest();
```

## `timelines.connect(opts?)`

Get the "Connect" tab timeline (who to follow suggestions, etc.). Uses the GraphQL `ConnectTabTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { users } = await client.timelines.connect();
```

## `timelines.moderated(opts?)`

Get the moderated timeline (tweets hidden from your profile). Uses the GraphQL `ModeratedTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets } = await client.timelines.moderated();
```

## `timelines.creatorSubscriptions(opts?)`

Get the creator subscriptions timeline. Uses the GraphQL `CreatorSubscriptionsTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets } = await client.timelines.creatorSubscriptions();
```

## Pagination

All timeline methods return `nextCursor` and `previousCursor` automatically. Pass them as `opts.cursor`:

```js
// First page
const page1 = await client.timelines.home({ count: 20 });
console.log(page1.tweets);

// Next page
const page2 = await client.timelines.home({ cursor: page1.nextCursor });

// Collect multiple pages
const allTweets = [];
let cursor;
for (let i = 0; i < 5; i++) {
  const page = await client.timelines.home({ count: 20, cursor });
  allTweets.push(...page.tweets);
  cursor = page.nextCursor;
  if (!cursor) break;
}
```
