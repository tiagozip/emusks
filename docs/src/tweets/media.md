# Media

Upload images, GIFs, and videos, then attach them to tweets.

## `media.create(source, opts?)`

Upload media to Twitter. Returns a `media_id` you can pass to [`tweets.create()`](./tweets#tweets-create-text-opts).

| Param | Type | Description |
| --- | --- | --- |
| `source` | `string \| Buffer \| Uint8Array \| ArrayBuffer \| Blob` | A **file path**, `Buffer`, typed array, or `Blob` containing the media |
| `opts.alt_text` | `string` | Alt text for accessibility (applied automatically after upload) |
| `opts.mediaType` | `string` | Explicit MIME type (e.g. `"image/png"`). Auto-detected when omitted |
| `opts.type` | `"tweet" \| "dm"` | Upload context — defaults to `"tweet"`. Use `"dm"` for direct messages |

**Returns:** `{ media_id, ... }` — use `media_id` with `tweets.create()`.

**Auto-detected types:** JPEG, PNG, GIF, WebP, MP4, WebM. If detection fails, pass `opts.mediaType` explicitly.

### Size limits

| Type  | Max size |
| ----- | -------- |
| Image | 5 MB     |
| GIF   | 15 MB    |
| Video | 512 MB   |

### Examples

```js
import { readFileSync } from "fs";

// Upload from a file path
const img = await client.media.create("./photo.jpg");
const tweet = await client.tweets.create("Check this out!", {
  mediaIds: [img.media_id],
});

// Upload a Buffer with alt text
const buf = readFileSync("./chart.png");
const chart = await client.media.create(buf, {
  alt_text: "A bar chart showing monthly revenue growth",
});
await client.tweets.create("Q4 results 📊", {
  mediaIds: [chart.media_id],
});

// Upload a video
const video = await client.media.create("./clip.mp4");
await client.tweets.create("Watch this!", {
  mediaIds: [video.media_id],
});

// Upload a Blob (e.g. from fetch)
const response = await fetch("https://example.com/image.png");
const blob = await response.blob();
const uploaded = await client.media.create(blob);

// Upload for a DM
const dm = await client.media.create("./sticker.gif", { type: "dm" });

// Explicit MIME type
const raw = await client.media.create(someBuffer, {
  mediaType: "image/webp",
});
```

### Upload multiple media

```js
const [a, b, c] = await Promise.all([
  client.media.create("./pic1.jpg", { alt_text: "First photo" }),
  client.media.create("./pic2.jpg", { alt_text: "Second photo" }),
  client.media.create("./pic3.jpg", { alt_text: "Third photo" }),
]);

await client.tweets.create("Photo dump 🧵", {
  mediaIds: [a.media_id, b.media_id, c.media_id],
});
```

::: tip
Always add `alt_text`! It makes your media accessible to users who rely on screen readers — and it only takes one extra option.
:::

## `media.createMetadata(mediaId, altText, opts?)`

Set alt text and metadata for an already-uploaded media item. Uses the v1.1 `media/metadata/create` endpoint.

::: tip
`media.create()` will do this for you when passing an `alt_text`
:::

| Param     | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `mediaId` | `string` | The media ID returned from upload   |
| `altText` | `string` | Alt text description for the media  |
| `opts`    | `object` | Additional metadata fields to merge |

```js
await client.media.createMetadata(
  "1234567890",
  "A photo of a sunset over the ocean",
);
```

## `media.createSubtitles(mediaId, subtitles)`

Attach subtitles / captions to a video. Uses the v1.1 `media/subtitles/create` endpoint.

| Param | Type | Description |
| --- | --- | --- |
| `mediaId` | `string` | The video media ID |
| `subtitles` | `object \| array` | A subtitle object or array of subtitle objects |

Each subtitle object:

| Field           | Type     | Description                     |
| --------------- | -------- | ------------------------------- |
| `media_id`      | `string` | Media ID of the subtitle file   |
| `language_code` | `string` | Language code (e.g. `"en"`)     |
| `display_name`  | `string` | Display name (e.g. `"English"`) |

```js
// Single subtitle track
await client.media.createSubtitles("1234567890", {
  media_id: "9876543210",
  language_code: "en",
  display_name: "English",
});

// Multiple subtitle tracks
await client.media.createSubtitles("1234567890", [
  { media_id: "9876543210", language_code: "en", display_name: "English" },
  { media_id: "1111111111", language_code: "es", display_name: "Español" },
]);
```
