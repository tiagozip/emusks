export default (client) => ({
  async create(name, opts = {}) {
    return await client.graphql("CreateList", {
      body: {
        variables: {
          isPrivate: opts.private || false,
          name,
          description: opts.description || "",
        },
      },
    });
  },

  async delete(listId) {
    return await client.graphql("DeleteList", {
      body: { variables: { listId } },
    });
  },

  async update(listId, opts = {}) {
    return await client.graphql("UpdateList", {
      body: {
        variables: {
          listId,
          ...(opts.name !== undefined ? { name: opts.name } : {}),
          ...(opts.description !== undefined ? { description: opts.description } : {}),
          ...(opts.private !== undefined ? { isPrivate: opts.private } : {}),
        },
      },
    });
  },

  async get(listId) {
    return await client.graphql("ListByRestId", {
      variables: { listId },
    });
  },

  async getBySlug(slug, opts = {}) {
    return await client.graphql("ListBySlug", {
      variables: { slug, listOwnerScreenName: opts.ownerScreenName || "" },
    });
  },

  async addMember(listId, userId) {
    return await client.graphql("ListAddMember", {
      body: { variables: { listId, userId } },
    });
  },

  async removeMember(listId, userId) {
    return await client.graphql("ListRemoveMember", {
      body: { variables: { listId, userId } },
    });
  },

  async members(listId, opts = {}) {
    return await client.graphql("ListMembers", {
      variables: {
        listId,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async subscribers(listId, opts = {}) {
    return await client.graphql("ListSubscribers", {
      variables: {
        listId,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async subscribe(listId) {
    return await client.graphql("ListSubscribe", {
      body: { variables: { listId } },
    });
  },

  async unsubscribe(listId) {
    return await client.graphql("ListUnsubscribe", {
      body: { variables: { listId } },
    });
  },

  async mute(listId) {
    return await client.graphql("MuteList", {
      body: { variables: { listId } },
    });
  },

  async unmute(listId) {
    return await client.graphql("UnmuteList", {
      body: { variables: { listId } },
    });
  },

  async timeline(listId, opts = {}) {
    return await client.graphql("ListLatestTweetsTimeline", {
      variables: {
        listId,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
      fieldToggles: {
        withArticlePlainText: false,
        withArticleRichContentState: false,
        withAuxiliaryUserLabels: false,
      },
    });
  },

  async ranked(listId, opts = {}) {
    return await client.graphql("ListRankedTweetsTimeline", {
      variables: {
        listId,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
      fieldToggles: {
        withArticlePlainText: false,
        withArticleRichContentState: false,
        withAuxiliaryUserLabels: false,
      },
    });
  },

  async search(listId, query, opts = {}) {
    return await client.graphql("ListSearchTimeline", {
      variables: {
        listId,
        search_query: query,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async ownerships(userId, opts = {}) {
    return await client.graphql("ListOwnerships", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
        isCreator: true,
        ...opts.variables,
      },
    });
  },

  async memberships(userId, opts = {}) {
    return await client.graphql("ListMemberships", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async discover(opts = {}) {
    return await client.graphql("ListsDiscovery", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async combined(opts = {}) {
    return await client.graphql("CombinedLists", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async manage(opts = {}) {
    return await client.graphql("ListsManagementPageTimeline", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async editBanner(listId, mediaId) {
    return await client.graphql("EditListBanner", {
      body: { variables: { listId, mediaId } },
    });
  },

  async deleteBanner(listId) {
    return await client.graphql("DeleteListBanner", {
      body: { variables: { listId } },
    });
  },

  async pinTimeline(timelineId) {
    return await client.graphql("PinTimeline", {
      body: { variables: { timeline_id: timelineId } },
    });
  },

  async unpinTimeline(timelineId) {
    return await client.graphql("UnpinTimeline", {
      body: { variables: { timeline_id: timelineId } },
    });
  },

  async pinned() {
    return await client.graphql("PinnedTimelines", {
      variables: {},
    });
  },
});
