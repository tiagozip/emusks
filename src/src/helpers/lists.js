export async function create(name, opts = {}) {
  return await this.graphql("CreateList", {
    body: {
      variables: {
        isPrivate: opts.private || false,
        name,
        description: opts.description || "",
      },
    },
  });
}

export async function remove(listId) {
  return await this.graphql("DeleteList", {
    body: { variables: { listId } },
  });
}

export async function update(listId, opts = {}) {
  return await this.graphql("UpdateList", {
    body: {
      variables: {
        listId,
        ...(opts.name !== undefined ? { name: opts.name } : {}),
        ...(opts.description !== undefined ? { description: opts.description } : {}),
        ...(opts.private !== undefined ? { isPrivate: opts.private } : {}),
      },
    },
  });
}

export async function get(listId) {
  return await this.graphql("ListByRestId", {
    variables: { listId },
  });
}

export async function getBySlug(slug, opts = {}) {
  return await this.graphql("ListBySlug", {
    variables: { slug, listOwnerScreenName: opts.ownerScreenName || "" },
  });
}

export async function addMember(listId, userId) {
  return await this.graphql("ListAddMember", {
    body: { variables: { listId, userId } },
  });
}

export async function removeMember(listId, userId) {
  return await this.graphql("ListRemoveMember", {
    body: { variables: { listId, userId } },
  });
}

export async function members(listId, opts = {}) {
  return await this.graphql("ListMembers", {
    variables: {
      listId,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function subscribers(listId, opts = {}) {
  return await this.graphql("ListSubscribers", {
    variables: {
      listId,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function subscribe(listId) {
  return await this.graphql("ListSubscribe", {
    body: { variables: { listId } },
  });
}

export async function unsubscribe(listId) {
  return await this.graphql("ListUnsubscribe", {
    body: { variables: { listId } },
  });
}

export async function mute(listId) {
  return await this.graphql("MuteList", {
    body: { variables: { listId } },
  });
}

export async function unmute(listId) {
  return await this.graphql("UnmuteList", {
    body: { variables: { listId } },
  });
}

export async function timeline(listId, opts = {}) {
  return await this.graphql("ListLatestTweetsTimeline", {
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
}

export async function ranked(listId, opts = {}) {
  return await this.graphql("ListRankedTweetsTimeline", {
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
}

export async function search(listId, query, opts = {}) {
  return await this.graphql("ListSearchTimeline", {
    variables: {
      listId,
      search_query: query,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function ownerships(userId, opts = {}) {
  return await this.graphql("ListOwnerships", {
    variables: {
      userId,
      count: opts.count || 20,
      cursor: opts.cursor,
      isCreator: true,
      ...opts.variables,
    },
  });
}

export async function listMemberships(userId, opts = {}) {
  return await this.graphql("ListMemberships", {
    variables: {
      userId,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function discover(opts = {}) {
  return await this.graphql("ListsDiscovery", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function combined(opts = {}) {
  return await this.graphql("CombinedLists", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function manage(opts = {}) {
  return await this.graphql("ListsManagementPageTimeline", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function editBanner(listId, mediaId) {
  return await this.graphql("EditListBanner", {
    body: { variables: { listId, mediaId } },
  });
}

export async function deleteBanner(listId) {
  return await this.graphql("DeleteListBanner", {
    body: { variables: { listId } },
  });
}

export async function pinTimeline(timelineId) {
  return await this.graphql("PinTimeline", {
    body: { variables: { timeline_id: timelineId } },
  });
}

export async function unpinTimeline(timelineId) {
  return await this.graphql("UnpinTimeline", {
    body: { variables: { timeline_id: timelineId } },
  });
}

export async function pinned() {
  return await this.graphql("PinnedTimelines", {
    variables: {},
  });
}
