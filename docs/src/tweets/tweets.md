# Tweets

Create, delete, like, retweet, pin, schedule, and manage tweets.

## `tweets.create(text, opts?)`

Create a new tweet. Uses the GraphQL `CreateTweet` mutation.

| Option                     | Type       | Description                                                   |
| -------------------------- | ---------- | ------------------------------------------------------------- |
| `text`                     | `string`   | The tweet text                                                |
| `opts.mediaIds`            | `string[]` | Array of [media IDs](./media) to attach                       |
| `opts.gif`                 | `object`   | Attach a [GIF](#gifs)                                         |
| `opts.replyTo`             | `string`   | Tweet ID to reply to                                          |
| `opts.quoteTweetId`        | `string`   | Tweet ID to quote                                             |
| `opts.sensitive`           | `boolean`  | Mark media as possibly sensitive                              |
| `opts.conversationControl` | `string`   | Who can reply: `"ByInvitation"` or `"Community"`              |
| `opts.poll`                | `object`   | Attach a [poll](#polls)                                       |
| `opts.cardUri`             | `string`   | A Twitter Card URI to attach (cannot be combined with `poll`) |
| `opts.variables`           | `object`   | Additional GraphQL variables to merge                         |

```js
const tweet = await client.tweets.create("Hello world!");

// Reply to a tweet
const reply = await client.tweets.create("Great point!", {
  replyTo: "1234567890",
});

// Quote tweet
const qt = await client.tweets.create("Check this out", {
  quoteTweetId: "1234567890",
});

// With media
const media = await client.tweets.create("Photo time", {
  mediaIds: ["9876543210"],
  sensitive: false,
});

// Restrict replies
const limited = await client.tweets.create("Only mentioned can reply", {
  conversationControl: "ByInvitation",
});

// With a poll
const poll = await client.tweets.create("Best language?", {
  poll: {
    choices: ["JavaScript", "Python", "Rust"],
    duration_minutes: 1440,
  },
});

// Upload media and tweet
const { media_id } = await client.media.create("./photo.jpg", {
  alt_text: "A gorgeous sunset",
});
const mediaTweet = await client.tweets.create("Golden hour", {
  mediaIds: [media_id],
});

// With a GIF from search
const { items } = await client.search.gifs("celebration");
const gifTweet = await client.tweets.create("🎉", { gif: items[0] });
```

**Returns:** Parsed tweet object.

### Polls

Create tweets with polls by passing a `poll` option to `tweets.create()`.

#### `opts.poll`

| Field              | Type                   | Required | Description                                                         |
| ------------------ | ---------------------- | -------- | ------------------------------------------------------------------- |
| `choices`          | `string[] \| object[]` | **Yes**  | 2–4 choices — strings for text polls, objects for media polls       |
| `duration_minutes` | `number`               | No       | How long the poll stays open (default: **1440** = 24 h, max 7 days) |

Each choice can be:

- A **string** — for text-only polls (up to 25 characters)
- An **object** `{ label, image }` — for media polls, where `image` is a `media_id` from `media.create()`

#### Text poll

```js
await client.tweets.create("Tabs or spaces?", {
  poll: {
    choices: ["Tabs", "Spaces"],
  },
});
```

#### Media poll

Upload images first, then reference their `media_id` in each choice:

```js
const [a, b] = await Promise.all([
  client.media.create("./option-a.jpg"),
  client.media.create("./option-b.jpg"),
]);

await client.tweets.create("Which design do you prefer?", {
  poll: {
    choices: [
      { label: "Design A", image: a.media_id },
      { label: "Design B", image: b.media_id },
    ],
    duration_minutes: 2880, // 2 days
  },
});
```

#### Custom duration

```js
// 7-day poll
await client.tweets.create("Best frontend framework in 2026?", {
  poll: {
    choices: ["React", "Vue", "Svelte", "Angular"],
    duration_minutes: 10080,
  },
});

// Quick 30-minute poll
await client.tweets.create("Should I mass-refactor right now?", {
  poll: {
    choices: ["Do it", "Don't you dare"],
    duration_minutes: 30,
  },
});
```

#### Duration limits

| Min       | Max                     | Default              |
| --------- | ----------------------- | -------------------- |
| 5 minutes | 10 080 minutes (7 days) | 1 440 minutes (24 h) |

### Long tweets

You **must** use `tweets.createNote(text, opts?)` to write tweets longer than 260 characters, if your account has Premium. This uses the GraphQL `CreateNoteTweet` mutation.

| Option               | Type       | Description                      |
| -------------------- | ---------- | -------------------------------- |
| `text`               | `string`   | The note tweet text              |
| `opts.mediaIds`      | `string[]` | Array of media IDs to attach     |
| `opts.replyTo`       | `string`   | Tweet ID to reply to             |
| `opts.sensitive`     | `boolean`  | Mark media as possibly sensitive |
| `opts.richtext_tags` | `array`    | Rich text formatting tags        |
| `opts.variables`     | `object`   | Additional GraphQL variables     |

```js
const note = await client.tweets.createNote("This is a very long note...");
```

**Returns:** Parsed tweet object.

## `tweets.createThread(items)`

Post a thread (multiple tweets chained as replies). Each item after the first automatically replies to the previous tweet.

| Param   | Type                   | Description                                                       |
| ------- | ---------------------- | ----------------------------------------------------------------- |
| `items` | `(string \| object)[]` | Array of 2+ tweets — strings for text-only, objects for full opts |

Each object item accepts the same options as `tweets.create()` (`mediaIds`, `poll`, `sensitive`, etc.) plus a `text` field.

```js
// Simple text thread
const thread = await client.tweets.createThread([
  "1/ Here's a mass thread about JavaScript engines",
  "2/ V8 powers Chrome and Node.js",
  "3/ SpiderMonkey powers Firefox",
  "4/ JavaScriptCore powers Safari",
]);

// Mixed thread with media and polls
const img = await client.media.create("./diagram.png");
const thread = await client.tweets.createThread([
  "Let me explain how this works 🧵",
  {
    text: "Here's the architecture diagram:",
    mediaIds: [img.media_id],
  },
  {
    text: "What do you think?",
    poll: { choices: ["Love it", "Needs work"] },
  },
]);

// Each item in the returned array is a parsed tweet object
console.log(thread[0].id); // first tweet
console.log(thread[thread.length - 1].id); // last tweet
```

**Returns:** Array of parsed tweet objects, one per tweet in the thread.

## `tweets.delete(tweetId)`

Delete a tweet. Uses the GraphQL `DeleteTweet` mutation.

```js
await client.tweets.delete("1234567890");
```

## `tweets.like(tweetId)`

Like a tweet. Uses the GraphQL `FavoriteTweet` mutation.

```js
await client.tweets.like("1234567890");
```

## `tweets.unlike(tweetId)`

Unlike a tweet. Uses the GraphQL `UnfavoriteTweet` mutation.

```js
await client.tweets.unlike("1234567890");
```

## `tweets.retweet(tweetId)`

Retweet a tweet. Uses the GraphQL `CreateRetweet` mutation.

```js
await client.tweets.retweet("1234567890");
```

## `tweets.unretweet(tweetId)`

Undo a retweet. Uses the GraphQL `DeleteRetweet` mutation.

```js
await client.tweets.unretweet("1234567890");
```

## `tweets.pin(tweetId)`

Pin a tweet to your profile. Uses the GraphQL `PinTweet` mutation.

```js
await client.tweets.pin("1234567890");
```

## `tweets.unpin(tweetId)`

Unpin a tweet from your profile. Uses the GraphQL `UnpinTweet` mutation.

```js
await client.tweets.unpin("1234567890");
```

## `tweets.get(tweetId)`

Get a single tweet by ID. Uses the GraphQL `TweetResultByRestId` query.

```js
const tweet = await client.tweets.get("1234567890");
console.log(tweet.text);
console.log(tweet.user.username);
console.log(tweet.stats.likes);
```

**Returns:** Parsed tweet object.

## `tweets.getMany(tweetIds)`

Get multiple tweets by their IDs. Uses the GraphQL `TweetResultsByRestIds` query.

```js
const tweets = await client.tweets.getMany(["123", "456", "789"]);
tweets.forEach((t) => console.log(t.text));
```

**Returns:** Array of parsed tweet objects.

## `tweets.detail(tweetId, opts?)`

Get a tweet with its full conversation thread. Uses the GraphQL `TweetDetail` query.

| Option           | Type     | Description                  |
| ---------------- | -------- | ---------------------------- |
| `opts.variables` | `object` | Additional GraphQL variables |

```js
const detail = await client.tweets.detail("1234567890");
```

## `tweets.editHistory(tweetId)`

Get the edit history of a tweet. Uses the GraphQL `TweetEditHistory` query.

```js
const history = await client.tweets.editHistory("1234567890");
```

## `tweets.retweeters(tweetId, opts?)`

Get users who retweeted a tweet. Uses the GraphQL `Retweeters` query.

| Option        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `opts.count`  | `number` | Number of results (default 20) |
| `opts.cursor` | `string` | Pagination cursor              |

```js
const retweeters = await client.tweets.retweeters("1234567890");
```

## `tweets.highlight(tweetId)`

Highlight a tweet on your profile. Uses the GraphQL `CreateHighlight` mutation.

```js
await client.tweets.highlight("1234567890");
```

## `tweets.unhighlight(tweetId)`

Remove a tweet highlight. Uses the GraphQL `DeleteHighlight` mutation.

```js
await client.tweets.unhighlight("1234567890");
```

## `tweets.schedule(text, scheduledAt, opts?)`

Schedule a tweet for future posting. Uses the GraphQL `CreateScheduledTweet` mutation.

| Option          | Type           | Description                       |
| --------------- | -------------- | --------------------------------- |
| `text`          | `string`       | The tweet text                    |
| `scheduledAt`   | `string\|Date` | When to post (ISO string or Date) |
| `opts.mediaIds` | `string[]`     | Media IDs to attach               |
| `opts.replyTo`  | `string`       | Tweet ID to reply to              |

```js
await client.tweets.schedule("Good morning!", "2025-01-01T09:00:00Z");

await client.tweets.schedule("With media", new Date("2025-06-01"), {
  mediaIds: ["111222333"],
});
```

## `tweets.deleteScheduled(scheduledTweetId)`

Delete a scheduled tweet. Uses the GraphQL `DeleteScheduledTweet` mutation.

```js
await client.tweets.deleteScheduled("9876543210");
```

## `tweets.getScheduled()`

Fetch all your scheduled tweets. Uses the GraphQL `FetchScheduledTweets` query.

```js
const scheduled = await client.tweets.getScheduled();
```

## `tweets.moderate(tweetId)`

Moderate a tweet (hide it from your replies). Uses the GraphQL `ModerateTweet` mutation.

```js
await client.tweets.moderate("1234567890");
```

## `tweets.unmoderate(tweetId)`

Unmoderate a tweet. Uses the GraphQL `UnmoderateTweet` mutation.

```js
await client.tweets.unmoderate("1234567890");
```

## `tweets.pinReply(tweetId)`

Pin a reply under your tweet. Uses the GraphQL `PinReply` mutation.

```js
await client.tweets.pinReply("1234567890");
```

## `tweets.unpinReply(tweetId)`

Unpin a reply. Uses the GraphQL `UnpinReply` mutation.

```js
await client.tweets.unpinReply("1234567890");
```

## `tweets.setConversationControl(tweetId, mode)`

Change who can reply to your tweet. Uses the GraphQL `ConversationControlChange` mutation.

| Mode             | Description          |
| ---------------- | -------------------- |
| `"ByInvitation"` | Only mentioned users |
| `"Community"`    | Only followers       |

```js
await client.tweets.setConversationControl("1234567890", "ByInvitation");
```

## `tweets.removeConversationControl(tweetId)`

Remove reply restrictions from a tweet. Uses the GraphQL `ConversationControlDelete` mutation.

```js
await client.tweets.removeConversationControl("1234567890");
```

## `tweets.unmention(tweetId)`

Remove yourself from a conversation. Uses the GraphQL `UnmentionUserFromConversation` mutation.

```js
await client.tweets.unmention("1234567890");
```

## `tweets.similar(tweetId)`

Find similar posts. Uses the GraphQL `SimilarPosts` query.

```js
const similar = await client.tweets.similar("1234567890");
```

## Tweet schema

All methods that return tweets parse them into a consistent format:

```js
{
  id: "1234567890",
  text: "Hello world!",
  created_at: "Mon Jan 01 00:00:00 +0000 2025",
  conversation_id: "1234567890",
  in_reply_to_status_id: null,
  in_reply_to_user_id: null,
  in_reply_to_screen_name: null,
  user: { /* parsed user object */ },
  stats: {
    retweets: 10,
    likes: 42,
    replies: 3,
    quotes: 1,
    bookmarks: 5,
    views: 1000,
  },
  engagement: {
    retweeted: false,
    liked: true,
    bookmarked: false,
  },
  media: [],
  urls: [],
  hashtags: [],
  user_mentions: [],
  source: "Twitter Web App",
  lang: "en",
  quoting: null, // parsed quoted tweet or null
  edit_control: {},
  card: null,
  misc: { ... },
}
```
