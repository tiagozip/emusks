# Security

Manage your account security: passwords, two-factor authentication, sessions, backup codes, and connected applications.

## `account.verifyPassword(password)`

Verify a password against the current account. Useful for confirming the user's identity before sensitive operations. Uses the v1.1 `account/verify_password` endpoint.

```js
const result = await client.account.verifyPassword("my_password");
console.log(result.status); // "ok"
```

## `account.changePassword(currentPassword, newPassword)`

Change your account password. Uses the v1.1 `account/change_password` endpoint.

::: warning
Requires elevated access. Call `client.elevate(password)` first.
:::

```js
await client.elevate("current_password");
await client.account.changePassword("current_password", "new_secure_password");
```

## `account.passwordStrength(password)`

Check the strength of a password before setting it. Uses the v1.1 `account/password_strength` endpoint.

```js
const strength = await client.account.passwordStrength("my_new_password_123");
console.log(strength);
```

::: tip
Always check password strength before calling `changePassword()` to ensure the new password meets Twitter's requirements.
:::

## Two-Factor Authentication

### `account.disable2FA()`

Disable two-factor authentication on your account. Uses the v1.1 `account/login_verification_enrollment` endpoint.

::: warning
Requires elevated access. Call `client.elevate(password)` first.
:::

```js
await client.elevate("your_password");
await client.account.disable2FA();
```

### `account.remove2FAMethod(methodId)`

Remove a specific 2FA method, such as a security key or authenticator app. Uses the v1.1 `account/login_verification/remove_method` endpoint.

```js
await client.account.remove2FAMethod("method_id_here");
```

### `account.tempPassword()`

Generate a temporary password for app-specific login. This is useful when your account has 2FA enabled and you need to authenticate in a context that doesn't support interactive 2FA. Uses the v1.1 `account/login_verification/temporary_password` endpoint.

```js
const temp = await client.account.tempPassword();
console.log(temp);
```

### `account.renameSecurityKey(methodId, name)`

Rename a registered security key (e.g. a YubiKey or passkey). Uses the v1.1 `account/login_verification/rename_security_key_method` endpoint.

```js
await client.account.renameSecurityKey("method_id", "My YubiKey 5");
```

## Backup Codes

### `account.backupCode()`

Get your current backup code. Backup codes can be used to regain access to your account if you lose your 2FA device. Uses the v1.1 `account/backup_code` endpoint (GET).

```js
const code = await client.account.backupCode();
console.log(`Your backup code: ${code}`);
```

### `account.generateBackupCode()`

Generate a new backup code, invalidating the previous one. Uses the v1.1 `account/backup_code` endpoint (POST).

```js
const newCode = await client.account.generateBackupCode();
console.log(`New backup code: ${newCode}`);
```

::: danger
Generating a new backup code will invalidate your previous code. Make sure to store the new code in a safe place.
:::

## Sessions

### `account.sessions()`

Get a list of all active sessions on your account, including device info, location, and login time. Uses the GraphQL `UserSessionsList` query.

```js
const sessions = await client.account.sessions();
console.log(sessions);
```

## Connected Apps

### `account.connectedApps()`

List all third-party applications that have been granted access to your account. Uses the v1.1 `oauth/list` endpoint.

```js
const apps = await client.account.connectedApps();
console.log(`${apps.length} connected apps`);
```

### `account.revokeApp(token)`

Revoke access for a connected third-party application. Uses the v1.1 `oauth/revoke` endpoint.

```js
await client.account.revokeApp("app_token_here");
```

## Single Sign-On

### `account.deleteSSOConnection(connectionId)`

Delete an SSO (Single Sign-On) connection linked to your account (e.g. Google or Apple sign-in). Uses the v1.1 `sso/delete_connection` endpoint.

```js
await client.account.deleteSSOConnection("connection_id");
```

## `account.emailYourData()`

Request an email containing a copy of your Twitter data (tweets, DMs, profile info, etc.). Uses the v1.1 `account/personalization/email_your_data` endpoint.

```js
await client.account.emailYourData();
```

## Full example

```js
// Verify current password
const result = await client.account.verifyPassword("my_password");
console.log(`Password valid: ${result.status}`);

// Check strength of a new password
const strength = await client.account.passwordStrength("new_p@ssw0rd_2025!");

// Elevate session for sensitive operations
await client.elevate("my_password");

// Change password
await client.account.changePassword("my_password", "new_p@ssw0rd_2025!");

// View active sessions
const sessions = await client.account.sessions();
console.log(`Active sessions: ${JSON.stringify(sessions)}`);

// Manage backup codes
const currentCode = await client.account.backupCode();
console.log(`Current backup code: ${currentCode}`);

const newCode = await client.account.generateBackupCode();
console.log(`New backup code: ${newCode}`);

// Review and revoke connected apps
const apps = await client.account.connectedApps();
for (const app of apps) {
  console.log(`Connected app: ${JSON.stringify(app)}`);
}
// Revoke a specific app
await client.account.revokeApp("app_token_here");

// Manage 2FA
await client.elevate("your_password");
await client.account.disable2FA();

// Rename a security key
await client.account.renameSecurityKey("method_id", "Office YubiKey");

// Remove a specific 2FA method
await client.account.remove2FAMethod("method_id");

// Generate a temporary password for app login
const temp = await client.account.tempPassword();

// Remove an SSO connection
await client.account.deleteSSOConnection("connection_id");

// Request a copy of your data
await client.account.emailYourData();
```
