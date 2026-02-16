export async function create(name, opts = {}) {
  return await this.graphql("CreateCommunity", {
    body: {
      variables: {
        name,
        description: opts.description || "",
        ...(opts.rules ? { rules: opts.rules } : {}),
        ...opts.variables,
      },
    },
  });
}

export async function get(communityId) {
  return await this.graphql("CommunityByRestId", {
    variables: { communityId },
  });
}

export async function join(communityId) {
  return await this.graphql("JoinCommunity", {
    body: { variables: { communityId } },
  });
}

export async function leave(communityId) {
  return await this.graphql("LeaveCommunity", {
    body: { variables: { communityId } },
  });
}

export async function requestJoin(communityId, opts = {}) {
  return await this.graphql("RequestToJoinCommunity", {
    body: {
      variables: {
        communityId,
        ...(opts.answer ? { answer: opts.answer } : {}),
      },
    },
  });
}

export async function timeline(communityId, opts = {}) {
  return await this.graphql("CommunityTweetsTimeline", {
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
}

export async function media(communityId, opts = {}) {
  return await this.graphql("CommunityMediaTimeline", {
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
}

export async function about(communityId, opts = {}) {
  return await this.graphql("CommunityAboutTimeline", {
    variables: {
      communityId,
      count: opts.count || 20,
      cursor: opts.cursor,
      withCommunity: true,
      ...opts.variables,
    },
  });
}

export async function hashtags(communityId, opts = {}) {
  return await this.graphql("CommunityHashtagsTimeline", {
    variables: {
      communityId,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function editName(communityId, name) {
  return await this.graphql("CommunityEditName", {
    body: { variables: { communityId, name } },
  });
}

export async function editPurpose(communityId, purpose) {
  return await this.graphql("CommunityEditPurpose", {
    body: { variables: { communityId, purpose } },
  });
}

export async function editBanner(communityId, mediaId) {
  return await this.graphql("CommunityEditBannerMedia", {
    body: { variables: { communityId, mediaId } },
  });
}

export async function removeBanner(communityId) {
  return await this.graphql("CommunityRemoveBannerMedia", {
    body: { variables: { communityId } },
  });
}

export async function createRule(communityId, name, opts = {}) {
  return await this.graphql("CommunityCreateRule", {
    body: {
      variables: {
        communityId,
        name,
        description: opts.description || "",
      },
    },
  });
}

export async function editRule(communityId, ruleId, name, opts = {}) {
  return await this.graphql("CommunityEditRule", {
    body: {
      variables: {
        communityId,
        ruleId,
        name,
        ...(opts.description !== undefined ? { description: opts.description } : {}),
      },
    },
  });
}

export async function removeRule(communityId, ruleId) {
  return await this.graphql("CommunityRemoveRule", {
    body: { variables: { communityId, ruleId } },
  });
}

export async function reorderRules(communityId, ruleIds) {
  return await this.graphql("CommunityReorderRules", {
    body: { variables: { communityId, ruleIds } },
  });
}

export async function editQuestion(communityId, question) {
  return await this.graphql("CommunityEditQuestion", {
    body: { variables: { communityId, question } },
  });
}

export async function updateRole(communityId, userId, role) {
  return await this.graphql("CommunityUpdateRole", {
    body: { variables: { communityId, userId, role } },
  });
}

export async function invite(communityId, userId) {
  return await this.graphql("CommunityUserInvite", {
    body: { variables: { communityId, userId } },
  });
}

export async function keepTweet(communityId, tweetId) {
  return await this.graphql("CommunityModerationKeepTweet", {
    body: { variables: { communityId, tweetId } },
  });
}

export async function moderationCases(communityId, opts = {}) {
  return await this.graphql("CommunityModerationTweetCasesSlice", {
    variables: {
      communityId,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function moderationLog(communityId, opts = {}) {
  return await this.graphql("CommunityTweetModerationLogSlice", {
    variables: {
      communityId,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function explore(opts = {}) {
  return await this.graphql("CommunitiesExploreTimeline", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function discover(opts = {}) {
  return await this.graphql("CommunitiesMainDiscoveryModule", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function ranked(opts = {}) {
  return await this.graphql("CommunitiesRankedTimeline", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function memberships(userId, opts = {}) {
  return await this.graphql("CommunitiesMembershipsTimeline", {
    variables: {
      userId,
      count: opts.count || 20,
      cursor: opts.cursor,
      ...opts.variables,
    },
  });
}

export async function memberSearch(communityId, query, opts = {}) {
  return await this.graphql("CommunityMemberRelationshipTypeahead", {
    variables: {
      communityId,
      query,
      count: opts.count || 20,
      ...opts.variables,
    },
  });
}

export async function userSearch(communityId, query, opts = {}) {
  return await this.graphql("CommunityUserRelationshipTypeahead", {
    variables: {
      communityId,
      query,
      count: opts.count || 20,
      ...opts.variables,
    },
  });
}
