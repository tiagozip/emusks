export default (client) => ({
  async follow(topicId) {
    return await client.graphql("TopicFollow", {
      body: { variables: { topic_id: topicId } },
    });
  },

  async unfollow(topicId) {
    return await client.graphql("TopicUnfollow", {
      body: { variables: { topic_id: topicId } },
    });
  },

  async notInterested(topicId) {
    return await client.graphql("TopicNotInterested", {
      body: { variables: { topic_id: topicId } },
    });
  },

  async undoNotInterested(topicId) {
    return await client.graphql("TopicUndoNotInterested", {
      body: { variables: { topic_id: topicId } },
    });
  },

  async get(topicId) {
    return await client.graphql("TopicByRestId", {
      variables: { topicId },
    });
  },

  async landingPage(topicId, opts = {}) {
    return await client.graphql("TopicLandingPage", {
      variables: {
        topicId,
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

  async toFollow(opts = {}) {
    return await client.graphql("TopicToFollowSidebar", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async manage(opts = {}) {
    return await client.graphql("TopicsManagementPage", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async picker(opts = {}) {
    return await client.graphql("TopicsPickerPage", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async pickerById(topicId, opts = {}) {
    return await client.graphql("TopicsPickerPageById", {
      variables: {
        topicId,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async viewing(userId, opts = {}) {
    return await client.graphql("ViewingOtherUsersTopicsPage", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },
});
