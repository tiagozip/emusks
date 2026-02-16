export default (client) => ({
  async available() {
    const res = await client.v1_1("trends/available", {});
    return await res.json();
  },

  async history(opts = {}) {
    return await client.graphql("TrendHistory", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async relevantUsers(trendName, opts = {}) {
    return await client.graphql("TrendRelevantUsers", {
      variables: {
        trend_name: trendName,
        ...opts.variables,
      },
    });
  },

  async explore(opts = {}) {
    return await client.graphql("ExplorePage", {
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
  },

  async exploreSidebar(opts = {}) {
    return await client.graphql("ExploreSidebar", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async report(trendId) {
    return await client.graphql("ReportTrend", {
      body: { variables: { trend_id: trendId } },
    });
  },

  async save(trendId) {
    return await client.graphql("SaveTrend", {
      body: { variables: { trend_id: trendId } },
    });
  },

  async action(trendId, action) {
    return await client.graphql("ActionTrend", {
      body: { variables: { trend_id: trendId, action } },
    });
  },

  async getById(trendId) {
    return await client.graphql("AiTrendByRestId", {
      variables: { trendId },
    });
  },

  async exploreSettings() {
    const res = await client.v2("guide/get_explore_settings", {});
    return await res.json();
  },

  async setExploreSettings(params = {}) {
    const res = await client.v2("guide/set_explore_settings", {
      body: JSON.stringify(params),
    });
    return await res.json();
  },
});
