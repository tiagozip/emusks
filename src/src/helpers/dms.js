export async function inbox(params = {}) {
  const res = await this.v1_1("dm/inbox_initial_state", { params });
  return await res.json();
}

export async function conversation(conversationId, params = {}) {
  const res = await this.v1_1("dm/conversation", {
    params: { id: conversationId, ...params },
  });
  return await res.json();
}

export async function search(query, opts = {}) {
  return await this.graphql("DmAllSearchSlice", {
    variables: {
      query,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function searchGroups(query, opts = {}) {
  return await this.graphql("DmGroupSearchSlice", {
    variables: {
      query,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function searchPeople(query, opts = {}) {
  return await this.graphql("DmPeopleSearchSlice", {
    variables: {
      query,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function block(userId) {
  return await this.graphql("dmBlockUser", {
    body: { variables: { user_id: userId } },
  });
}

export async function unblock(userId) {
  return await this.graphql("dmUnblockUser", {
    body: { variables: { user_id: userId } },
  });
}

export async function deleteConversations(conversationIds) {
  const ids = Array.isArray(conversationIds) ? conversationIds : [conversationIds];
  const res = await this.v1_1("dm/conversation/bulk_delete", {
    body: JSON.stringify({ conversation_ids: ids }),
  });
  return await res.json();
}

export async function updateLastSeen(eventId) {
  const res = await this.v1_1("dm/update_last_seen_event_id", {
    body: JSON.stringify({ last_seen_event_id: eventId, trusted_last_seen_event_id: eventId }),
  });
  return await res.json();
}

export async function muted(opts = {}) {
  return await this.graphql("DmMutedTimeline", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function edit(messageId, conversationId, text) {
  const res = await this.v1_1("dm/edit", {
    body: JSON.stringify({
      message_id: messageId,
      conversation_id: conversationId,
      text,
    }),
  });
  return await res.json();
}

export async function permissions(params = {}) {
  const res = await this.v1_1("dm/permissions", { params });
  return await res.json();
}

export async function nsfwFilter(enabled) {
  return await this.graphql("DmNsfwMediaFilterUpdate", {
    body: { variables: { enabled } },
  });
}

export async function updateRelationship(userId, action) {
  const res = await this.v1_1("dm/user/update_relationship_state", {
    body: JSON.stringify({ user_id: userId, action }),
  });
  return await res.json();
}

export async function reportSpam(conversationId, messageId) {
  const res = await this.v1_1("direct_messages/report_spam", {
    body: JSON.stringify({ conversation_id: conversationId, message_id: messageId }),
  });
  return await res.json();
}

export async function report(conversationId, messageId) {
  const res = await this.v1_1("dm/report", {
    body: JSON.stringify({ conversation_id: conversationId, message_id: messageId }),
  });
  return await res.json();
}

export async function userUpdates(params = {}) {
  const res = await this.v1_1("dm/user_updates", { params });
  return await res.json();
}
