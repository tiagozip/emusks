export default (client) => ({
  async timeline(opts = {}) {
    return await client.graphql("NotificationsTimeline", {
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
  },

  async enableWebNotifications() {
    return await client.graphql("EnableLoggedOutWebNotifications", {
      body: { variables: {} },
    });
  },

  async saveSettings(params = {}) {
    const res = await client.v1_1("notifications/settings/save", {
      body: JSON.stringify(params),
    });
    return await res.json();
  },

  async loginSettings(params = {}) {
    const res = await client.v1_1("notifications/settings/login", {
      body: JSON.stringify(params),
    });
    return await res.json();
  },

  async checkin(params = {}) {
    const res = await client.v1_1("notifications/settings/checkin", {
      body: JSON.stringify(params),
    });
    return await res.json();
  },

  async badge(params = {}) {
    const res = await client.v2("badge_count/badge_count", { params });
    return await res.json();
  },
});
