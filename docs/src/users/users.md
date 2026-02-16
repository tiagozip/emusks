# Users

Get user profiles, follow, block, mute, manage relationships, and fetch user content.

## `users.get(userId)`

Get a user by their REST ID. Uses the GraphQL `UserByRestId` query.

```js
const user = await client.users.get("44196397");
console.log(user.name); // "Elon Musk"
console.log(user.username); // "elonmusk"
```

**Returns:** Parsed user object.

## `users.getByUsername(username)`

Get a user by their screen name. Uses the GraphQL `UserByScreenName` query.

```js
const user = await client.users.getByUsername("elonmusk");
console.log(user.id);
console.log(user.stats.followers.count);
```

**Returns:** Parsed user object.

## `users.getMany(userIds)`

Get multiple users by their REST IDs. Uses the GraphQL `UsersByRestIds` query.

```js
const users = await client.users.getMany(["44196397", "12"]);
users.forEach((u) => console.log(u.username));
```

**Returns:** Array of parsed user objects.

## `users.getManyByUsername(screenNames)`

Get multiple users by their screen names. Uses the GraphQL `UsersByScreenNames` query.

```js
const users = await client.users.getManyByUsername(["elonmusk", "jack"]);
users.forEach((u) => console.log(u.id));
```

**Returns:** Array of parsed user objects.

## User content

Fetch a user's tweets, replies, media, and highlights.

### `users.tweets(userId, opts?)`

Get a user's tweets. Uses the GraphQL `UserTweets` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `userId`         | `string` | The user's REST ID             |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets, nextCursor } = await client.users.tweets("44196397");
console.log(tweets[0].text);

// Paginate
const page2 = await client.users.tweets("44196397", { cursor: nextCursor });
```

### `users.replies(userId, opts?)`

Get a user's tweets and replies. Uses the GraphQL `UserTweetsAndReplies` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `userId`         | `string` | The user's REST ID             |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets } = await client.users.replies("44196397");
```

### `users.media(userId, opts?)`

Get a user's media tweets. Uses the GraphQL `UserMedia` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `userId`         | `string` | The user's REST ID             |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets } = await client.users.media("44196397", { count: 40 });
```

### `users.highlights(userId, opts?)`

Get a user's highlighted tweets. Uses the GraphQL `UserHighlightsTweets` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `userId`         | `string` | The user's REST ID             |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets } = await client.users.highlights("44196397");
```

## Relationships

### `users.followers(userId, opts?)`

Get a user's followers. Uses the GraphQL `Followers` query.

| Option        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `opts.count`  | `number` | Number of results (default 20) |
| `opts.cursor` | `string` | Pagination cursor              |

```js
const { users, nextCursor } = await client.users.followers("44196397", {
  count: 50,
});
```

### `users.following(userId, opts?)`

Get users that a user is following. Uses the GraphQL `Following` query.

| Option        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `opts.count`  | `number` | Number of results (default 20) |
| `opts.cursor` | `string` | Pagination cursor              |

```js
const { users } = await client.users.following("44196397");
```

### `users.verifiedFollowers(userId, opts?)`

Get a user's verified (Blue) followers. Uses the GraphQL `BlueVerifiedFollowers` query.

| Option        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `opts.count`  | `number` | Number of results (default 20) |
| `opts.cursor` | `string` | Pagination cursor              |

```js
const { users } = await client.users.verifiedFollowers("44196397");
```

### `users.followersYouKnow(userId, opts?)`

Get followers of a user that you also follow. Uses the GraphQL `FollowersYouKnow` query.

| Option        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `opts.count`  | `number` | Number of results (default 20) |
| `opts.cursor` | `string` | Pagination cursor              |

```js
const { users } = await client.users.followersYouKnow("44196397");
```

### `users.follow(userId)`

Follow a user. Uses the v1.1 `friendships/create` endpoint.

```js
const user = await client.users.follow("44196397");
console.log(user.username); // "elonmusk"
```

**Returns:** Parsed user object.

### `users.unfollow(userId)`

Unfollow a user. Uses the v1.1 `friendships/destroy` endpoint.

```js
await client.users.unfollow("44196397");
```

**Returns:** Parsed user object.

### `users.block(userId)`

Block a user. Uses the v1.1 `blocks/create` endpoint.

```js
await client.users.block("44196397");
```

**Returns:** Parsed user object.

### `users.unblock(userId)`

Unblock a user. Uses the v1.1 `blocks/destroy` endpoint.

```js
await client.users.unblock("44196397");
```

**Returns:** Parsed user object.

### `users.mute(userId)`

Mute a user. Uses the v1.1 `mutes/users/create` endpoint.

```js
await client.users.mute("44196397");
```

**Returns:** Parsed user object.

### `users.unmute(userId)`

Unmute a user. Uses the v1.1 `mutes/users/destroy` endpoint.

```js
await client.users.unmute("44196397");
```

**Returns:** Parsed user object.

### `users.removeFollower(userId)`

