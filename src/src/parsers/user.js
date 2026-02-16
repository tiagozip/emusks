export default function parseUser(user) {
  if (typeof user?.stats?.followers?.count === "number") {
    // we can safely assume this has already been parsed
    return user;
  }
  
  const get = (obj, path, fallback = undefined) =>
    path
      .split(".")
      .reduce((o, k) => (o && o[k] !== undefined ? o[k] : fallback), obj);
  const data = user.data?.user || user;

  const legacy = data.legacy || data;
  const core = data.core || {};
  const locationObj = data.location || {};
  const verification = data.verification || {};
  const parodyLabel =
    data.parody_commentary_fan_label || legacy.parody_commentary_fan_label;
  const highlightedLabel =
    get(data, "affiliates_highlighted_label.label") || data.highlightedLabel;

  return {
    id: data.rest_id || legacy.id_str || data.id || data.id_str,
    name: core.name || legacy.name || data.name,
    username:
      core.screen_name ||
      legacy.screen_name ||
      data.screen_name ||
      data.username,
    description: legacy.description || data.description,
    banner:
      legacy.profile_banner_url ||
      legacy.profile_background_image_url ||
      legacy.profile_background_image_url_https ||
      data.profile_banner_url ||
      data.profile_background_image_url ||
      data.profile_background_image_url_https,
    url: legacy.url || data.url,
    location: locationObj.location || legacy.location || data.location || null,
    protected: get(
      data,
      "privacy.protected",
      legacy.protected || data.protected
    ),
    created_at: get(core, "created_at", legacy.created_at || data.created_at),
    backgroundColor:
      legacy.profile_background_color || data.profile_background_color,

    profile_picture: {
      url:
        get(data, "avatar.image_url") ||
        legacy.profile_image_url_https ||
        data.profile_image_url_https ||
        "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
      shape:
        data.profile_image_shape ||
        data.ext_profile_image_shape ||
        legacy.profile_image_shape ||
        "Circle",
    },

    stats: {
      followers: {
        count: legacy.followers_count || data.followers_count,
        fast_followers:
          legacy.fast_followers_count || data.fast_followers_count || 0,
        normal_followers:
          legacy.normal_followers_count || data.normal_followers_count,
      },
      following: legacy.friends_count || data.friends_count,
      subscriptions_count:
        data.creator_subscriptions_count ||
        legacy.creator_subscriptions_count ||
        0,
      likes: legacy.favourites_count || data.favourites_count,
      listed: legacy.listed_count || data.listed_count,
      media: legacy.media_count || data.media_count,
      posts: legacy.statuses_count || data.statuses_count,
    },
    verification: {
      verified: get(verification, "verified", legacy.verified || data.verified),
      premium_verified:
        data.is_blue_verified ||
        data.ext_is_blue_verified ||
        data.premium_verified ||
        data.premium_verified_type ||
        false,
    },
    pinned_tweets:
      legacy.pinned_tweet_ids_str || data.pinned_tweet_ids_str || [],
    birthdate: data.birthdate || {},
    misc: {
      default_profile: legacy.default_profile || data.default_profile,
      default_profile_image:
        legacy.default_profile_image || data.default_profile_image || false,
      entities: legacy.entities || data.entities,
      has_custom_timelines:
        legacy.has_custom_timelines || data.has_custom_timelines,
      is_translator: legacy.is_translator || data.is_translator || false,
      translator_type: legacy.translator_type || data.translator_type,
      is_profile_translatable: data.is_profile_translatable,
      needs_phone_verification: data.needs_phone_verification,
      possibly_sensitive: legacy.possibly_sensitive || data.possibly_sensitive,
      profile_interstitial_type:
        legacy.profile_interstitial_type || data.profile_interstitial_type,
      want_retweets: legacy.want_retweets || data.want_retweets,
      withheld_in_countries:
        legacy.withheld_in_countries || data.withheld_in_countries || [],
      tipjar_settings: data.tipjar_settings || {},
      can_dm: get(data, "dm_permissions.can_dm", data.can_dm),
      can_media_tag: get(
        data,
        "media_permissions.can_media_tag",
        data.can_media_tag
      ),
      blocked_by: get(
        data,
        "relationship_perspectives.followed_by",
        data.blocked_by
      ),
      blocking: data.blocking,
      following: get(
        data,
        "relationship_perspectives.following",
        data.following
      ),
      muting: data.muting,
      has_graduated_access: data.has_graduated_access,
      geo_enabled: data.geo_enabled,

      advertising: {
        service_levels: data.advertiser_account_service_levels || [],
        account_type: data.advertiser_account_type || "none",
      },
    },

    labels: {
      parody_commentary_fan_label: parodyLabel || "None",
      highlightedLabel: highlightedLabel,
    },
  };
}
