export async function get(spaceId) {
  return await this.graphql("AudioSpaceById", {
    variables: {
      id: spaceId,
      isMetatagsQuery: false,
      withReplays: true,
      withListeners: true,
    },
  });
}

export async function search(query, opts = {}) {
  return await this.graphql("AudioSpaceSearch", {
    variables: {
      query,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function browseTopics(opts = {}) {
  return await this.graphql("BrowseSpaceTopics", {
    variables: {
      ...opts.variables,
    },
  });
}

export async function subscribe(spaceId) {
  return await this.graphql("SubscribeToScheduledSpace", {
    body: { variables: { space_id: spaceId } },
  });
}

export async function unsubscribe(spaceId) {
  return await this.graphql("UnsubscribeFromScheduledSpace", {
    body: { variables: { space_id: spaceId } },
  });
}

export async function addSharing(spaceId) {
  return await this.graphql("AudioSpaceAddSharing", {
    body: { variables: { space_id: spaceId } },
  });
}

export async function deleteSharing(spaceId) {
  return await this.graphql("AudioSpaceDeleteSharing", {
    body: { variables: { space_id: spaceId } },
  });
}
