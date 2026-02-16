# Direct messages

Manage your DMs: inbox, conversations, search, blocking, and more.

## `dms.inbox(params?)`

Get your DM inbox initial state. Uses the v1.1 `dm/inbox_initial_state` endpoint.

```js
const inbox = await client.dms.inbox();
```

## `dms.conversation(conversationId, params?)`

Get a specific DM conversation by ID. Uses the v1.1 `dm/conversation` endpoint.

```js
const convo = await client.dms.conversation("1234567890-9876543210");
```

## `dms.search(query, opts?)`

Search across all DM conversations. Uses the GraphQL `DmAllSearchSlice` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `query`          | `string` | Search query                   |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const results = await client.dms.search("meeting");
```

## `dms.searchGroups(query, opts?)`

Search group DM conversations. Uses the GraphQL `DmGroupSearchSlice` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `query`          | `string` | Search query                   |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const groups = await client.dms.searchGroups("project");
```

## `dms.searchPeople(query, opts?)`

Search for people in DMs. Uses the GraphQL `DmPeopleSearchSlice` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `query`          | `string` | Search query                   |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const people = await client.dms.searchPeople("john");
```

## `dms.block(userId)`

Block a user from sending you DMs. Uses the GraphQL `dmBlockUser` mutation.

```js
await client.dms.block("44196397");
```

## `dms.unblock(userId)`

Unblock a user in DMs. Uses the GraphQL `dmUnblockUser` mutation.

```js
await client.dms.unblock("44196397");
```

## `dms.deleteConversations(conversationIds)`

Delete one or more DM conversations. Uses the v1.1 `dm/conversation/bulk_delete` endpoint.

```js
// Single conversation
await client.dms.deleteConversations("1234567890-9876543210");

// Multiple conversations
await client.dms.deleteConversations(["1234567890-9876543210", "1111111111-2222222222"]);
```

## `dms.updateLastSeen(eventId)`

Mark messages as read up to a given event ID. Uses the v1.1 `dm/update_last_seen_event_id` endpoint.

```js
await client.dms.updateLastSeen("1234567890123456789");
```

## `dms.muted(opts?)`

Get your muted DM conversations. Uses the GraphQL `DmMutedTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const muted = await client.dms.muted();
```

## `dms.edit(messageId, conversationId, text)`

Edit a DM message. Uses the v1.1 `dm/edit` endpoint.

| Param            | Type     | Description              |
| ---------------- | -------- | ------------------------ |
| `messageId`      | `string` | The message ID to edit   |
| `conversationId` | `string` | The conversation ID      |
| `text`           | `string` | New text for the message |

```js
await client.dms.edit("111222333", "1234567890-9876543210", "Updated message");
```

## `dms.permissions(params?)`

Check DM permissions. Uses the v1.1 `dm/permissions` endpoint.

```js
const perms = await client.dms.permissions();
```

## `dms.nsfwFilter(enabled)`

Toggle the NSFW media filter for DMs. Uses the GraphQL `DmNsfwMediaFilterUpdate` mutation.

```js
// Enable filter
await client.dms.nsfwFilter(true);

// Disable filter
await client.dms.nsfwFilter(false);
```

## `dms.updateRelationship(userId, action)`

Update your DM relationship state with a user. Uses the v1.1 `dm/user/update_relationship_state` endpoint.

```js
await client.dms.updateRelationship("44196397", "trust");
```

## `dms.reportSpam(conversationId, messageId)`

Report a DM as spam. Uses the v1.1 `direct_messages/report_spam` endpoint.

```js
await client.dms.reportSpam("1234567890-9876543210", "111222333");
```

## `dms.report(conversationId, messageId)`

Report a DM message. Uses the v1.1 `dm/report` endpoint.

```js
await client.dms.report("1234567890-9876543210", "111222333");
```

## `dms.userUpdates(params?)`

Get DM user updates. Uses the v1.1 `dm/user_updates` endpoint.

```js
const updates = await client.dms.userUpdates();
```

## Full example

```js
// Check your inbox
const inbox = await client.dms.inbox();

// Search for a conversation
const results = await client.dms.search("hello");

// Read a specific conversation
const convo = await client.dms.conversation("1234567890-9876543210");

// Edit a message
await client.dms.edit("111222333", "1234567890-9876543210", "corrected text");

// Block a spammer in DMs
await client.dms.block("9999999999");

// Check your muted conversations
const muted = await client.dms.muted();

// Clean up old conversations
await client.dms.deleteConversations(["1234567890-9876543210", "1111111111-2222222222"]);
```
