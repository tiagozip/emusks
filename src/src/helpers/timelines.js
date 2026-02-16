import parseTimeline from "../parsers/timeline.js";

export default (client) => ({
  async home(opts = {}) {
    const raw = await client.graphql("HomeTimeline", {
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
  },

  async homeLatest(opts = {}) {
    const raw = await client.graphql("HomeLatestTimeline", {
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
  },

  async connect(opts = {}) {
    const raw = await client.graphql("ConnectTabTimeline", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        context: "{}",
        ...opts.variables,
      },
    });
    return parseTimeline(raw);
  },

  async moderated(opts = {}) {
    const raw = await client.graphql("ModeratedTimeline", {
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
  },

  async creatorSubscriptions(opts = {}) {
    const raw = await client.graphql("CreatorSubscriptionsTimeline", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: false,
        ...opts.variables,
      },
    });
    return parseTimeline(raw);
  },
});
