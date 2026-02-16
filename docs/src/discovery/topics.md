# Topics

Follow, unfollow, and manage Twitter/X topics.

## `topics.follow(topicId)`

Follow a topic. Uses the GraphQL `TopicFollow` mutation.

```js
await client.topics.follow("123456789");
```

## `topics.unfollow(topicId)`

Unfollow a topic. Uses the GraphQL `TopicUnfollow` mutation.

```js
await client.topics.unfollow("123456789");
```

## `topics.notInterested(topicId)`

Mark a topic as "Not Interested". Uses the GraphQL `TopicNotInterested` mutation.

```js
await client.topics.notInterested("123456789");
```

## `topics.undoNotInterested(topicId)`

Undo a "Not Interested" action on a topic. Uses the GraphQL `TopicUndoNotInterested` mutation.

```js
await client.topics.undoNotInterested("123456789");
```

## `topics.get(topicId)`

Get a topic by its REST ID. Uses the GraphQL `TopicByRestId` query.

```js
const topic = await client.topics.get("123456789");
```

## `topics.landingPage(topicId, opts?)`

Get the landing page for a topic (tweets, related content). Uses the GraphQL `TopicLandingPage` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const page = await client.topics.landingPage("123456789");

// Paginate
const next = await client.topics.landingPage("123456789", {
  cursor: "DAABCgAB...",
});

// Fetch more
const more = await client.topics.landingPage("123456789", { count: 50 });
```

## `topics.toFollow(opts?)`

Get suggested topics to follow (sidebar suggestions). Uses the GraphQL `TopicToFollowSidebar` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const suggestions = await client.topics.toFollow();
```

## `topics.manage(opts?)`

Get your topics management page (all followed topics, not interested topics). Uses the GraphQL `TopicsManagementPage` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const managed = await client.topics.manage();
```

## `topics.picker(opts?)`

Get the topic picker page (for onboarding or discovery). Uses the GraphQL `TopicsPickerPage` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const picker = await client.topics.picker();
```

## `topics.pickerById(topicId, opts?)`

Get the topic picker page for a specific topic. Uses the GraphQL `TopicsPickerPageById` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `topicId`        | `string` | The topic ID                   |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const picker = await client.topics.pickerById("123456789");
```

## `topics.viewing(userId, opts?)`

View the topics another user follows. Uses the GraphQL `ViewingOtherUsersTopicsPage` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `userId`         | `string` | The user's REST ID             |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const userTopics = await client.topics.viewing("44196397");
```

## Full example

```js
// Discover topics to follow
const suggestions = await client.topics.toFollow();

// Browse the topic picker
const picker = await client.topics.picker();

// Follow a topic
await client.topics.follow("123456789");

// Get topic details
const topic = await client.topics.get("123456789");

// Browse topic content
const content = await client.topics.landingPage("123456789", { count: 30 });

// Paginate through topic content
const page2 = await client.topics.landingPage("123456789", {
  cursor: "DAABCgAB...",
});

// Mark a topic as not interesting
await client.topics.notInterested("987654321");

// Undo that action
await client.topics.undoNotInterested("987654321");

// Manage your followed topics
const managed = await client.topics.manage();

// See what topics another user follows
const theirTopics = await client.topics.viewing("44196397");

// Unfollow a topic
await client.topics.unfollow("123456789");
```
