export async function follow(topicId) {
  return await this.graphql("TopicFollow", {
    body: { variables: { topic_id: topicId } },
  });
}

export async function unfollow(topicId) {
  return await this.graphql("TopicUnfollow", {
    body: { variables: { topic_id: topicId } },
  });
}

export async function notInterested(topicId) {
  return await this.graphql("TopicNotInterested", {
    body: { variables: { topic_id: topicId } },
  });
}

export async function undoNotInterested(topicId) {
  return await this.graphql("TopicUndoNotInterested", {
    body: { variables: { topic_id: topicId } },
  });
}

export async function get(topicId) {
  return await this.graphql("TopicByRestId", {
    variables: { topicId },
  });
}

export async function landingPage(topicId, opts = {}) {
  return await this.graphql("TopicLandingPage", {
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
}

export async function toFollow(opts = {}) {
  return await this.graphql("TopicToFollowSidebar", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function manage(opts = {}) {
  return await this.graphql("TopicsManagementPage", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function picker(opts = {}) {
  return await this.graphql("TopicsPickerPage", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function pickerById(topicId, opts = {}) {
  return await this.graphql("TopicsPickerPageById", {
    variables: {
      topicId,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function viewing(userId, opts = {}) {
  return await this.graphql("ViewingOtherUsersTopicsPage", {
    variables: {
      userId,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}
