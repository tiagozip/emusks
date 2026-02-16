# Syndication API

Syndication is the internal Twitter API used for generating tweet embeds, unauthenticated. It's great for converting thousands of tweet IDs to actual tweets, fast, and needing an account that could get suspended.

As far as I know, this API has no ratelimits. This API only supports fetching tweets as profile timelines have been effectively removed from the embeds API and no longer work.

## `syndication.getTweet(tweetId)`

```js
import Emusks from "emusks";

const client = new Emusks();

// you don't have to authenticate!

const tweet = await client.syndication.getTweet("2023357708301455483");
```
```json
{
  "__typename": "Tweet",
  "lang": "en",
  "favorite_count": 14,
  "created_at": "2026-02-16T11:24:04.000Z",
  "display_text_range": [ 0, 155 ],
  "entities": {
    "hashtags": {},
    "urls": {},
    "user_mentions": {},
    "symbols": {}
  },
  "id_str": "2023357708301455483",
  "text": "Underdocumented: `bun build --compile` supports `--splitting —format=esm` Lazy load code embedded in your single-file executable to improve CLI start time",
  "user": {
    "id_str": "2489440172",
    "name": "Jarred Sumner",
    "screen_name": "jarredsumner",
    "is_blue_verified": true,
    "profile_image_shape": "Circle",
    "verified": false,
    "profile_image_url_https": "https://pbs.twimg.com/profile_images/1342417825483300864/Vz4ChOFG_normal.jpg",
    "highlighted_label": {
      "description": "Bun",
      "badge": {
        "url": "https://pbs.twimg.com/profile_images/1809959835884216320/MDn6rbnJ_bigger.jpg"
      },
      "url": {
        "url": "https://twitter.com/bunjavascript",
        "url_type": "DeepLink"
      },
      "user_label_type": "BusinessLabel",
      "user_label_display_type": "Badge"
    }
  },
  "edit_control": {
    "edit_tweet_ids": [ "2023357708301455483" ],
    "editable_until_msecs": "1771244644000",
    "is_edit_eligible": true,
    "edits_remaining": "5"
  },
  "conversation_count": 1,
  "news_action_type": "conversation",
  "isEdited": false,
  "isStaleEdit": false
}
```

### Videos
```json
{
  "__typename": "Tweet",
  "lang": "und",
  "favorite_count": 1101,
  "possibly_sensitive": false,
  "created_at": "2026-02-16T01:18:42.000Z",
  "display_text_range": [0, 130],
  "entities": {
    "hashtags": [],
    "urls": [],
    "user_mentions": [],
    "symbols": [],
    "media": [
      {
        "display_url": "pic.x.com/5xrYfslWJc",
        "expanded_url": "https://x.com/ExtremeBlitz__/status/2023205364368351634/video/1",
        "indices": [86, 109],
        "url": "https://t.co/5xrYfslWJc"
      }
    ]
  },
  "id_str": "2023205364368351634",
  "text": "…",
  "user": { … },
  "edit_control": { … },
  "mediaDetails": [
    {
      "additional_media_info": {},
      "display_url": "pic.x.com/5xrYfslWJc",
      "expanded_url": "https://x.com/ExtremeBlitz__/status/2023205364368351634/video/1",
      "ext_media_availability": {
        "status": "Available"
      },
      "indices": [86, 109],
      "media_url_https": "https://pbs.twimg.com/amplify_video_thumb/2023205304318488576/img/ljIYhvhxV9SKP3IB.jpg",
      "original_info": {
        "height": 514,
        "width": 1080,
        "focus_rects": []
      },
      "sizes": {
        "large": {
          "h": 514,
          "resize": "fit",
          "w": 1080
        },
        "medium": { … },
        "small": { … },
        "thumb": { … }
      },
      "type": "video",
      "url": "https://t.co/5xrYfslWJc",
      "video_info": {
        "aspect_ratio": [540, 257],
        "duration_millis": 9516,
        "variants": [
          {
            "content_type": "application/x-mpegURL",
            "url": "https://video.twimg.com/amplify_video/2023205304318488576/pl/MC4uaCsa2h7OlCkT.m3u8"
          },
          {
            "bitrate": 256000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/amplify_video/2023205304318488576/vid/avc1/566x270/AYxnjkt3c60VBmoa.mp4"
          },
          …
        ]
      }
    }
  ],
  "photos": [],
  "video": {
    "aspectRatio": [540, 257],
    "contentType": "media_entity",
    "durationMs": 9516,
    "mediaAvailability": {
      "status": "available"
    },
    "poster": "https://pbs.twimg.com/amplify_video_thumb/2023205304318488576/img/ljIYhvhxV9SKP3IB.jpg",
    "variants": [
      {
        "type": "application/x-mpegURL",
        "src": "https://video.twimg.com/amplify_video/2023205304318488576/pl/MC4uaCsa2h7OlCkT.m3u8"
      },
      {
        "type": "video/mp4",
        "src": "https://video.twimg.com/amplify_video/2023205304318488576/vid/avc1/566x270/AYxnjkt3c60VBmoa.mp4"
      },
      …
    ],
    "videoId": {
      "type": "tweet",
      "id": "2023205364368351634"
    },
    "viewCount": 0
  },
  "conversation_count": 23,
  "news_action_type": "conversation",
  "isEdited": false,
  "isStaleEdit": false
}
```

### Deleted tweets
If a tweet is deleted or the account suspended, it'll show up as a `TweetTombstone`:

```json
{
  "__typename": "TweetTombstone",
  "tombstone": {
    "text": {
      "text": "This Post was deleted by the Post author. Learn more",
      "entities": [
        {
          "from_index": 42,
          "to_index": 52,
          "ref": {
            "__typename": "TimelineUrl",
            "url": "https://help.twitter.com/rules-and-policies/notices-on-twitter",
            "url_type": "ExternalUrl"
          }
        }
      ],
     "rtl": false
    }
  }
}
```