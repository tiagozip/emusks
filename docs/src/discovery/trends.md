# Trends

Explore trending topics, manage trend settings, and interact with trends.

## `trends.available()`

Get available trend locations. Uses the v1.1 `trends/available` endpoint.

```js
const locations = await client.trends.available();
```

## `trends.history(opts?)`

Get your trend history. Uses the GraphQL `TrendHistory` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const history = await client.trends.history();

// Paginate
const next = await client.trends.history({ cursor: "DAABCgAB..." });
```

## `trends.relevantUsers(trendName, opts?)`

Get users relevant to a trend. Uses the GraphQL `TrendRelevantUsers` query.

| Option           | Type     | Description                  |
| ---------------- | -------- | ---------------------------- |
| `trendName`      | `string` | The trend name or hashtag    |
| `opts.variables` | `object` | Additional GraphQL variables |

```js
const users = await client.trends.relevantUsers("JavaScript");
```

## `trends.explore(opts?)`

Get the Explore page content (trending topics, events, etc.). Uses the GraphQL `ExplorePage` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const explore = await client.trends.explore();

// Paginate
const next = await client.trends.explore({ count: 40, cursor: "DAABCgAB..." });
```

## `trends.exploreSidebar(opts?)`

Get the Explore sidebar content. Uses the GraphQL `ExploreSidebar` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const sidebar = await client.trends.exploreSidebar();
```

## `trends.report(trendId)`

Report a trend. Uses the GraphQL `ReportTrend` mutation.

```js
await client.trends.report("trend_id_123");
```

## `trends.save(trendId)`

Save a trend. Uses the GraphQL `SaveTrend` mutation.

```js
await client.trends.save("trend_id_123");
```

## `trends.action(trendId, action)`

Perform an action on a trend. Uses the GraphQL `ActionTrend` mutation.

| Param     | Type     | Description           |
| --------- | -------- | --------------------- |
| `trendId` | `string` | The trend ID          |
| `action`  | `string` | The action to perform |

```js
await client.trends.action("trend_id_123", "dismiss");
```

## `trends.getById(trendId)`

Get an AI-generated trend summary by its REST ID. Uses the GraphQL `AiTrendByRestId` query.

```js
const trend = await client.trends.getById("trend_id_123");
```

## `trends.exploreSettings()`

Get your Explore page settings (location, etc.). Uses the v2 `guide/get_explore_settings` endpoint.

```js
const settings = await client.trends.exploreSettings();
```

## `trends.setExploreSettings(params?)`

Update your Explore page settings. Uses the v2 `guide/set_explore_settings` endpoint.

```js
await client.trends.setExploreSettings({
  location: { woeid: 23424977 }, // United States
});
```

## Full example

```js
// See what's trending on the Explore page
const explore = await client.trends.explore();

// Check available trend locations
const locations = await client.trends.available();

// Get explore settings and update location
const settings = await client.trends.exploreSettings();
await client.trends.setExploreSettings({
  location: { woeid: 44418 }, // London
});

// See who's involved in a trend
const users = await client.trends.relevantUsers("#JavaScript");

// Get AI summary for a trend
const summary = await client.trends.getById("trend_id_123");

// View sidebar content
const sidebar = await client.trends.exploreSidebar();

// Browse your trend history
const history = await client.trends.history();

// Save an interesting trend
await client.trends.save("trend_id_456");

// Report a problematic trend
await client.trends.report("trend_id_789");
```
