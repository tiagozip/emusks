import parseTimeline from "../parsers/timeline.js";

export async function home(opts = {}) {
  const raw = await this.graphql("HomeTimeline", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: true,
      latestControlAvailable: true,
      requestContext: "launch",
      withCommunity: true,
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

export async function homeLatest(opts = {}) {
  const raw = await this.graphql("HomeLatestTimeline", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: true,
      latestControlAvailable: true,
      requestContext: "launch",
      withCommunity: true,
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

export async function connect(opts = {}) {
  const raw = await this.graphql("ConnectTabTimeline", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      context: "{}",
      ...opts.variables,
    },
  });
  return parseTimeline(raw);
}

export async function moderated(opts = {}) {
  const raw = await this.graphql("ModeratedTimeline", {
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
  return parseTimeline(raw);
}

export async function creatorSubscriptions(opts = {}) {
  const raw = await this.graphql("CreatorSubscriptionsTimeline", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: false,
      ...opts.variables,
    },
  });
  return parseTimeline(raw);
}
