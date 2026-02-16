# Preferences

Manage your content preferences: muted keywords, advanced mute filters, and personalization settings.

## Muted Keywords

Muted keywords let you hide tweets containing specific words, phrases, or hashtags from your timelines and notifications.

### `account.mutedKeywords()`

Get all your currently muted keywords. Uses the v1.1 `mutes/keywords/list` endpoint.

```js
const keywords = await client.account.mutedKeywords();
console.log(`${keywords.length} muted keywords`);
```

### `account.updateMutedKeyword(params?)`

Create or update a muted keyword. Uses the v1.1 `mutes/keywords/update` endpoint.

| Param                  | Type     | Description                                                       |
| ---------------------- | -------- | ----------------------------------------------------------------- |
| `params.id`            | `string` | The keyword mute ID (omit to create a new mute)                   |
| `params.keyword`       | `string` | The word, phrase, or hashtag to mute                              |
| `params.mute_surfaces` | `string` | Where to apply the mute (e.g. `"home_timeline,notifications"`)    |
| `params.duration`      | `number` | Duration in seconds (`0` for forever, `86400` for 24 hours, etc.) |

```js
// Mute a keyword everywhere, forever
await client.account.updateMutedKeyword({
  keyword: "spoiler",
  mute_surfaces: "home_timeline,notifications",
  duration: 0,
});

// Mute a keyword for 24 hours
await client.account.updateMutedKeyword({
  keyword: "gameofthrones",
  mute_surfaces: "home_timeline,notifications",
  duration: 86400,
});

// Update an existing muted keyword
await client.account.updateMutedKeyword({
  id: "keyword_id_123",
  keyword: "spoiler",
  mute_surfaces: "home_timeline",
  duration: 604800, // 7 days
});
```

### `account.deleteMutedKeyword(keywordId)`

Remove a muted keyword. Uses the v1.1 `mutes/keywords/destroy` endpoint.

```js
await client.account.deleteMutedKeyword("keyword_id_123");
```

## Advanced Mute Filters

Advanced filters let you automatically hide tweets from accounts that match certain criteria, such as new accounts, accounts without profile pictures, or unverified accounts.

### `account.advancedFilters()`

Get your current advanced mute filter settings. Uses the v1.1 `mutes/advanced_filters` endpoint (GET).

```js
const filters = await client.account.advancedFilters();
console.log(filters);
```

### `account.updateAdvancedFilters(params?)`

Update your advanced mute filter settings. Uses the v1.1 `mutes/advanced_filters` endpoint (POST).

| Param                               | Type      | Description                                         |
| ----------------------------------- | --------- | --------------------------------------------------- |
| `params.mute_new_accounts`          | `boolean` | Hide tweets from recently created accounts          |
| `params.mute_not_following`         | `boolean` | Hide tweets from accounts you don't follow          |
| `params.mute_default_profile_image` | `boolean` | Hide tweets from accounts with default avatars      |
| `params.mute_no_confirmed_email`    | `boolean` | Hide tweets from accounts without a confirmed email |
| `params.mute_no_confirmed_phone`    | `boolean` | Hide tweets from accounts without a confirmed phone |

```js
await client.account.updateAdvancedFilters({
  mute_new_accounts: true,
  mute_not_following: false,
  mute_default_profile_image: true,
  mute_no_confirmed_email: true,
  mute_no_confirmed_phone: false,
});
```

::: tip
Advanced mute filters are a great way to reduce spam and low-quality content in your notifications without having to manually block or mute individual accounts.
:::

## Personalization

### `account.personalizationInterests()`

Get the interests Twitter has inferred about you based on your activity. These interests are used to personalize your timeline, ads, and recommendations. Uses the v1.1 `account/personalization/twitter_interests` endpoint.

```js
const interests = await client.account.personalizationInterests();
console.log(interests);
```

### `account.preferences()`

Get your general user preferences. Uses the GraphQL `UserPreferences` query.

```js
const prefs = await client.account.preferences();
console.log(prefs);
```

## Full example

```js
// View all muted keywords
const keywords = await client.account.mutedKeywords();
console.log(`Currently muting ${keywords.length} keywords`);

// Mute spoilers for a week
await client.account.updateMutedKeyword({
  keyword: "spoilers",
  mute_surfaces: "home_timeline,notifications",
  duration: 604800,
});

// Mute a hashtag forever
await client.account.updateMutedKeyword({
  keyword: "#Spoiler",
  mute_surfaces: "home_timeline,notifications",
  duration: 0,
});

// Remove a muted keyword when you're done
await client.account.deleteMutedKeyword("keyword_id_123");

// Check current advanced filters
const filters = await client.account.advancedFilters();
console.log(`Advanced filters: ${JSON.stringify(filters)}`);

// Enable aggressive spam filtering
await client.account.updateAdvancedFilters({
  mute_new_accounts: true,
  mute_default_profile_image: true,
  mute_no_confirmed_email: true,
  mute_no_confirmed_phone: true,
});

// See what Twitter thinks you're interested in
const interests = await client.account.personalizationInterests();
console.log(`Twitter thinks you're interested in: ${JSON.stringify(interests)}`);

// Get general preferences
const prefs = await client.account.preferences();
console.log(`Preferences: ${JSON.stringify(prefs)}`);
```
