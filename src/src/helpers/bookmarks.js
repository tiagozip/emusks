import parseTimeline from "../parsers/timeline.js";

export async function create(tweetId) {
  return await this.graphql("CreateBookmark", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function remove(tweetId) {
  return await this.graphql("DeleteBookmark", {
    body: { variables: { tweet_id: tweetId } },
  });
}

export async function deleteAll() {
  return await this.graphql("BookmarksAllDelete", {
    body: { variables: {} },
  });
}

export async function get(opts = {}) {
  const raw = await this.graphql("Bookmarks", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: false,
      ...opts.variables,
    },
    fieldToggles: {
      withArticlePlainText: false,
      withArticleRichContentState: false,
      withAuxiliaryUserLabels: false,
    },
  });
  return parseTimeline(raw);
}

export async function search(query, opts = {}) {
  const raw = await this.graphql("BookmarkSearchTimeline", {
    variables: {
      search_query: query,
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: false,
      ...opts.variables,
    },
  });
  return parseTimeline(raw);
}

export async function folders() {
  return await this.graphql("BookmarkFoldersSlice", {
    variables: {},
  });
}

export async function createFolder(name) {
  return await this.graphql("createBookmarkFolder", {
    body: { variables: { bookmark_collection_name: name } },
  });
}

export async function deleteFolder(folderId) {
  return await this.graphql("DeleteBookmarkFolder", {
    body: { variables: { bookmark_collection_id: folderId } },
  });
}

export async function editFolder(folderId, name) {
  return await this.graphql("EditBookmarkFolder", {
    body: {
      variables: {
        bookmark_collection_id: folderId,
        bookmark_collection_name: name,
      },
    },
  });
}

export async function addToFolder(tweetId, folderId) {
  return await this.graphql("bookmarkTweetToFolder", {
    body: {
      variables: {
        tweet_id: tweetId,
        bookmark_collection_id: folderId,
      },
    },
  });
}

export async function removeFromFolder(tweetId, folderId) {
  return await this.graphql("RemoveTweetFromBookmarkFolder", {
    body: {
      variables: {
        tweet_id: tweetId,
        bookmark_collection_id: folderId,
      },
    },
  });
}

export async function folderTimeline(folderId, opts = {}) {
  const raw = await this.graphql("BookmarkFolderTimeline", {
    variables: {
      bookmark_collection_id: folderId,
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: false,
      ...opts.variables,
    },
    fieldToggles: {
      withArticlePlainText: false,
      withArticleRichContentState: false,
      withAuxiliaryUserLabels: false,
    },
  });
  return parseTimeline(raw);
}
