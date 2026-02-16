export async function timeline(opts = {}) {
  return await this.graphql("NotificationsTimeline", {
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
}

export async function enableWebNotifications() {
  return await this.graphql("EnableLoggedOutWebNotifications", {
    body: { variables: {} },
  });
}

export async function saveSettings(params = {}) {
  const res = await this.v1_1("notifications/settings/save", {
    body: JSON.stringify(params),
  });
  return await res.json();
}

export async function loginSettings(params = {}) {
  const res = await this.v1_1("notifications/settings/login", {
    body: JSON.stringify(params),
  });
  return await res.json();
}

export async function checkin(params = {}) {
  const res = await this.v1_1("notifications/settings/checkin", {
    body: JSON.stringify(params),
  });
  return await res.json();
}

export async function badge(params = {}) {
  const res = await this.v2("badge_count/badge_count", { params });
  return await res.json();
}
