# Settings

Manage your general account settings including language, timezone, discoverability, and data saver preferences.

## `account.settings()`

Get your current account settings. Uses the v1.1 `account/settings` endpoint.

```js
const settings = await client.account.settings();
console.log(settings.screen_name);
console.log(settings.language);
console.log(settings.time_zone);
```

## `account.updateSettings(params?)`

Update your account settings. Uses the v1.1 `account/settings` endpoint (POST).

| Param                          | Type      | Description                         |
| ------------------------------ | --------- | ----------------------------------- |
| `params.language`              | `string`  | Language code (e.g. `"en"`, `"ja"`) |
| `params.time_zone`             | `string`  | Timezone name (e.g. `"US/Eastern"`) |
| `params.sleep_time_enabled`    | `boolean` | Enable quiet hours                  |
| `params.start_sleep_time`      | `number`  | Quiet hours start (0–23)            |
| `params.end_sleep_time`        | `number`  | Quiet hours end (0–23)              |
| `params.trend_location_woeid`  | `number`  | Trend location WOEID                |
| `params.discoverable_by_email` | `boolean` | Allow others to find you by email   |
| `params.discoverable_by_phone` | `boolean` | Allow others to find you by phone   |

```js
await client.account.updateSettings({
  language: "en",
  time_zone: "America/New_York",
  discoverable_by_email: false,
  discoverable_by_phone: false,
});
```

### Quiet Hours

Suppress notifications during specific hours:

```js
await client.account.updateSettings({
  sleep_time_enabled: true,
  start_sleep_time: 23,
  end_sleep_time: 7,
});
```

## `account.dataSaverMode()`

Get the current data saver mode setting. Uses the GraphQL `DataSaverMode` query.

```js
const mode = await client.account.dataSaverMode();
console.log(mode);
```

## `account.setDataSaver(dataSaverMode)`

Enable or disable data saver mode. When enabled, images load at lower quality and videos don't autoplay.

```js
// Enable data saver
await client.account.setDataSaver(true);

// Disable data saver
await client.account.setDataSaver(false);
```

## `account.helpSettings()`

Get help and support settings. Uses the v1.1 `help/settings` endpoint.

```js
const help = await client.account.helpSettings();
```

## `account.rateLimitStatus(params?)`

Check your current rate limit status across API endpoints. Uses the v1.1 `application/rate_limit_status` endpoint.

| Param              | Type     | Description                                |
| ------------------ | -------- | ------------------------------------------ |
| `params.resources` | `string` | Comma-separated resource families to check |

```js
// Check all rate limits
const limits = await client.account.rateLimitStatus();

// Check specific resource families
const specific = await client.account.rateLimitStatus({
  resources: "statuses,friends,followers",
});
```

## `account.emailNotificationSettings(params?)`

Update email notification settings. Uses the GraphQL `WriteEmailNotificationSettings` mutation.

```js
await client.account.emailNotificationSettings({
  setting: "email_new_follower",
  enabled: false,
});
```

## `account.viewerEmailSettings()`

Get the current email notification settings. Uses the GraphQL `ViewerEmailSettings` query.

```js
const emailSettings = await client.account.viewerEmailSettings();
```

## `account.multiList()`

List all accounts in your multi-account session. Uses the v1.1 `account/multi/list` endpoint.

```js
const accounts = await client.account.multiList();
```

## `account.logout()`

Log out the current session. Uses the v1.1 `account/logout` endpoint.

```js
await client.account.logout();
```

## `account.deactivate()`

Deactivate your account. Uses the v1.1 `account/deactivate` endpoint.

::: danger
This will deactivate your account. You have 30 days to reactivate before permanent deletion.
:::

```js
await client.account.deactivate();
```

## Full example

```js
// Check your current settings
const settings = await client.account.settings();
console.log(`Language: ${settings.language}`);
console.log(`Timezone: ${settings.time_zone}`);

// Update language and timezone
await client.account.updateSettings({
  language: "en",
  time_zone: "America/New_York",
});

// Disable discoverability
await client.account.updateSettings({
  discoverable_by_email: false,
  discoverable_by_phone: false,
});

// Enable quiet hours overnight
await client.account.updateSettings({
  sleep_time_enabled: true,
  start_sleep_time: 23,
  end_sleep_time: 7,
});

// Toggle data saver mode
const mode = await client.account.dataSaverMode();
await client.account.setDataSaver(true);

// Check rate limits before a batch operation
const limits = await client.account.rateLimitStatus({
  resources: "statuses,friends",
});

// Manage email notification preferences
const emailSettings = await client.account.viewerEmailSettings();
await client.account.emailNotificationSettings({
  setting: "email_new_follower",
  enabled: false,
});

// View all accounts in multi-account session
const accounts = await client.account.multiList();
```
