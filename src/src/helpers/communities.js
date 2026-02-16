export default (client) => ({
  async create(name, opts = {}) {
    return await client.graphql("CreateCommunity", {
      body: {
        variables: {
          name,
          description: opts.description || "",
          ...(opts.rules ? { rules: opts.rules } : {}),
          ...opts.variables,
        },
      },
    });
  },

  async get(communityId) {
    return await client.graphql("CommunityByRestId", {
      variables: { communityId },
    });
  },

  async join(communityId) {
    return await client.graphql("JoinCommunity", {
      body: { variables: { communityId } },
    });
  },

  async leave(communityId) {
    return await client.graphql("LeaveCommunity", {
      body: { variables: { communityId } },
    });
  },

  async requestJoin(communityId, opts = {}) {
    return await client.graphql("RequestToJoinCommunity", {
      body: {
        variables: {
          communityId,
          ...(opts.answer ? { answer: opts.answer } : {}),
        },
      },
    });
  },

  async timeline(communityId, opts = {}) {
    return await client.graphql("CommunityTweetsTimeline", {
      variables: {
        communityId,
        count: opts.count || 20,
        cursor: opts.cursor,
        rankingMode: opts.rankingMode || "Recency",
        withCommunity: true,
        ...opts.variables,
      },
      fieldToggles: {
        withArticlePlainText: false,
        withArticleRichContentState: false,
        withAuxiliaryUserLabels: false,
      },
    });
  },

  async media(communityId, opts = {}) {
    return await client.graphql("CommunityMediaTimeline", {
      variables: {
        communityId,
        count: opts.count || 20,
        cursor: opts.cursor,
        withCommunity: true,
        ...opts.variables,
      },
      fieldToggles: {
        withArticlePlainText: false,
        withArticleRichContentState: false,
        withAuxiliaryUserLabels: false,
      },
    });
  },

  async about(communityId, opts = {}) {
    return await client.graphql("CommunityAboutTimeline", {
      variables: {
        communityId,
        count: opts.count || 20,
        cursor: opts.cursor,
        withCommunity: true,
        ...opts.variables,
      },
    });
  },

  async hashtags(communityId, opts = {}) {
    return await client.graphql("CommunityHashtagsTimeline", {
      variables: {
        communityId,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async editName(communityId, name) {
    return await client.graphql("CommunityEditName", {
      body: { variables: { communityId, name } },
    });
  },

  async editPurpose(communityId, purpose) {
    return await client.graphql("CommunityEditPurpose", {
      body: { variables: { communityId, purpose } },
    });
  },

  async editBanner(communityId, mediaId) {
    return await client.graphql("CommunityEditBannerMedia", {
      body: { variables: { communityId, mediaId } },
    });
  },

  async removeBanner(communityId) {
    return await client.graphql("CommunityRemoveBannerMedia", {
      body: { variables: { communityId } },
    });
  },

  async createRule(communityId, name, opts = {}) {
    return await client.graphql("CommunityCreateRule", {
      body: {
        variables: {
          communityId,
          name,
          description: opts.description || "",
        },
      },
    });
  },

  async editRule(communityId, ruleId, name, opts = {}) {
    return await client.graphql("CommunityEditRule", {
      body: {
        variables: {
          communityId,
          ruleId,
          name,
          ...(opts.description !== undefined ? { description: opts.description } : {}),
        },
      },
    });
  },

  async removeRule(communityId, ruleId) {
    return await client.graphql("CommunityRemoveRule", {
      body: { variables: { communityId, ruleId } },
    });
  },

  async reorderRules(communityId, ruleIds) {
    return await client.graphql("CommunityReorderRules", {
      body: { variables: { communityId, ruleIds } },
    });
  },

  async editQuestion(communityId, question) {
    return await client.graphql("CommunityEditQuestion", {
      body: { variables: { communityId, question } },
    });
  },

  async updateRole(communityId, userId, role) {
    return await client.graphql("CommunityUpdateRole", {
      body: { variables: { communityId, userId, role } },
    });
  },

  async invite(communityId, userId) {
    return await client.graphql("CommunityUserInvite", {
      body: { variables: { communityId, userId } },
    });
  },

  async keepTweet(communityId, tweetId) {
    return await client.graphql("CommunityModerationKeepTweet", {
      body: { variables: { communityId, tweetId } },
    });
  },

  async moderationCases(communityId, opts = {}) {
    return await client.graphql("CommunityModerationTweetCasesSlice", {
      variables: {
        communityId,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async moderationLog(communityId, opts = {}) {
    return await client.graphql("CommunityTweetModerationLogSlice", {
      variables: {
        communityId,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async explore(opts = {}) {
    return await client.graphql("CommunitiesExploreTimeline", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async discover(opts = {}) {
    return await client.graphql("CommunitiesMainDiscoveryModule", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async ranked(opts = {}) {
    return await client.graphql("CommunitiesRankedTimeline", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async memberships(userId, opts = {}) {
    return await client.graphql("CommunitiesMembershipsTimeline", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
        ...opts.variables,
      },
    });
  },

  async memberSearch(communityId, query, opts = {}) {
    return await client.graphql("CommunityMemberRelationshipTypeahead", {
      variables: {
        communityId,
        query,
        count: opts.count || 20,
        ...opts.variables,
      },
    });
  },

  async userSearch(communityId, query, opts = {}) {
    return await client.graphql("CommunityUserRelationshipTypeahead", {
      variables: {
        communityId,
        query,
        count: opts.count || 20,
        ...opts.variables,
      },
    });
  },
});
