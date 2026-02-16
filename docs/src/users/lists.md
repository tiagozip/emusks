# Lists

Create, manage, and interact with Twitter/X lists.

## `lists.create(name, opts?)`

Create a new list. Uses the GraphQL `CreateList` mutation.

| Option             | Type      | Description                           |
| ------------------ | --------- | ------------------------------------- |
| `name`             | `string`  | The list name                         |
| `opts.private`     | `boolean` | Make the list private (default false) |
| `opts.description` | `string`  | List description                      |

```js
await client.lists.create("Tech News");

// Private list with description
await client.lists.create("My Favorites", {
  private: true,
  description: "People I follow closely",
});
```

## `lists.delete(listId)`

Delete a list you own. Uses the GraphQL `DeleteList` mutation.

```js
await client.lists.delete("1234567890");
```

## `lists.update(listId, opts?)`

Update a list's name, description, or visibility. Uses the GraphQL `UpdateList` mutation.

| Option             | Type      | Description       |
| ------------------ | --------- | ----------------- |
| `listId`           | `string`  | The list ID       |
| `opts.name`        | `string`  | New name          |
| `opts.description` | `string`  | New description   |
| `opts.private`     | `boolean` | Change visibility |

```js
await client.lists.update("1234567890", {
  name: "Renamed List",
  description: "Updated description",
  private: false,
});
```

## `lists.get(listId)`

Get a list by its REST ID. Uses the GraphQL `ListByRestId` query.

```js
const list = await client.lists.get("1234567890");
```

## `lists.getBySlug(slug, opts?)`

Get a list by its slug and owner screen name. Uses the GraphQL `ListBySlug` query.

| Option                 | Type     | Description               |
| ---------------------- | -------- | ------------------------- |
| `slug`                 | `string` | The list slug             |
| `opts.ownerScreenName` | `string` | The list owner's username |

```js
const list = await client.lists.getBySlug("tech-news", {
  ownerScreenName: "elonmusk",
});
```

## `lists.addMember(listId, userId)`

Add a user to a list. Uses the GraphQL `ListAddMember` mutation.

```js
await client.lists.addMember("1234567890", "44196397");
```

## `lists.removeMember(listId, userId)`

Remove a user from a list. Uses the GraphQL `ListRemoveMember` mutation.

```js
await client.lists.removeMember("1234567890", "44196397");
```

## `lists.members(listId, opts?)`

Get the members of a list. Uses the GraphQL `ListMembers` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const members = await client.lists.members("1234567890", { count: 50 });
```

## `lists.subscribers(listId, opts?)`

Get users who have subscribed to a list. Uses the GraphQL `ListSubscribers` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const subs = await client.lists.subscribers("1234567890");
```

## `lists.subscribe(listId)`

Subscribe to a list. Uses the GraphQL `ListSubscribe` mutation.

```js
await client.lists.subscribe("1234567890");
```

## `lists.unsubscribe(listId)`

Unsubscribe from a list. Uses the GraphQL `ListUnsubscribe` mutation.

```js
await client.lists.unsubscribe("1234567890");
```

## `lists.mute(listId)`

Mute a list (hide its tweets from your timeline). Uses the GraphQL `MuteList` mutation.

```js
await client.lists.mute("1234567890");
```

## `lists.unmute(listId)`

Unmute a list. Uses the GraphQL `UnmuteList` mutation.

```js
await client.lists.unmute("1234567890");
```

## `lists.timeline(listId, opts?)`

Get the latest tweets from a list. Uses the GraphQL `ListLatestTweetsTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const tweets = await client.lists.timeline("1234567890");

// Paginate
const next = await client.lists.timeline("1234567890", { cursor: "DAABCgAB..." });
```

## `lists.ranked(listId, opts?)`

Get ranked (algorithmic) tweets from a list. Uses the GraphQL `ListRankedTweetsTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const ranked = await client.lists.ranked("1234567890");
```

## `lists.search(listId, query, opts?)`

Search tweets within a list. Uses the GraphQL `ListSearchTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `listId`         | `string` | The list ID                    |
| `query`          | `string` | Search query                   |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const results = await client.lists.search("1234567890", "breaking news");
```

## `lists.ownerships(userId, opts?)`

Get lists owned by a user. Uses the GraphQL `ListOwnerships` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `userId`         | `string` | The user's REST ID             |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const owned = await client.lists.ownerships("44196397");
```

## `lists.memberships(userId, opts?)`

Get lists a user is a member of. Uses the GraphQL `ListMemberships` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `userId`         | `string` | The user's REST ID             |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const memberships = await client.lists.memberships("44196397");
```

## `lists.discover(opts?)`

Discover suggested lists. Uses the GraphQL `ListsDiscovery` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const suggestions = await client.lists.discover();
```

## `lists.combined(opts?)`

Get your combined lists view. Uses the GraphQL `CombinedLists` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const all = await client.lists.combined();
```

## `lists.manage(opts?)`

Get the list management page timeline. Uses the GraphQL `ListsManagementPageTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const managed = await client.lists.manage();
```

## `lists.editBanner(listId, mediaId)`

Update a list's banner image. Uses the GraphQL `EditListBanner` mutation.

```js
await client.lists.editBanner("1234567890", "9876543210");
```

## `lists.deleteBanner(listId)`

Remove a list's banner image. Uses the GraphQL `DeleteListBanner` mutation.

```js
await client.lists.deleteBanner("1234567890");
```

## `lists.pinTimeline(timelineId)`

Pin a list timeline to your home tabs. Uses the GraphQL `PinTimeline` mutation.

```js
await client.lists.pinTimeline("list-1234567890");
```

## `lists.unpinTimeline(timelineId)`

Unpin a list timeline from your home tabs. Uses the GraphQL `UnpinTimeline` mutation.

```js
await client.lists.unpinTimeline("list-1234567890");
```

## `lists.pinned()`

Get your pinned list timelines. Uses the GraphQL `PinnedTimelines` query.

```js
const pinned = await client.lists.pinned();
```

## Full example

```js
// Create a list
await client.lists.create("JavaScript Devs", {
  description: "Great JS developers to follow",
  private: false,
});

// Add members
await client.lists.addMember(listId, "44196397");
await client.lists.addMember(listId, "12");

// Browse the list timeline
const tweets = await client.lists.timeline(listId, { count: 30 });

// Search within the list
const results = await client.lists.search(listId, "React");

// Pin it to home
await client.lists.pinTimeline(`list-${listId}`);

// Check who's subscribed
const subs = await client.lists.subscribers(listId);

// See all your lists
const myLists = await client.lists.ownerships(client.user.id);

// Discover new lists
const suggestions = await client.lists.discover();

// Clean up
await client.lists.removeMember(listId, "12");
await client.lists.delete(listId);
```
