import parseTimeline from "../parsers/timeline.js";

export default (client) => ({
  async tweets(query, opts = {}) {
    const raw = await client.graphql("SearchTimeline", {
      variables: {
        rawQuery: query,
        count: opts.count || 20,
        cursor: opts.cursor,
        querySource: opts.querySource || "typed_query",
        product: opts.product || "Top",
        ...opts.variables,
      },
      fieldToggles: {
        withArticlePlainText: false,
        withArticleRichContentState: false,
        withAuxiliaryUserLabels: false,
      },
    });
    return parseTimeline(raw);
  },

  async users(query, opts = {}) {
    const raw = await client.graphql("SearchTimeline", {
      variables: {
        rawQuery: query,
        count: opts.count || 20,
        cursor: opts.cursor,
        querySource: opts.querySource || "typed_query",
        product: "People",
        ...opts.variables,
      },
    });
    return parseTimeline(raw);
  },

  async media(query, opts = {}) {
    const raw = await client.graphql("SearchTimeline", {
      variables: {
        rawQuery: query,
        count: opts.count || 20,
        cursor: opts.cursor,
        querySource: opts.querySource || "typed_query",
        product: "Media",
        ...opts.variables,
      },
    });
    return parseTimeline(raw);
  },

  async latest(query, opts = {}) {
    const raw = await client.graphql("SearchTimeline", {
      variables: {
        rawQuery: query,
        count: opts.count || 20,
        cursor: opts.cursor,
        querySource: opts.querySource || "typed_query",
        product: "Latest",
        ...opts.variables,
      },
    });
    return parseTimeline(raw);
  },

  async lists(query, opts = {}) {
    const raw = await client.graphql("SearchTimeline", {
      variables: {
        rawQuery: query,
        count: opts.count || 20,
        cursor: opts.cursor,
        querySource: opts.querySource || "typed_query",
        product: "Lists",
        ...opts.variables,
      },
    });
    return parseTimeline(raw);
  },

  async typeahead(query, params = {}) {
    const res = await client.v1_1("search/typeahead", {
      params: {
        q: query,
        src: params.src || "search_box",
        result_type: params.result_type || "events,users,topics,lists",
        ...params,
      },
    });
    return await res.json();
  },

  async adaptive(query, params = {}) {
    const res = await client.v2("search/adaptive", {
      params: {
        q: query,
        count: params.count || 20,
        query_source: params.query_source || "typed_query",
        pc: params.pc || 1,
        spelling_corrections: params.spelling_corrections || 1,
        include_ext_edit_control: true,
        ...params,
      },
    });
    return await res.json();
  },

  async communities(query, opts = {}) {
    const raw = await client.graphql("GlobalCommunitiesPostSearchTimeline", {
      variables: {
        rawQuery: query,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
    return parseTimeline(raw);
  },

  async communitiesLatest(query, opts = {}) {
    const raw = await client.graphql("GlobalCommunitiesLatestPostSearchTimeline", {
      variables: {
        rawQuery: query,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
    return parseTimeline(raw);
  },
});
