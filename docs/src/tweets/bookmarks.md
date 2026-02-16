# Bookmarks

Bookmark tweets, manage bookmark folders, and search your bookmarks.

## `bookmarks.create(tweetId)`

Bookmark a tweet. Uses the GraphQL `CreateBookmark` mutation.

```js
await client.bookmarks.create("1234567890");
```

## `bookmarks.delete(tweetId)`

Remove a tweet from your bookmarks. Uses the GraphQL `DeleteBookmark` mutation.

```js
await client.bookmarks.delete("1234567890");
```

## `bookmarks.deleteAll()`

Delete all your bookmarks. Uses the GraphQL `BookmarksAllDelete` mutation.

```js
await client.bookmarks.deleteAll();
```

::: warning
This action is irreversible. All bookmarks will be permanently removed.
:::

## `bookmarks.get(opts?)`

Fetch your bookmarked tweets. Uses the GraphQL `Bookmarks` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets, nextCursor } = await client.bookmarks.get();
console.log(tweets[0].text);

// Paginate
const page2 = await client.bookmarks.get({ cursor: nextCursor });

// Fetch more
const more = await client.bookmarks.get({ count: 50 });
```

## `bookmarks.search(query, opts?)`

Search within your bookmarks. Uses the GraphQL `BookmarkSearchTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `query`          | `string` | Search query                   |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets } = await client.bookmarks.search("javascript");
```

## `bookmarks.folders()`

Get all your bookmark folders. Uses the GraphQL `BookmarkFoldersSlice` query.

```js
const folders = await client.bookmarks.folders();
```

## `bookmarks.createFolder(name)`

Create a new bookmark folder. Uses the GraphQL `createBookmarkFolder` mutation.

```js
await client.bookmarks.createFolder("Read Later");
```

## `bookmarks.deleteFolder(folderId)`

Delete a bookmark folder. Uses the GraphQL `DeleteBookmarkFolder` mutation.

```js
await client.bookmarks.deleteFolder("1234567890");
```

## `bookmarks.editFolder(folderId, name)`

Rename a bookmark folder. Uses the GraphQL `EditBookmarkFolder` mutation.

```js
await client.bookmarks.editFolder("1234567890", "New Folder Name");
```

## `bookmarks.addToFolder(tweetId, folderId)`

Add a bookmarked tweet to a specific folder. Uses the GraphQL `bookmarkTweetToFolder` mutation.

```js
await client.bookmarks.addToFolder("9876543210", "1234567890");
```

## `bookmarks.removeFromFolder(tweetId, folderId)`

Remove a tweet from a bookmark folder. Uses the GraphQL `RemoveTweetFromBookmarkFolder` mutation.

```js
await client.bookmarks.removeFromFolder("9876543210", "1234567890");
```

## `bookmarks.folderTimeline(folderId, opts?)`

Get bookmarked tweets within a specific folder. Uses the GraphQL `BookmarkFolderTimeline` query.

| Option           | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `folderId`       | `string` | The bookmark folder ID         |
| `opts.count`     | `number` | Number of results (default 20) |
| `opts.cursor`    | `string` | Pagination cursor              |
| `opts.variables` | `object` | Additional GraphQL variables   |

```js
const { tweets, nextCursor } =
  await client.bookmarks.folderTimeline("1234567890");

// Paginate
const page2 = await client.bookmarks.folderTimeline("1234567890", {
  count: 40,
  cursor: nextCursor,
});
```

## Full example

```js
// Bookmark a tweet
await client.bookmarks.create("1234567890");

// Create a folder and organize
await client.bookmarks.createFolder("Tech");
const folders = await client.bookmarks.folders();
const techFolder = folders; // extract folder ID from response

// Add the tweet to the folder
await client.bookmarks.addToFolder("1234567890", techFolderId);

// Browse folder contents
const { tweets } = await client.bookmarks.folderTimeline(techFolderId);

// Search bookmarks
const { tweets: results } = await client.bookmarks.search("machine learning");

// Clean up
await client.bookmarks.removeFromFolder("1234567890", techFolderId);
await client.bookmarks.delete("1234567890");
await client.bookmarks.deleteFolder(techFolderId);
```
