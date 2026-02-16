# Search operators

Twitter supports dozens of advanced search filters and operators that let you find specific tweets, users, or media.

These operators work with [`search.tweets()`](/discovery/search#search-tweets-query-opts) along with most official clients. They mostly do **not work** with [`search.adaptive`](/discovery/search#search-adaptive-query-params), as it uses v1.1 search.

## Operators

### Tweet content

| Operator               | Finds tweets…                                                                              |                                                                                    |
| :--------------------- | :----------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| `nasa esa`             | Containing both "nasa" and "esa". (Spaces = **AND**)                                       | [🔗](https://x.com/search?q=esa%20nasa&f=live)                                     |
| `nasa OR esa`          | Either "nasa" or "esa" (or both). **OR** must be capitalized.                              | [🔗](https://x.com/search?q=nasa%20OR%20esa&f=live)                                |
| `"state of the art"`   | The exact phrase. Also matches "state-of-the-art".                                         | [🔗](https://x.com/search?q=%22state%20of%20the%20art%22&f=live)                   |
| `"this is the * time"` | Quoted phrase with a **wildcard**. `*` only works inside quotes.                           | [🔗](https://x.com/search?q=%22this%20is%20the%20*%20time%20this%20week%22&f=live) |
| `+radiooooo`           | Forces the term as-is. Prevents "did you mean" corrections.                                | [🔗](https://x.com/search?q=%2Bradiooooo&f=live)                                   |
| `-love`                | Excludes tweets containing "love". Works with phrases: `-"live laugh love"`.               | [🔗](https://x.com/search?q=bears%20-chicagobears&f=live)                          |
| `#tgif`                | Tweets containing a specific hashtag.                                                      | [🔗](https://x.com/search?q=%23tgif&f=live)                                        |
| `$TWTR`                | Tweets containing a cashtag (stock symbols).                                               | [🔗](https://x.com/search?q=%24TWTR&f=live)                                        |
| `What ?`               | Finds tweets where a question mark is used.                                                | [🔗](<https://x.com/search?q=(Who%20OR%20What)%20%3F&f=live>)                      |
| `:)` / `:(`            | Matches positive (`:)`, `:-)`, `:P`, `:D`) or negative (`:(`, `:-(`) emoticons.            | [🔗](https://x.com/search?q=%3A%29%20OR%20%3A%28&f=live)                           |
| `👀`                   | Matches specific emojis. Usually requires a keyword or `lang:` to work.                    | [🔗](https://x.com/search?q=%F0%9F%91%80%20lang%3Aen&f=live)                       |
| `url:google.com`       | Matches URLs. Tokenized: use underscores for hyphens (e.g., `url:t_mobile.com`).           | [🔗](https://x.com/search?q=url%3Agu.com&f=live)                                   |
| `lang:en`              | Filters by language (e.g., `en`, `es`, `fr`, `ja`). See [Language codes](#language-codes). | [🔗](https://x.com/search?q=lang%3Aen&f=live)                                      |

### User & account

| Operator               | Finds tweets…                                                               | Example                 |
| :--------------------- | :-------------------------------------------------------------------------- | :---------------------- |
| `from:user`            | Sent by a specific `@username`.                                             | `dogs from:NASA`        |
| `to:user`              | Tweets that are a direct reply to `@username`.                              | `to:NASA #MoonTunes`    |
| `@user`                | Tweets mentioning `@username`. Combine with `-from:user` for mentions only. | `@cern -from:cern`      |
| `list:ID`              | Tweets from members of a public List (Use ID or `user/slug`).               | `list:esa/astronauts`   |
| `filter:verified`      | From legacy verified accounts.                                              | `filter:verified`       |
| `filter:blue_verified` | From accounts with X Premium (paid checkmark).                              | `filter:blue_verified`  |
| `filter:follows`       | Only from accounts you follow. (Cannot be negated).                         | `kitten filter:follows` |
| `filter:social`        | From your extended network (based on activity).                             | `filter:social`         |

### Location

| Operator             | Finds tweets…                                                                                                         | Example                     |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------- | :-------------------------- |
| `near:city`          | Geotagged in a specific location. Supports phrases: `near:"The Hague"`.                                               | `near:London`               |
| `near:me`            | Geotagged near your current IP/detected location.                                                                     | `near:me`                   |
| `within:radius`      | Use with `near` to set a radius (km or mi).                                                                           | `fire near:SF within:10km`  |
| `geocode:lat,long,r` | Tweets within radius `r` of exact coordinates.                                                                        | `geocode:37.77,-122.41,1km` |
| `place:ID`           | Search by X [Place Object ID](https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/geo). | `place:96683cc9126741d1`    |

### Time & date

| Operator             | Finds tweets…                                                             | Example                         |
| :------------------- | :------------------------------------------------------------------------ | :------------------------------ |
| `since:YYYY-MM-DD`   | Sent on or after this date. (Inclusive).                                  | `since:2024-01-01`              |
| `until:YYYY-MM-DD`   | Sent before this date. (**Not** inclusive).                               | `until:2024-01-01`              |
| `since:DATE_TIME_TZ` | Granular time: `since:2023-01-01_23:59:59_UTC`.                           | `since:2023-10-13_00:00:00_UTC` |
| `since_time:12345`   | On or after a specific Unix timestamp (seconds).                          | `since_time:1561720321`         |
| `until_time:12345`   | Before a specific Unix timestamp (seconds).                               | `until_time:1562198400`         |
| `since_id:ID`        | After (not inclusive) a specific Snowflake Tweet ID.                      | `since_id:1138872932`           |
| `max_id:ID`          | At or before (inclusive) a specific Snowflake Tweet ID.                   | `max_id:1144730280`             |
| `within_time:10m`    | Within the last `d` (days), `h` (hours), `m` (minutes), or `s` (seconds). | `nasa within_time:30s`          |

### Tweet type & logic

| Operator                 | Finds tweets…                                                            | Example                           |
| :----------------------- | :----------------------------------------------------------------------- | :-------------------------------- |
| `filter:nativeretweets`  | Only "retweet button" retweets. (Last 7-10 days only).                   | `from:nasa filter:nativeretweets` |
| `include:nativeretweets` | Includes retweets in results (hidden by default).                        | `include:nativeretweets`          |
| `filter:replies`         | Only tweets that are replies.                                            | `filter:replies -to:nasa`         |
| `filter:self_threads`    | Only self-replies (the author replying to themselves).                   | `filter:self_threads`             |
| `filter:quote`           | Only contains Quote Tweets.                                              | `filter:quote`                    |
| `conversation_id:ID`     | Every tweet in a specific thread/conversation.                           | `conversation_id:1140437409`      |
| `quoted_tweet_id:ID`     | Quotes of a specific Tweet ID.                                           | `quoted_tweet_id:113863184`       |
| `quoted_user_id:ID`      | All quotes of a specific User ID (numeric).                              | `quoted_user_id:11348282`         |
| `card_name:pollXchoice`  | Tweets with polls. Options: `poll2choice_text_only`, `poll3choice`, etc. | `card_name:poll4choice_text_only` |

### Engagement & media

| Operator                 | Finds tweets…                                                 | Example                  |
| :----------------------- | :------------------------------------------------------------ | :----------------------- |
| `filter:has_engagement`  | Has at least one like/reply/RT. Negate to find "dead" tweets. | `-filter:has_engagement` |
| `min_retweets:X`         | Minimum number of Retweets.                                   | `min_retweets:500`       |
| `min_faves:X`            | Minimum number of Likes (Faves).                              | `min_faves:1000`         |
| `min_replies:X`          | Minimum number of Replies.                                    | `min_replies:100`        |
| `-min_faves:X`           | Maximum number of Likes.                                      | `-min_faves:10`          |
| `filter:media`           | Any media (images, video, GIFs).                              | `cat filter:media`       |
| `filter:images`          | Tweets containing images.                                     | `filter:images`          |
| `filter:twimg`           | Specifically native X/Twitter images (`pic.twitter.com`).     | `filter:twimg`           |
| `filter:videos`          | Any video (Native, YouTube, etc.).                            | `filter:videos`          |
| `filter:consumer_video`  | Native X video only.                                          | `filter:consumer_video`  |
| `filter:pro_video`       | Amplify/Pro video only.                                       | `filter:pro_video`       |
| `filter:spaces`          | Live or recorded Twitter Spaces.                              | `filter:spaces`          |
| `card_name:animated_gif` | Tweets containing GIFs.                                       | `card_name:animated_gif` |

## Matching

### Logical grouping

Spaces are implicit **AND**. Use parentheses to group conditions.

- **Query:** `(puppy OR kitten) (sweet OR cute) -filter:nativeretweets min_faves:10`
- **Meaning:** Find tweets about puppies or kittens AND sweet or cute, excluding retweets, with 10+ likes.

### Force literal matches

X uses "signal words." If you search for the word `photo`, X thinks you want `filter:images`. To avoid this, wrap it in quotes, like `"photo"`.

### URL tokenization

X strips hyphens from parameters and you should use underscore instead. `url:t-mobile.com` won't work, but `url:t_mobile.com` will. This applies to all URL-based operators (`url:`, `filter:links`, etc.).

### Quote-Tweet Permalinks

From a technical perspective, quote-tweets are tweets with a URL of another tweet. It's possible to find Tweets that quote a specific Tweet by searching for the URL of that Tweet.

To find everyone quoting a specific tweet, search for the tweet's URL and exclude the original author, like `https://x.com/jack/status/20 -from:jack`.

Any parameters must be removed or only Tweets that contain the parameter as well are found. This includes the automatic client parameter added when using the share menu (eg. ?s=20 for the Web App and ?s=09 for the Android app)

## Snowflakes

All X IDs (tweets, users) embed a timestamp. This allows you to search with precise time boundaries using `since_id` or `max_id`.

To convert an **ID to millisecond epoch**, use `milliepoch = (tweet_id >> 22) + 1288834974657`.

To convert an **epoch to ID**, use `tweet_id = (milliepoch - 1288834974657) << 22`.

```python
def milliepoch_to_id(ms):
    if ms <= 1288834974657: raise ValueError("Too early")
    return (ms - 1288834974657) << 22

def id_to_milliepoch(id):
    if id <= 0: raise ValueError("Invalid ID")
    return (id >> 22) + 1288834974657
```

## Language codes

Twitter supports several unique language filters for specific tweet structures:

| Code       | Purpose                                           |
| :--------- | :------------------------------------------------ |
| `lang:und` | Unknown (usually just links, numbers, or emojis). |
| `lang:qam` | Tweets containing **Mentions only**.              |
| `lang:qct` | Tweets containing **Cashtags only**.              |
| `lang:qht` | Tweets containing **Hashtags only**.              |
| `lang:qme` | Tweets containing **Media links only**.           |
| `lang:qst` | Tweets with **Very short text**.                  |
| `lang:zxx` | **No text** (Media or Twitter Card only).         |

## Searching by client

You can filter tweets by the app they were sent from.

These should work for every single client, official or not. If it isn't, try putting the client name in quotes or replace spaces with underscores.

You cannot copy an existing name. This operator needs to be combined with something else to work, eg `lang:en`.

**Examples:**

- `source:twitter_web_client`
- `source:twitter_web_app`
- `source:twitter_for_iphone`
- `source:twitter_for_ipad`
- `source:twitter_for_mac`
- `source:twitter_for_android`
- `source:twitter_ads` (promoted tweets)
- `source:tweetdeck`
- `source:tweetdeck_web_app`
- `source:twitter_for_advertisers`
- `source:twitter_media_studio`
- `source:cloudhopper` (sms gateway)
- custom clients, like `source:IFTTT` or `source:Instagram`

## News site filter

When using `filter:news`, Twitter makes sure every result includes a link to a [whitelist of "news" websites](https://gist.github.com/igorbrigadir/ef143d2f3167258359007a0ff7ac401d).

## Limitations

- **Operator limit:** You can typically only use ~22-23 operators in a single query.

- **Card names:** `card_name:` searches are usually limited to the last 7-8 days of data.

- **Private accounts:** Tweets from private (protected), suspended, or locked accounts will never appear in search results.

- **Time logic:** Date/Time operators usually must be combined with a keyword or user filter to function correctly.
