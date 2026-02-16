import getCycleTLS from "../cycletls.js";

export default (client) => ({
  async getTweet(tweetId) {
    const token = ((Number(tweetId) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");

    const features = `tfw_timeline_list:;tfw_tweet_edit_backend:on;tfw_refsrc_session:on;tfw_fosnr_soft_interventions_enabled:on;tfw_mixed_media_15897:treatment;tfw_experiments_cookie_expiration:1209600;tfw_show_birdwatch_pivots_enabled:on;tfw_duplicate_scribes_to_settings:on;tfw_use_profile_image_shape_enabled:on;tfw_video_hls_dynamic_manifests_15082:true_bitrate;tfw_tweet_edit_frontend:on`;

    const url = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en&token=${token}&features=${encodeURIComponent(features)}`;

    try {
      const cycleTLS = await getCycleTLS();

      const res = await cycleTLS(url, {
        headers: {
          accept: "application/json, text/plain, */*",
        },
        userAgent: client.fingerprints?.userAgent,
        ja3: client.fingerprints?.ja3,
        ja4r: client.fingerprints?.ja4r,
        proxy: client.proxy || undefined,
        timeout: 3000,
      }, "GET");

      if (!res || res.status !== 200) return null;

      return await res.json();
    } catch (e) {
      console.warn(e);
      return null;
    }
  },
});