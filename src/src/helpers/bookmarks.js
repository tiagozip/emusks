import parseTimeline from "../parsers/timeline.js";

export default (client) => ({
  async create(tweetId) {
    return await client.graphql("CreateBookmark", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async delete(tweetId) {
    return await client.graphql("DeleteBookmark", {
      body: { variables: { tweet_id: tweetId } },
    });
  },

  async deleteAll() {
    return await client.graphql("BookmarksAllDelete", {
      body: { variables: {} },
    });
  },

  async get(opts = {}) {
    const raw = await client.graphql("Bookmarks", {
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
  },

  async search(query, opts = {}) {
    const raw = await client.graphql("BookmarkSearchTimeline", {
      variables: {
        search_query: query,
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: false,
        ...opts.variables,
      },
    });
    return parseTimeline(raw);
  },

  async folders() {
    return await client.graphql("BookmarkFoldersSlice", {
      variables: {},
    });
  },

  async createFolder(name) {
    return await client.graphql("createBookmarkFolder", {
      body: { variables: { bookmark_collection_name: name } },
    });
  },

  async deleteFolder(folderId) {
    return await client.graphql("DeleteBookmarkFolder", {
      body: { variables: { bookmark_collection_id: folderId } },
    });
  },

  async editFolder(folderId, name) {
    return await client.graphql("EditBookmarkFolder", {
      body: {
        variables: {
          bookmark_collection_id: folderId,
          bookmark_collection_name: name,
        },
      },
    });
  },

  async addToFolder(tweetId, folderId) {
    return await client.graphql("bookmarkTweetToFolder", {
      body: {
        variables: {
          tweet_id: tweetId,
          bookmark_collection_id: folderId,
        },
      },
    });
  },

  async removeFromFolder(tweetId, folderId) {
    return await client.graphql("RemoveTweetFromBookmarkFolder", {
      body: {
        variables: {
          tweet_id: tweetId,
          bookmark_collection_id: folderId,
        },
      },
    });
  },

  async folderTimeline(folderId, opts = {}) {
    const raw = await client.graphql("BookmarkFolderTimeline", {
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
  },
});
