export async function available() {
  const res = await this.v1_1("trends/available", {});
  return await res.json();
}

export async function history(opts = {}) {
  return await this.graphql("TrendHistory", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function relevantUsers(trendName, opts = {}) {
  return await this.graphql("TrendRelevantUsers", {
    variables: {
      trend_name: trendName,
      ...opts.variables,
    },
  });
}

export async function explore(opts = {}) {
  return await this.graphql("ExplorePage", {
    variables: {
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

export async function exploreSidebar(opts = {}) {
  return await this.graphql("ExploreSidebar", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function report(trendId) {
  return await this.graphql("ReportTrend", {
    body: { variables: { trend_id: trendId } },
  });
}

export async function save(trendId) {
  return await this.graphql("SaveTrend", {
    body: { variables: { trend_id: trendId } },
  });
}

export async function action(trendId, action) {
  return await this.graphql("ActionTrend", {
    body: { variables: { trend_id: trendId, action } },
  });
}

export async function getById(trendId) {
  return await this.graphql("AiTrendByRestId", {
    variables: { trendId },
  });
}

export async function exploreSettings() {
  const res = await this.v2("guide/get_explore_settings", {});
  return await res.json();
}

export async function setExploreSettings(params = {}) {
  const res = await this.v2("guide/set_explore_settings", {
    body: JSON.stringify(params),
  });
  return await res.json();
}
