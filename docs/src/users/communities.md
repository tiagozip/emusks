# Communities

Create, join, manage, and moderate Twitter/X communities.

## `communities.create(name, opts?)`

Create a new community. Uses the GraphQL `CreateCommunity` mutation.

| Option             | Type     | Description                  |
| ------------------ | -------- | ---------------------------- |
| `name`             | `string` | The community name           |
| `opts.description` | `string` | Community description        |
| `opts.rules`       | `array`  | Initial community rules      |
| `opts.variables`   | `object` | Additional GraphQL variables |

```js
await client.communities.create("JavaScript Enthusiasts");

await client.communities.create("Rust Developers", {
  description: "A community for Rust programmers",
  rules: [{ name: "Be respectful" }, { name: "No spam" }],
});
```

## `communities.get(communityId)`

Get a community by its REST ID. Uses the GraphQL `CommunityByRestId` query.

```js
const community = await client.communities.get("1234567890");
```

## `communities.join(communityId)`

Join a community. Uses the GraphQL `JoinCommunity` mutation.

```js
await client.communities.join("1234567890");
```

## `communities.leave(communityId)`

Leave a community. Uses the GraphQL `LeaveCommunity` mutation.

```js
await client.communities.leave("1234567890");
```

## `communities.requestJoin(communityId, opts?)`

Request to join a community that requires approval. Uses the GraphQL `RequestToJoinCommunity` mutation.

| Option        | Type     | Description                        |
| ------------- | -------- | ---------------------------------- |
| `opts.answer` | `string` | Answer to the community's question |

```js
await client.communities.requestJoin("1234567890");

await client.communities.requestJoin("1234567890", {
  answer: "I love TypeScript and have 5 years of experience",
});
```

## `communities.timeline(communityId, opts?)`

Get the community's tweet timeline. Uses the GraphQL `CommunityTweetsTimeline` query.

| Option             | Type     | Description                                        |
| ------------------ | -------- | -------------------------------------------------- |
| `opts.count`       | `number` | Number of results (default 20)                     |
| `opts.cursor`      | `string` | Pagination cursor                                  |
| `opts.rankingMode` | `string` | `"Recency"` or `"Relevance"` (default `"Recency"`) |
| `opts.variables`   | `object` | Additional GraphQL variables                       |

```js
const tweets = await client.communities.timeline("1234567890");

// Ranked by relevance
const top = await client.communities.timeline("1234567890", {
  rankingMode: "Relevance",
  count: 50,
});

// Paginate
const next = await client.communities.timeline("1234567890", {
  cursor: "DAABCgAB...",
});
```

## `communities.media(communityId, opts?)`

Get media tweets from a community. Uses the GraphQL `CommunityMediaTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const media = await client.communities.media("1234567890", { count: 40 });
```

## `communities.about(communityId, opts?)`