Remove a user from your followers. Uses the GraphQL `RemoveFollower` mutation.

```js
await client.users.removeFollower("44196397");
```

### `users.blocked(opts?)`

Get all accounts you have blocked. Uses the GraphQL `BlockedAccountsAll` query.

| Option        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `opts.count`  | `number` | Number of results (default 20) |
| `opts.cursor` | `string` | Pagination cursor              |

```js
const { users } = await client.users.blocked({ count: 100 });
```

### `users.muted(opts?)`

Get all accounts you have muted. Uses the GraphQL `MutedAccounts` query.

| Option        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `opts.count`  | `number` | Number of results (default 20) |
| `opts.cursor` | `string` | Pagination cursor              |

```js
const { users } = await client.users.muted();
```

## Profile management

### `users.lookup(params?)`

Look up users via the v1.1 `users/lookup` endpoint. Supports lookup by `user_id` or `screen_name`.

```js
// By user IDs
const users = await client.users.lookup({ user_id: "44196397,12" });

// By screen names
const users = await client.users.lookup({ screen_name: "elonmusk,jack" });
```

### `users.updateProfile(params?)`

Update your profile. Uses the v1.1 `account/update_profile` endpoint.

| Param         | Type     | Description  |
| ------------- | -------- | ------------ |
| `name`        | `string` | Display name |
| `description` | `string` | Bio          |
| `location`    | `string` | Location     |
| `url`         | `string` | Website URL  |

```js
const updated = await client.users.updateProfile({
  name: "New Name",
  description: "Updated bio",
  location: "San Francisco, CA",
  url: "https://example.com",
});
```

**Returns:** Parsed user object.

### `users.updateProfileImage(imageData)`

Update your profile picture. Uses the v1.1 `account/update_profile_image` endpoint.

```js
await client.users.updateProfileImage(base64ImageData);
```

### `users.updateProfileBanner(bannerData)`

Update your profile banner. Uses the v1.1 `account/update_profile_banner` endpoint.

```js
await client.users.updateProfileBanner(base64BannerData);
```

### `users.removeProfileBanner()`

Remove your profile banner. Uses the v1.1 `account/remove_profile_banner` endpoint.

```js
await client.users.removeProfileBanner();
```

## Subscriptions

### `users.subscriptions(userId, opts?)`

Get a user's creator subscriptions. Uses the GraphQL `UserCreatorSubscriptions` query.

| Option        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `opts.count`  | `number` | Number of results (default 20) |
| `opts.cursor` | `string` | Pagination cursor              |

```js
const { users } = await client.users.subscriptions("44196397");
```

### `users.subscribers(userId, opts?)`

Get a user's creator subscribers. Uses the GraphQL `UserCreatorSubscribers` query.

| Option        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `opts.count`  | `number` | Number of results (default 20) |
| `opts.cursor` | `string` | Pagination cursor              |

```js
const { users } = await client.users.subscribers("44196397");
```

### `users.superFollowers(opts?)`

Get your super followers. Uses the GraphQL `SuperFollowers` query.

| Option        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `opts.count`  | `number` | Number of results (default 20) |
| `opts.cursor` | `string` | Pagination cursor              |

```js
const { users } = await client.users.superFollowers();
```

### `users.recommendations(params?)`

Get user recommendations. Uses the v1.1 `users/recommendations` endpoint.

```js
const recs = await client.users.recommendations();
```

## Paginated response format

All paginated methods (`tweets`, `replies`, `media`, `highlights`, `followers`, `following`, `blocked`, `muted`, etc.) return:

```js
{
  tweets: [ /* parsed tweet objects */ ],
  users: [ /* parsed user objects */ ],
  nextCursor: "DAABCgAB...",
  previousCursor: "DAABCgAA...",
  raw: { /* original Twitter response */ },
}
```

Content methods populate `tweets`, relationship methods populate `users`. Pass `nextCursor` as `opts.cursor` to fetch the next page.

## User schema

All methods that return users parse them into a consistent format:

```js
{
  id: "44196397",
  name: "Elon Musk",
  username: "elonmusk",
  description: "...",
  banner: "https://pbs.twimg.com/...",
  url: "https://t.co/...",
  location: "Earth",
  protected: false,
  created_at: "Tue Jun 02 20:12:29 +0000 2009",
  backgroundColor: "...",
  profile_picture: {
    url: "https://pbs.twimg.com/...",
    shape: "Circle",
  },
  stats: {
    followers: {
      count: 200000000,
      fast_followers: 0,
      normal_followers: 200000000,
    },
    following: 900,
    subscriptions_count: 0,
    likes: 50000,
    listed: 150000,
    media: 2000,
    posts: 40000,
  },
  verification: {
    verified: false,
    premium_verified: true,
  },
  pinned_tweets: ["1234567890"],
  birthdate: {},
  labels: {
    parody_commentary_fan_label: "None",
    highlightedLabel: undefined,
  },
  misc: { ... },
}
```
