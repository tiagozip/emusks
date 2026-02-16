export default (client) => ({
  async inbox(params = {}) {
    const res = await client.v1_1("dm/inbox_initial_state", { params });
    return await res.json();
  },

  async conversation(conversationId, params = {}) {
    const res = await client.v1_1("dm/conversation", {
      params: { id: conversationId, ...params },
    });
    return await res.json();
  },

  async search(query, opts = {}) {
    return await client.graphql("DmAllSearchSlice", {
      variables: {
        query,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async searchGroups(query, opts = {}) {
    return await client.graphql("DmGroupSearchSlice", {
      variables: {
        query,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async searchPeople(query, opts = {}) {
    return await client.graphql("DmPeopleSearchSlice", {
      variables: {
        query,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async block(userId) {
    return await client.graphql("dmBlockUser", {
      body: { variables: { user_id: userId } },
    });
  },

  async unblock(userId) {
    return await client.graphql("dmUnblockUser", {
      body: { variables: { user_id: userId } },
    });
  },

  async deleteConversations(conversationIds) {
    const ids = Array.isArray(conversationIds) ? conversationIds : [conversationIds];
    const res = await client.v1_1("dm/conversation/bulk_delete", {
      body: JSON.stringify({ conversation_ids: ids }),
    });
    return await res.json();
  },

  async updateLastSeen(eventId) {
    const res = await client.v1_1("dm/update_last_seen_event_id", {
      body: JSON.stringify({ last_seen_event_id: eventId, trusted_last_seen_event_id: eventId }),
    });
    return await res.json();
  },

  async muted(opts = {}) {
    return await client.graphql("DmMutedTimeline", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async edit(messageId, conversationId, text) {
    const res = await client.v1_1("dm/edit", {
      body: JSON.stringify({
        message_id: messageId,
        conversation_id: conversationId,
        text,
      }),
    });
    return await res.json();
  },

  async permissions(params = {}) {
    const res = await client.v1_1("dm/permissions", { params });
    return await res.json();
  },

  async nsfwFilter(enabled) {
    return await client.graphql("DmNsfwMediaFilterUpdate", {
      body: { variables: { enabled } },
    });
  },

  async updateRelationship(userId, action) {
    const res = await client.v1_1("dm/user/update_relationship_state", {
      body: JSON.stringify({ user_id: userId, action }),
    });
    return await res.json();
  },

  async reportSpam(conversationId, messageId) {
    const res = await client.v1_1("direct_messages/report_spam", {
      body: JSON.stringify({ conversation_id: conversationId, message_id: messageId }),
    });
    return await res.json();
  },

  async report(conversationId, messageId) {
    const res = await client.v1_1("dm/report", {
      body: JSON.stringify({ conversation_id: conversationId, message_id: messageId }),
    });
    return await res.json();
  },

  async userUpdates(params = {}) {
    const res = await client.v1_1("dm/user_updates", { params });
    return await res.json();
  },
});