Get the community's about timeline. Uses the GraphQL `CommunityAboutTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const about = await client.communities.about("1234567890");
```

## `communities.hashtags(communityId, opts?)`

Get trending hashtags for a community. Uses the GraphQL `CommunityHashtagsTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const hashtags = await client.communities.hashtags("1234567890");
```

## `communities.editName(communityId, name)`

Rename a community. Uses the GraphQL `CommunityEditName` mutation.

```js
await client.communities.editName("1234567890", "New Community Name");
```

## `communities.editPurpose(communityId, purpose)`

Update a community's purpose/description. Uses the GraphQL `CommunityEditPurpose` mutation.

```js
await client.communities.editPurpose("1234567890", "A place for web developers");
```

## `communities.editBanner(communityId, mediaId)`

Update a community's banner image. Uses the GraphQL `CommunityEditBannerMedia` mutation.

```js
await client.communities.editBanner("1234567890", "9876543210");
```

## `communities.removeBanner(communityId)`

Remove a community's banner image. Uses the GraphQL `CommunityRemoveBannerMedia` mutation.

```js
await client.communities.removeBanner("1234567890");
```

## `communities.createRule(communityId, name, opts?)`

Add a rule to a community. Uses the GraphQL `CommunityCreateRule` mutation.

| Option             | Type     | Description      |
| ------------------ | -------- | ---------------- |
| `communityId`      | `string` | The community ID |
| `name`             | `string` | Rule name/title  |
| `opts.description` | `string` | Rule description |

```js
await client.communities.createRule("1234567890", "No spam", {
  description: "Do not post promotional content or repetitive links",
});
```

## `communities.editRule(communityId, ruleId, name, opts?)`

Edit an existing community rule. Uses the GraphQL `CommunityEditRule` mutation.

| Option             | Type     | Description              |
| ------------------ | -------- | ------------------------ |
| `communityId`      | `string` | The community ID         |
| `ruleId`           | `string` | The rule ID to edit      |
| `name`             | `string` | Updated rule name        |
| `opts.description` | `string` | Updated rule description |

```js
await client.communities.editRule("1234567890", "rule123", "Be kind", {
  description: "Treat all members with respect",
});
```

## `communities.removeRule(communityId, ruleId)`

Remove a community rule. Uses the GraphQL `CommunityRemoveRule` mutation.

```js
await client.communities.removeRule("1234567890", "rule123");
```

## `communities.reorderRules(communityId, ruleIds)`

Reorder community rules. Uses the GraphQL `CommunityReorderRules` mutation.

```js
await client.communities.reorderRules("1234567890", ["rule3", "rule1", "rule2"]);
```

## `communities.editQuestion(communityId, question)`

Set the join question for a community. Uses the GraphQL `CommunityEditQuestion` mutation.

```js
await client.communities.editQuestion("1234567890", "Why do you want to join?");
```

## `communities.updateRole(communityId, userId, role)`

Update a member's role within a community. Uses the GraphQL `CommunityUpdateRole` mutation.

```js
await client.communities.updateRole("1234567890", "44196397", "Moderator");
```

## `communities.invite(communityId, userId)`

Invite a user to join a community. Uses the GraphQL `CommunityUserInvite` mutation.

```js
await client.communities.invite("1234567890", "44196397");
```

## `communities.keepTweet(communityId, tweetId)`

Keep a reported tweet in the community (moderation action). Uses the GraphQL `CommunityModerationKeepTweet` mutation.

```js
await client.communities.keepTweet("1234567890", "9876543210");
```

## `communities.moderationCases(communityId, opts?)`

Get pending moderation cases for a community. Uses the GraphQL `CommunityModerationTweetCasesSlice` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const cases = await client.communities.moderationCases("1234567890");
```

## `communities.moderationLog(communityId, opts?)`

Get the moderation log for a community. Uses the GraphQL `CommunityTweetModerationLogSlice` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const log = await client.communities.moderationLog("1234567890", { count: 50 });
```

## `communities.explore(opts?)`

Explore communities. Uses the GraphQL `CommunitiesExploreTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const explore = await client.communities.explore();
```

## `communities.discover(opts?)`

Get community discovery suggestions. Uses the GraphQL `CommunitiesMainDiscoveryModule` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const suggestions = await client.communities.discover();
```

## `communities.ranked(opts?)`

Get the ranked communities timeline. Uses the GraphQL `CommunitiesRankedTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const ranked = await client.communities.ranked();
```

## `communities.memberships(userId, opts?)`

Get communities a user is a member of. Uses the GraphQL `CommunitiesMembershipsTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `userId`         | `string` | The user's REST ID             |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const memberships = await client.communities.memberships("44196397");
```

## `communities.memberSearch(communityId, query, opts?)`

Search for members within a community. Uses the GraphQL `CommunityMemberRelationshipTypeahead` query.

| Option        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `communityId` | `string` | The community ID               |
| `query`       | `string` | Search query                   |
| `opts.count`  | `number` | Number of results (default 20) |

```js
const members = await client.communities.memberSearch("1234567890", "john");
```

## `communities.userSearch(communityId, query, opts?)`

Search for users to invite to a community. Uses the GraphQL `CommunityUserRelationshipTypeahead` query.

| Option        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `communityId` | `string` | The community ID               |
| `query`       | `string` | Search query                   |
| `opts.count`  | `number` | Number of results (default 20) |

```js
const users = await client.communities.userSearch("1234567890", "jane");
```

## Full example

```js
// Explore communities
const explore = await client.communities.explore();

// Join a community
await client.communities.join("1234567890");

// Browse the timeline
const tweets = await client.communities.timeline("1234567890");

// Check media
const media = await client.communities.media("1234567890");

// See your memberships
const memberships = await client.communities.memberships(client.user.id);

// Create your own community
await client.communities.create("My Community", {
  description: "A community for developers",
});

// Set up rules
await client.communities.createRule(communityId, "Be respectful");
await client.communities.createRule(communityId, "Stay on topic", {
  description: "Keep discussions relevant to development",
});
await client.communities.editQuestion(communityId, "What programming languages do you use?");

// Invite members
await client.communities.invite(communityId, "44196397");

// Moderate
const cases = await client.communities.moderationCases(communityId);
await client.communities.keepTweet(communityId, tweetId);

// Update settings
await client.communities.editName(communityId, "Dev Community");
await client.communities.editPurpose(communityId, "Updated purpose");

// Leave when done
await client.communities.leave("1234567890");
```
