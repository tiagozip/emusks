# Notifications

Access your notification timeline, manage notification settings, and check badge counts.

## `notifications.timeline(opts?)`

Get your notifications timeline. Uses the GraphQL `NotificationsTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const notifs = await client.notifications.timeline();

// Fetch more
const more = await client.notifications.timeline({ count: 50 });

// Paginate
const next = await client.notifications.timeline({ cursor: "DAABCgAB..." });
```

## `notifications.enableWebNotifications()`

Enable logged-out web push notifications. Uses the GraphQL `EnableLoggedOutWebNotifications` mutation.

```js
await client.notifications.enableWebNotifications();
```

## `notifications.saveSettings(params?)`

Save notification settings. Uses the v1.1 `notifications/settings/save` endpoint.

```js
await client.notifications.saveSettings({
  // notification setting parameters
});
```

## `notifications.loginSettings(params?)`

Update notification settings on login. Uses the v1.1 `notifications/settings/login` endpoint.

```js
await client.notifications.loginSettings({
  // login notification parameters
});
```

## `notifications.checkin(params?)`

Check in for notification settings. Uses the v1.1 `notifications/settings/checkin` endpoint.

```js
await client.notifications.checkin();
```

## `notifications.badge(params?)`

Get the notification badge count (unread count). Uses the v2 `badge_count/badge_count` endpoint.

```js
const badge = await client.notifications.badge();
console.log(badge);
```

## Full example

```js
// Check unread notification count
const badge = await client.notifications.badge();

// Fetch your notifications
const notifs = await client.notifications.timeline();

// Get more notifications with pagination
const page2 = await client.notifications.timeline({
  count: 40,
  cursor: "DAABCgAB...",
});

// Enable web push notifications
await client.notifications.enableWebNotifications();

// Save custom notification settings
await client.notifications.saveSettings({
  // your settings
});
```
