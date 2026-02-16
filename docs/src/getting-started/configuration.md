# Configuration

emusks lets you customize how it connects to Twitter/X. You can choose which client to emulate, route traffic through a proxy, and access the raw API layers directly.

## Client selection

Twitter/X uses different API configurations depending on which app you're using. emusks can emulate any of the official clients, each with its own bearer tokens and HTTP fingerprints.

```js
import Emusks from "emusks";

const client = new Emusks();
await client.login({
  auth_token: "your_auth_token_here",
  client: "tweetdeck", // emulate the tweetdeck client (premium-only)
});
```

Please note that the availability of clients constantly changes, and some may get your account suspended.

Changing the client usually doesn't require getting a new auth token, but you may need to change it if you sign out or get CAPTCHA'd.

The current built-in clients are `android`, `iphone`, `ipad`, `mac`, `old`, `web`, and `tweetdeck`.

::: tip Custom clients
By default, emusks uses the "web" client, which is the most common and least likely to raise suspicion. However, if you want to emulate a different client or use a custom bearer token, you can do so with the `client` option.

Custom clients may be useful for avoiding rate-limits and making sure your app to be stable and long-running. If you need a bearer, please [DM](https://x.com/0xtiago_) or [email](mailto:fancy-chewy-oblong@duck.com) me. To use a custom client, pass an object instead of a string:

```js
{
  bearer: "AAAAAAAAAAAAAAAAAAAAA…",
  fingerprints: {
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
    ja3: "771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,35-5-27-16-0-10-13-23-45-65037-17613-18-65281-51-43-11,4588-29-23-24,0",
    ja4r: "t13d1516h2_002f,0035,009c,009d,1301,1302,1303,c013,c014,c02b,c02c,c02f,c030,cca8,cca9_0005,000a,000b,000d,0012,0017,001b,0023,002b,002d,0033,44cd,fe0d,ff01_0403,0804,0401,0503,0805,0501,0806,0601",
  },
},
```

:::

## Proxy support

Route all API traffic through an HTTP proxy. This is useful for avoiding rate limits, changing IP addresses, or accessing Twitter from restricted networks.

```js
const client = new Emusks();
await client.login({
  auth_token: "your_auth_token_here",
  proxy: "protocol://user:pass@host:port", // (supports http, socks4, socks5, socks5h)
});
```

Rotating proxies are not supported by default and I don't recommend using them. While you could constantly rotate the `proxy` sent to the client yourself, Twitter will most likely notice it and get suspicious of a single session being used from many IPs.

## Handling errors

emusks throws errors sent from the Twitter GraphQL API by default. You can catch these errors using a try-catch block, and for long-running apps we recommnd setting a system for you to be notified in case your account gets locked or rate-limited:

```
83 |       method,
84 |     )
85 |   ).json();
86 |
87 |   if (res?.errors?.[0]) {
88 |     throw new Error(res.errors.map((err) => err.message).join(", "));
                   ^
error: Authorization: Denied by access control: Missing TwitterUserNotSuspended; To protect our users from spam and other malicious activity, this account is temporarily locked. Please log in to https://twitter.com to unlock your account.
```

## Next steps

You're all set! Explore the helper namespaces to start building:

- **[Tweets](/tweets/tweets)** — Create, like, retweet, and manage tweets
- **[Users](/users/users)** — Follow, block, mute, and look up users
- **[Search](/discovery/search)** — Search tweets, users, and media
- **[Account](/account/settings)** — Manage your account settings and security
