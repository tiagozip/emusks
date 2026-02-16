# Spaces

Get, search, and interact with Twitter/X Spaces (live audio rooms).

## `spaces.get(spaceId)`

Get details about a Space by its ID. Uses the GraphQL `AudioSpaceById` query.

```js
const space = await client.spaces.get("1eaKbrPZlbwKX");
console.log(space);
```

## `spaces.search(query, opts?)`

Search for Spaces. Uses the GraphQL `AudioSpaceSearch` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `query`          | `string` | Search query                   |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const results = await client.spaces.search("tech talk");

// Paginate
const next = await client.spaces.search("tech talk", { cursor: "DAABCgAB..." });
```

## `spaces.browseTopics(opts?)`

Browse available Space topics. Uses the GraphQL `BrowseSpaceTopics` query.

| Option           | Type     | Description                  |
| ---------------- | -------- | ---------------------------- |
| `opts.variables` | `object` | Additional GraphQL variables |

```js
const topics = await client.spaces.browseTopics();
```

## `spaces.subscribe(spaceId)`

Subscribe to a scheduled Space to get notified when it starts. Uses the GraphQL `SubscribeToScheduledSpace` mutation.

```js
await client.spaces.subscribe("1eaKbrPZlbwKX");
```

## `spaces.unsubscribe(spaceId)`

Unsubscribe from a scheduled Space. Uses the GraphQL `UnsubscribeFromScheduledSpace` mutation.

```js
await client.spaces.unsubscribe("1eaKbrPZlbwKX");
```

## `spaces.addSharing(spaceId)`

Share a Space (add sharing). Uses the GraphQL `AudioSpaceAddSharing` mutation.

```js
await client.spaces.addSharing("1eaKbrPZlbwKX");
```

## `spaces.deleteSharing(spaceId)`

Remove sharing from a Space. Uses the GraphQL `AudioSpaceDeleteSharing` mutation.

```js
await client.spaces.deleteSharing("1eaKbrPZlbwKX");
```

## Full example

```js
// Search for live spaces
const results = await client.spaces.search("AI discussion");

// Get details about a specific space
const space = await client.spaces.get("1eaKbrPZlbwKX");

// Browse available topics
const topics = await client.spaces.browseTopics();

// Subscribe to an upcoming space
await client.spaces.subscribe("1eaKbrPZlbwKX");

// Share a space
await client.spaces.addSharing("1eaKbrPZlbwKX");

// Later, unsubscribe
await client.spaces.unsubscribe("1eaKbrPZlbwKX");
```
