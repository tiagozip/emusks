import parseTimeline from "../parsers/timeline.js";
import parseUser from "../parsers/user.js";

export default (client) => ({
  async get(userId) {
    const res = await client.graphql("UserByRestId", {
      variables: { userId, withSafetyModeUserFields: true },
      fieldToggles: { withAuxiliaryUserLabels: false },
    });
    const user = res?.data?.user?.result;
    return user ? parseUser(user) : res;
  },

  async getByUsername(username) {
    const res = await client.graphql("UserByScreenName", {
      variables: { screen_name: username, withSafetyModeUserFields: true },
      fieldToggles: { withAuxiliaryUserLabels: false },
    });
    const user = res?.data?.user?.result;
    return user ? parseUser(user) : res;
  },

  async getMany(userIds) {
    const res = await client.graphql("UsersByRestIds", {
      variables: { userIds, withSafetyModeUserFields: true },
      fieldToggles: { withAuxiliaryUserLabels: false },
    });
    const users = res?.data?.users || [];
    return Array.isArray(users)
      ? users.map((u) => (u?.result ? parseUser(u.result) : u))
      : res;
  },

  async getManyByUsername(screenNames) {
    const res = await client.graphql("UsersByScreenNames", {
      variables: { screen_names: screenNames, withSafetyModeUserFields: true },
      fieldToggles: { withAuxiliaryUserLabels: false },
    });
    const users = res?.data?.users || [];
    return Array.isArray(users)
      ? users.map((u) => (u?.result ? parseUser(u.result) : u))
      : res;
  },

  async tweets(userId, opts = {}) {
    const raw = await client.graphql("UserTweets", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: true,
        withQuickPromoteEligibilityTweetFields: true,
        withVoice: true,
        withV2Timeline: true,
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

  async replies(userId, opts = {}) {
    const raw = await client.graphql("UserTweetsAndReplies", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: true,
        withCommunity: true,
        withVoice: true,
        withV2Timeline: true,
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

  async media(userId, opts = {}) {
    const raw = await client.graphql("UserMedia", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: false,
        withClientEventToken: false,
        withBirdwatchNotes: false,
        withVoice: true,
        withV2Timeline: true,
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

  async highlights(userId, opts = {}) {
    const raw = await client.graphql("UserHighlightsTweets", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: true,
        withVoice: true,
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

  async followers(userId, opts = {}) {
    const raw = await client.graphql("Followers", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: false,
      },
    });
    return parseTimeline(raw);
  },

  async following(userId, opts = {}) {
    const raw = await client.graphql("Following", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: false,
      },
    });
    return parseTimeline(raw);
  },

  async verifiedFollowers(userId, opts = {}) {
    const raw = await client.graphql("BlueVerifiedFollowers", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: false,
      },
    });
    return parseTimeline(raw);
  },

  async followersYouKnow(userId, opts = {}) {
    const raw = await client.graphql("FollowersYouKnow", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: false,
      },
    });
    return parseTimeline(raw);
  },

  async follow(userId) {
    const res = await client.v1_1("friendships/create", {
      body: JSON.stringify({ user_id: userId }),
    });
    const json = await res.json();
    return json ? parseUser(json) : res;
  },

  async unfollow(userId) {
    const res = await client.v1_1("friendships/destroy", {
      body: JSON.stringify({ user_id: userId }),
    });
    const json = await res.json();
    return json ? parseUser(json) : res;
  },

  async block(userId) {
    const res = await client.v1_1("blocks/create", {
      body: JSON.stringify({ user_id: userId }),
    });
    const json = await res.json();
    return json ? parseUser(json) : res;
  },

  async unblock(userId) {
    const res = await client.v1_1("blocks/destroy", {
      body: JSON.stringify({ user_id: userId }),
    });
    const json = await res.json();
    return json ? parseUser(json) : res;
  },

  async mute(userId) {
    const res = await client.v1_1("mutes/users/create", {
      body: JSON.stringify({ user_id: userId }),
    });
    const json = await res.json();
    return json ? parseUser(json) : res;
  },

  async unmute(userId) {
    const res = await client.v1_1("mutes/users/destroy", {
      body: JSON.stringify({ user_id: userId }),
    });
    const json = await res.json();
    return json ? parseUser(json) : res;
  },

  async removeFollower(userId) {
    return await client.graphql("RemoveFollower", {
      body: { variables: { target_user_id: userId } },
    });
  },

  async blocked(opts = {}) {
    const raw = await client.graphql("BlockedAccountsAll", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: false,
      },
    });
    return parseTimeline(raw);
  },

  async muted(opts = {}) {
    const raw = await client.graphql("MutedAccounts", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: false,
      },
    });
    return parseTimeline(raw);
  },

  async lookup(params = {}) {
    const res = await client.v1_1("users/lookup", { params });
    return await res.json();
  },

  async updateProfile(params = {}) {
    const res = await client.v1_1("account/update_profile", {
      body: JSON.stringify(params),
    });
    const json = await res.json();
    return json ? parseUser(json) : res;
  },

  async updateProfileImage(imageData) {
    const res = await client.v1_1("account/update_profile_image", {
      body: JSON.stringify({ image: imageData }),
    });
    return await res.json();
  },

  async updateProfileBanner(bannerData) {
    const res = await client.v1_1("account/update_profile_banner", {
      body: JSON.stringify({ banner: bannerData }),
    });
    return await res.json();
  },

  async removeProfileBanner() {
    const res = await client.v1_1("account/remove_profile_banner", {});
    return await res.json();
  },

  async subscriptions(userId, opts = {}) {
    const raw = await client.graphql("UserCreatorSubscriptions", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
      },
    });
    return parseTimeline(raw);
  },

  async subscribers(userId, opts = {}) {
    const raw = await client.graphql("UserCreatorSubscribers", {
      variables: {
        userId,
        count: opts.count || 20,
        cursor: opts.cursor,
      },
    });
    return parseTimeline(raw);
  },

  async superFollowers(opts = {}) {
    const raw = await client.graphql("SuperFollowers", {
      variables: {
        count: opts.count || 20,
        cursor: opts.cursor,
        includePromotedContent: false,
      },
    });
    return parseTimeline(raw);
  },

  async recommendations(params = {}) {
    const res = await client.v1_1("users/recommendations", { params });
    return await res.json();
  },
});
