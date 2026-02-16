# Profile

View your profile information, manage account labels, and check the availability of emails, phone numbers, and usernames.

## `account.viewer()`

Get the currently authenticated user's full profile. Uses the GraphQL `Viewer` query.

```js
const me = await client.account.viewer();
console.log(me.id);
console.log(me.username);
console.log(me.name);
console.log(me.stats.followers.count);
console.log(me.stats.following);
```

**Returns:** A parsed user object with all profile fields, stats, and verification status.

## `account.claims()`

Get user claims such as verified status claims. Uses the GraphQL `GetUserClaims` query.

```js
const claims = await client.account.claims();
console.log(claims);
```

## `account.phoneState()`

Get your profile's phone verification state. Uses the GraphQL `ProfileUserPhoneState` query.

```js
const state = await client.account.phoneState();
console.log(state);
```

## `account.accountLabel()`

Get your current account label status (e.g. government, business, bot). Uses the GraphQL `UserAccountLabel` query.

```js
const label = await client.account.accountLabel();
console.log(label);
```

## `account.disableAccountLabel()`

Remove your account label. Uses the GraphQL `DisableUserAccountLabel` mutation.

```js
await client.account.disableAccountLabel();
```

## `account.enableVerifiedPhoneLabel()`

Enable the verified phone label on your profile. Uses the GraphQL `EnableVerifiedPhoneLabel` mutation.

```js
await client.account.enableVerifiedPhoneLabel();
```

## `account.disableVerifiedPhoneLabel()`

Disable the verified phone label on your profile. Uses the GraphQL `DisableVerifiedPhoneLabel` mutation.

```js
await client.account.disableVerifiedPhoneLabel();
```

## `account.emailAvailable(email)`

Check if an email address is available for registration. Uses the v1.1 `users/email_available` endpoint.

```js
const result = await client.account.emailAvailable("test@example.com");
console.log(result.valid); // true if available
```

## `account.phoneAvailable(phone)`

Check if a phone number is available. Uses the v1.1 `users/phone_number_available` endpoint.

```js
const result = await client.account.phoneAvailable("+1234567890");
console.log(result);
```

## `account.usernameAvailable(username)`

Check if a username (handle) is available and get alternative suggestions. Uses the GraphQL `GetUsernameAvailabilityAndSuggestions` mutation.

```js
const result = await client.account.usernameAvailable("desired_username");
console.log(result);
```

## `account.emailPhoneInfo(params?)`

Get the email and phone information associated with the account. Uses the v1.1 `users/email_phone_info` endpoint.

```js
const info = await client.account.emailPhoneInfo();
console.log(info);
```

## `account.resendConfirmationEmail()`

Resend the confirmation email for your account if it hasn't been verified yet. Uses the v1.1 `account/resend_confirmation_email` endpoint.

```js
await client.account.resendConfirmationEmail();
```

## Updating Your Profile

Profile updates like changing your display name, bio, location, website, and profile images are available through the **Users** namespace. See the [Users documentation](/users/users) for details.

```js
// Update display name, bio, location, and website
await client.users.updateProfile({
  name: "New Display Name",
  description: "My updated bio ✨",
  location: "San Francisco, CA",
  url: "https://example.com",
});

// Update profile picture (base64 image data)
await client.users.updateProfileImage(base64ImageData);

// Update banner image
await client.users.updateProfileBanner(base64BannerData);

// Remove banner
await client.users.removeProfileBanner();
```

## Full example

```js
// Get your full profile
const me = await client.account.viewer();
console.log(`Logged in as @${me.username}`);
console.log(`Name: ${me.name}`);
console.log(`Followers: ${me.stats.followers.count}`);
console.log(`Following: ${me.stats.following}`);
console.log(`Tweets: ${me.stats.posts}`);

// Check your account label
const label = await client.account.accountLabel();
console.log(`Account label: ${JSON.stringify(label)}`);

// Check phone verification state
const phoneState = await client.account.phoneState();
console.log(`Phone state: ${JSON.stringify(phoneState)}`);

// Get claims (verification info)
const claims = await client.account.claims();

// Check availability before changing your username
const available = await client.account.usernameAvailable("new_handle");
console.log(`Username available: ${JSON.stringify(available)}`);

// Check email availability
const emailCheck = await client.account.emailAvailable("newemail@example.com");

// Get email and phone info on file
const contactInfo = await client.account.emailPhoneInfo();

// Manage labels
await client.account.enableVerifiedPhoneLabel();
// or
await client.account.disableVerifiedPhoneLabel();

// Update your profile via the users namespace
await client.users.updateProfile({
  name: "Updated Name",
  description: "Building cool things 🚀",
  location: "Earth",
});
```
