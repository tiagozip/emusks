export default (client) => ({
  async get(spaceId) {
    return await client.graphql("AudioSpaceById", {
      variables: {
        id: spaceId,
        isMetatagsQuery: false,
        withReplays: true,
        withListeners: true,
      },
    });
  },

  async search(query, opts = {}) {
    return await client.graphql("AudioSpaceSearch", {
      variables: {
        query,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async browseTopics(opts = {}) {
    return await client.graphql("BrowseSpaceTopics", {
      variables: {
        ...opts.variables,
      },
    });
  },

  async subscribe(spaceId) {
    return await client.graphql("SubscribeToScheduledSpace", {
      body: { variables: { space_id: spaceId } },
    });
  },

  async unsubscribe(spaceId) {
    return await client.graphql("UnsubscribeFromScheduledSpace", {
      body: { variables: { space_id: spaceId } },
    });
  },

  async addSharing(spaceId) {
    return await client.graphql("AudioSpaceAddSharing", {
      body: { variables: { space_id: spaceId } },
    });
  },

  async deleteSharing(spaceId) {
    return await client.graphql("AudioSpaceDeleteSharing", {
      body: { variables: { space_id: spaceId } },
    });
  },
});
