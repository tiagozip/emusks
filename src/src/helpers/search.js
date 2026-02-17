import parseTimeline from "../parsers/timeline.js";

export async function tweets(query, opts = {}) {
  const raw = await this.graphql("SearchTimeline", {
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
}

export async function users(query, opts = {}) {
  const raw = await this.graphql("SearchTimeline", {
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
}

export async function media(query, opts = {}) {
  const raw = await this.graphql("SearchTimeline", {
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
}

export async function latest(query, opts = {}) {
  const raw = await this.graphql("SearchTimeline", {
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
}

export async function lists(query, opts = {}) {
  const raw = await this.graphql("SearchTimeline", {
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
}

export async function typeahead(query, params = {}) {
  const res = await this.v1_1("search/typeahead", {
    params: {
      q: query,
      src: params.src || "search_box",
      result_type: params.result_type || "events,users,topics,lists",
      ...params,
    },
  });
  return await res.json();
}

export async function adaptive(query, params = {}) {
  const res = await this.v2("search/adaptive", {
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
}

export async function communities(query, opts = {}) {
  const raw = await this.graphql("GlobalCommunitiesPostSearchTimeline", {
    variables: {
      rawQuery: query,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
  return parseTimeline(raw);
}

export async function gifs(query, params = {}) {
  const res = await this.v1_1("foundmedia/search", {
    params: {
      q: query,
      ...(params.cursor ? { cursor: params.cursor } : {}),
      ...params,
    },
  });
  const json = await res.json();
  return {
    items: json.data?.items || [],
    cursor: json.cursor?.next || null,
  };
}

export async function communitiesLatest(query, opts = {}) {
  const raw = await this.graphql("GlobalCommunitiesLatestPostSearchTimeline", {
    variables: {
      rawQuery: query,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
  return parseTimeline(raw);
}
