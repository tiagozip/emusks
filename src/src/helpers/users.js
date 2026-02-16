import parseTimeline from "../parsers/timeline.js";
import parseUser from "../parsers/user.js";

export async function get(userId) {
  const res = await this.graphql("UserByRestId", {
    variables: { userId, withSafetyModeUserFields: true },
    fieldToggles: { withAuxiliaryUserLabels: false },
  });
  const user = res?.data?.user?.result;
  return user ? parseUser(user) : res;
}

export async function getByUsername(username) {
  const res = await this.graphql("UserByScreenName", {
    variables: { screen_name: username, withSafetyModeUserFields: true },
    fieldToggles: { withAuxiliaryUserLabels: false },
  });
  const user = res?.data?.user?.result;
  return user ? parseUser(user) : res;
}

export async function getMany(userIds) {
  const res = await this.graphql("UsersByRestIds", {
    variables: { userIds, withSafetyModeUserFields: true },
    fieldToggles: { withAuxiliaryUserLabels: false },
  });
  const users = res?.data?.users || [];
  return Array.isArray(users)
    ? users.map((u) => (u?.result ? parseUser(u.result) : u))
    : res;
}

export async function getManyByUsername(screenNames) {
  const res = await this.graphql("UsersByScreenNames", {
    variables: { screen_names: screenNames, withSafetyModeUserFields: true },
    fieldToggles: { withAuxiliaryUserLabels: false },
  });
  const users = res?.data?.users || [];
  return Array.isArray(users)
    ? users.map((u) => (u?.result ? parseUser(u.result) : u))
    : res;
}

export async function tweets(userId, opts = {}) {
  const raw = await this.graphql("UserTweets", {
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
}

export async function replies(userId, opts = {}) {
  const raw = await this.graphql("UserTweetsAndReplies", {
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
}

export async function userMedia(userId, opts = {}) {
  const raw = await this.graphql("UserMedia", {
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
}

export async function highlights(userId, opts = {}) {
  const raw = await this.graphql("UserHighlightsTweets", {
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
}

export async function followers(userId, opts = {}) {
  const raw = await this.graphql("Followers", {
    variables: {
      userId,
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: false,
    },
  });
  return parseTimeline(raw);
}

export async function following(userId, opts = {}) {
  const raw = await this.graphql("Following", {
    variables: {
      userId,
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: false,
    },
  });
  return parseTimeline(raw);
}

export async function verifiedFollowers(userId, opts = {}) {
  const raw = await this.graphql("BlueVerifiedFollowers", {
    variables: {
      userId,
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: false,
    },
  });
  return parseTimeline(raw);
}

export async function followersYouKnow(userId, opts = {}) {
  const raw = await this.graphql("FollowersYouKnow", {
    variables: {
      userId,
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: false,
    },
  });
  return parseTimeline(raw);
}

export async function follow(userId) {
  const res = await this.v1_1("friendships/create", {
    body: JSON.stringify({ user_id: userId }),
  });
  const json = await res.json();
  return json ? parseUser(json) : res;
}

export async function unfollow(userId) {
  const res = await this.v1_1("friendships/destroy", {
    body: JSON.stringify({ user_id: userId }),
  });
  const json = await res.json();
  return json ? parseUser(json) : res;
}

export async function block(userId) {
  const res = await this.v1_1("blocks/create", {
    body: JSON.stringify({ user_id: userId }),
  });
  const json = await res.json();
  return json ? parseUser(json) : res;
}

export async function unblock(userId) {
  const res = await this.v1_1("blocks/destroy", {
    body: JSON.stringify({ user_id: userId }),
  });
  const json = await res.json();
  return json ? parseUser(json) : res;
}

export async function mute(userId) {
  const res = await this.v1_1("mutes/users/create", {
    body: JSON.stringify({ user_id: userId }),
  });
  const json = await res.json();
  return json ? parseUser(json) : res;
}

export async function unmute(userId) {
  const res = await this.v1_1("mutes/users/destroy", {
    body: JSON.stringify({ user_id: userId }),
  });
  const json = await res.json();
  return json ? parseUser(json) : res;
}

export async function removeFollower(userId) {
  return await this.graphql("RemoveFollower", {
    body: { variables: { target_user_id: userId } },
  });
}

export async function blocked(opts = {}) {
  const raw = await this.graphql("BlockedAccountsAll", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: false,
    },
  });
  return parseTimeline(raw);
}

export async function muted(opts = {}) {
  const raw = await this.graphql("MutedAccounts", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: false,
    },
  });
  return parseTimeline(raw);
}

export async function lookup(params = {}) {
  const res = await this.v1_1("users/lookup", { params });
  return await res.json();
}

export async function updateProfile(params = {}) {
  const res = await this.v1_1("account/update_profile", {
    body: JSON.stringify(params),
  });
  const json = await res.json();
  return json ? parseUser(json) : res;
}

export async function updateProfileImage(imageData) {
  const res = await this.v1_1("account/update_profile_image", {
    body: JSON.stringify({ image: imageData }),
  });
  return await res.json();
}

export async function updateProfileBanner(bannerData) {
  const res = await this.v1_1("account/update_profile_banner", {
    body: JSON.stringify({ banner: bannerData }),
  });
  return await res.json();
}

export async function removeProfileBanner() {
  const res = await this.v1_1("account/remove_profile_banner", {});
  return await res.json();
}

export async function subscriptions(userId, opts = {}) {
  const raw = await this.graphql("UserCreatorSubscriptions", {
    variables: {
      userId,
      count: opts.count || 20,
      cursor: opts.cursor,
    },
  });
  return parseTimeline(raw);
}

export async function subscribers(userId, opts = {}) {
  const raw = await this.graphql("UserCreatorSubscribers", {
    variables: {
      userId,
      count: opts.count || 20,
      cursor: opts.cursor,
    },
  });
  return parseTimeline(raw);
}

export async function superFollowers(opts = {}) {
  const raw = await this.graphql("SuperFollowers", {
    variables: {
      count: opts.count || 20,
      cursor: opts.cursor,
      includePromotedContent: false,
    },
  });
  return parseTimeline(raw);
}

export async function recommendations(params = {}) {
  const res = await this.v1_1("users/recommendations", { params });
  return await res.json();
}
