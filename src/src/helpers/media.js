import { readFile } from "fs/promises";
import { extname } from "path";
import getCycleTLS from "../cycletls.js";

const UPLOAD_URL = "https://upload.twitter.com/i/media/upload.json";
const CHUNK_SIZE = 4 * 1024 * 1024; // 4 MB

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_GIF_SIZE = 15 * 1024 * 1024; // 15 MB
const MAX_VIDEO_SIZE = 512 * 1024 * 1024; // 512 MB

const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".avi": "video/x-msvideo",
};

function detectMediaType(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47)
    return "image/png";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "image/gif";
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  )
    return "image/webp";
  if (
    buf.length > 7 &&
    buf[4] === 0x66 &&
    buf[5] === 0x74 &&
    buf[6] === 0x79 &&
    buf[7] === 0x70
  )
    return "video/mp4";
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3)
    return "video/webm";
  return null;
}

function getMediaCategory(mediaType, uploadType) {
  if (mediaType === "image/gif") return `${uploadType}_gif`;
  if (mediaType.startsWith("video/")) return `${uploadType}_video`;
  if (mediaType.startsWith("image/")) return `${uploadType}_image`;
  throw new Error(`unsupported media type: ${mediaType}`);
}

function checkMediaSize(category, size) {
  const fmt = (x) => `${(x / 1e6).toFixed(2)} MB`;
  if (
    category.includes("image") &&
    !category.includes("gif") &&
    size > MAX_IMAGE_SIZE
  )
    throw new Error(
      `cannot upload ${fmt(size)} image — max is ${fmt(MAX_IMAGE_SIZE)}`,
    );
  if (category.includes("gif") && size > MAX_GIF_SIZE)
    throw new Error(
      `cannot upload ${fmt(size)} gif — max is ${fmt(MAX_GIF_SIZE)}`,
    );
  if (category.includes("video") && size > MAX_VIDEO_SIZE)
    throw new Error(
      `cannot upload ${fmt(size)} video — max is ${fmt(MAX_VIDEO_SIZE)}`,
    );
}

async function makeUploadRequest(
  client,
  method,
  params,
  body,
  extraHeaders = {},
) {
  const cycleTLS = await getCycleTLS();
  const url = `${UPLOAD_URL}?${new URLSearchParams(params).toString()}`;

  const headers = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    authorization: `Bearer ${client.auth.client.bearer}`,
    "x-csrf-token": client.auth.csrfToken,
    "x-twitter-active-user": "yes",
    "x-twitter-auth-type": "OAuth2Session",
    "x-twitter-client-language": "en",
    priority: "u=1, i",
    "sec-ch-ua": '"Not(A:Brand";v="8", "Chromium";v="144"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "sec-gpc": "1",
    cookie:
      client.auth.client.headers.cookie +
      (client.elevatedCookies ? `; ${client.elevatedCookies}` : ""),
    ...extraHeaders,
  };

  return await cycleTLS(
    url,
    {
      headers,
      userAgent:
        client.auth.client.fingerprints?.userAgent ||
        client.auth.client.fingerprints?.["user-agent"],
      ja3: client.auth.client.fingerprints?.ja3,
      ja4r: client.auth.client.fingerprints?.ja4r,
      body: body || undefined,
      proxy: client.proxy || undefined,
      referrer: "https://x.com/",
    },
    method,
  );
}

export default (client) => ({
  async create(source, opts = {}) {
    if (!client.auth) throw new Error("you must be logged in to upload media");

    let buf;
    let mediaType = opts.mediaType;

    if (typeof source === "string") {
      buf = await readFile(source);
      if (!mediaType) mediaType = MIME_BY_EXT[extname(source).toLowerCase()];
    } else if (typeof Blob !== "undefined" && source instanceof Blob) {
      buf = Buffer.from(await source.arrayBuffer());
      if (!mediaType) mediaType = source.type || undefined;
    } else if (
      source instanceof ArrayBuffer ||
      source instanceof SharedArrayBuffer
    ) {
      buf = Buffer.from(source);
    } else if (Buffer.isBuffer(source) || source instanceof Uint8Array) {
      buf = Buffer.from(source);
    } else {
      throw new Error(
        "source must be a file path (string), Buffer, Uint8Array, ArrayBuffer, or Blob",
      );
    }

    if (!mediaType) mediaType = detectMediaType(buf);
    if (!mediaType)
      throw new Error(
        "could not detect media type — pass opts.mediaType (e.g. 'image/png')",
      );

    const totalBytes = buf.length;
    const uploadType = opts.type === "dm" ? "dm" : "tweet";
    const category = getMediaCategory(mediaType, uploadType);
    checkMediaSize(category, totalBytes);

    const initRes = await makeUploadRequest(client, "post", {
      command: "INIT",
      media_type: mediaType,
      total_bytes: totalBytes.toString(),
      media_category: category,
    });

    const initData = await initRes.json();
    if (!initData?.media_id_string) {
      throw new Error(`upload INIT failed: ${JSON.stringify(initData)}`);
    }
    const mediaId = initData.media_id_string;

    let segmentIndex = 0;
    for (let offset = 0; offset < totalBytes; offset += CHUNK_SIZE) {
      const chunk = buf.slice(
        offset,
        Math.min(offset + CHUNK_SIZE, totalBytes),
      );
      const base64 = chunk.toString("base64");

      await makeUploadRequest(
        client,
        "post",
        {
          command: "APPEND",
          media_id: mediaId,
          segment_index: segmentIndex.toString(),
        },
        `media_data=${encodeURIComponent(base64)}`,
        { "content-type": "application/x-www-form-urlencoded" },
      );
      segmentIndex++;
    }

    const finalizeRes = await makeUploadRequest(client, "post", {
      command: "FINALIZE",
      media_id: mediaId,
      allow_async: "true",
    });

    const finalizeData = await finalizeRes.json();
    if (finalizeData?.error) {
      throw new Error(
        `upload FINALIZE failed: ${JSON.stringify(finalizeData)}`,
      );
    }

    let processingInfo = finalizeData?.processing_info;
    while (processingInfo) {
      if (processingInfo.error) {
        throw new Error(
          `media processing error: ${JSON.stringify(processingInfo.error)}`,
        );
      }
      if (processingInfo.state === "succeeded") break;
      if (processingInfo.state === "failed") {
        throw new Error(
          `media processing failed: ${JSON.stringify(processingInfo)}`,
        );
      }

      const wait = (processingInfo.check_after_secs || 2) * 1000;
      await new Promise((r) => setTimeout(r, wait));

      const statusRes = await makeUploadRequest(client, "get", {
        command: "STATUS",
        media_id: mediaId,
      });
      const statusData = await statusRes.json();
      processingInfo = statusData?.processing_info;
    }

    if (opts.alt_text) {
      await client.v1_1("media/metadata/create", {
        body: JSON.stringify({
          media_id: mediaId,
          alt_text: { text: opts.alt_text },
        }),
      });
    }

    return { media_id: mediaId, ...finalizeData };
  },

  async createMetadata(mediaId, altText, opts = {}) {
    const res = await client.v1_1("media/metadata/create", {
      body: JSON.stringify({
        media_id: mediaId,
        alt_text: { text: altText },
        ...opts,
      }),
    });
    return await res.json();
  },

  async createSubtitles(mediaId, subtitles) {
    const res = await client.v1_1("media/subtitles/create", {
      body: JSON.stringify({
        media_id: mediaId,
        media_category: "tweet_video",
        subtitle_info: {
          subtitles: Array.isArray(subtitles) ? subtitles : [subtitles],
        },
      }),
    });
    return await res.json();
  },
});
