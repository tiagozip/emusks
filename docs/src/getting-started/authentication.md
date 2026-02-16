# Authentication

Before using emusks, you must authenticate your client. emusks supports two authentication methods: **auth token** login and **username/password** login.

## Auth token login

The simplest way to authenticate is with a Twitter/X auth token. This is a cookie value (`auth_token`) from an active browser session.

```js
import Emusks from "emusks";

const client = new Emusks();
await client.login("your_auth_token_here");
```

You may also provide an object if you'd like to configure proxies or a custom client:

```js
await client.login({
  auth_token: "your_auth_token_here",
  // e.g. proxy: "protocol://user:pass@host:port",
});
```

### Finding your auth token

1. Open [x.com](https://x.com) in your browser and log in
2. Open Developer Tools (`F12` or `Cmd+Shift+I`)
3. Go to **Application** → **Cookies** → `https://x.com`
4. Find the cookie named `auth_token`
5. Copy its value

## Username & password login

You can also log in with your account credentials. This method handles the full login flow, including two-factor authentication and email verification challenges.

```js
const client = new Emusks();
await client.login({
  type: "password",
  username: "your_username",
  password: "your_password",
});
```

::: warning

We do **not** recommend using username/password login as it is very unreliable and may randomly break. Using an auth token is the recommended way to log in.

:::

### 2FA & email verification

If your account has two-factor authentication enabled or Twitter requests an email/phone verification, use the `onRequest` callback to provide the required codes:

```js
const client = new Emusks();
await client.login({
  type: "password",
  username: "your_username",
  password: "your_password",
  onRequest: async (type) => {
    if (type === "two_factor_code") {
      // Return your 2FA code (e.g. from an authenticator app)
      return "123456";
    }
    if (type === "email_code") {
      // Return the code sent to your email
      return "654321";
    }
  },
});
```

`onRequest` is blocking. If Twitter asks for a code, your callback must return it before the login can continue.

We recommend making your app support email code verification if you rely on username/password login. Twitter commonly prompts for email/phone verification when logging in from emusks as it can't solve Castle challenges.

If you do rely on this, I also recommend setting all data so it can handle as much of the login flow as possible without needing to prompt you:

```js
const client = new Emusks();
await client.login({
  type: "password",
  username: "your_username",
  password: "your_password",
  email: "your_email@example.com",
  phone: "+1234567890",
  onRequest: async (type) => {
    if (type === "two_factor_code") return "123456";
  },
});
```

## Reference

| Option       | Type       | Description                                                                     |
| ------------ | ---------- | ------------------------------------------------------------------------------- |
| `auth_token` | `string`   | Your Twitter/X auth token (use directly as the argument to `login()`)           |
| `type`       | `string`   | Set to `"password"` for username/password login                                 |
| `username`   | `string`   | Your Twitter/X username                                                         |
| `password`   | `string`   | Your account password                                                           |
| `email`      | `string`   | Email for alternate identifier challenges                                       |
| `phone`      | `string`   | Phone number for alternate identifier challenges                                |
| `onRequest`  | `function` | Async callback for interactive login challenges (2FA, email verification, etc.) |

## Elevated Access

Some sensitive actions, like reading settings, require elevated access. After logging in, call `elevate()` with your password:

```js
await client.login("your_auth_token");

// Elevate your session for sensitive operations
await client.elevate("your_password");

// Now you can perform privileged actions
```

::: tip
You only need to elevate once per session. The elevated state persists until the session ends.
:::

## Checking your session

After logging in, you can verify your session by fetching your own profile:

```js
const me = await client.account.viewer();
console.log(`Logged in as @${me.username}`);
console.log(`Followers: ${me.stats.followers.count}`);
```

or by checking the output of the `client.login()` method, which returns your user object on successful authentication.

## Next steps

Head over to [Configuration](/getting-started/configuration) to learn how to choose which client to emulate, set up proxies, and customize your setup.
