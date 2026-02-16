import parseUser from "../parsers/user.js";

export async function settings() {
  const res = await this.v1_1("get:account/settings", {});
  return await res.json();
}

export async function updateSettings(params = {}) {
  const res = await this.v1_1("post:account/settings", {
    body: JSON.stringify(params),
  });
  return await res.json();
}

export async function verifyPassword(password) {
  const res = await this.v1_1("account/verify_password", {
    body: `password=${encodeURIComponent(password)}`,
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });
  return await res.json();
}

export async function changePassword(currentPassword, newPassword) {
  const res = await this.v1_1("account/change_password", {
    body: JSON.stringify({
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPassword,
    }),
  });
  return await res.json();
}

export async function deactivate() {
  const res = await this.v1_1("account/deactivate", {});
  return await res.json();
}

export async function logout() {
  const res = await this.v1_1("account/logout", {});
  return await res.json();
}

export async function rateLimitStatus(params = {}) {
  const res = await this.v1_1("application/rate_limit_status", { params });
  return await res.json();
}

export async function viewer() {
  const res = await this.graphql("Viewer", {
    variables: { withCommunitiesMemberships: true },
    fieldToggles: { withAuxiliaryUserLabels: false },
  });
  const user = res?.data?.viewer?.user_results?.result;
  return user ? parseUser(user) : res;
}

export async function sessions() {
  return await this.graphql("UserSessionsList", {
    variables: {},
  });
}

export async function preferences() {
  return await this.graphql("UserPreferences", {
    variables: {},
  });
}

export async function claims() {
  return await this.graphql("GetUserClaims", {
    variables: {},
  });
}

export async function phoneState() {
  return await this.graphql("ProfileUserPhoneState", {
    variables: {},
  });
}

export async function passwordStrength(password) {
  const res = await this.v1_1("account/password_strength", {
    body: JSON.stringify({ password }),
  });
  return await res.json();
}

export async function resendConfirmationEmail() {
  const res = await this.v1_1("account/resend_confirmation_email", {});
  return await res.json();
}

export async function emailPhoneInfo(params = {}) {
  const res = await this.v1_1("users/email_phone_info", { params });
  return await res.json();
}

export async function emailAvailable(email) {
  const res = await this.v1_1("users/email_available", {
    params: { email },
  });
  return await res.json();
}

export async function phoneAvailable(phone) {
  const res = await this.v1_1("users/phone_number_available", {
    params: { phone_number: phone },
  });
  return await res.json();
}

export async function usernameAvailable(username) {
  return await this.graphql("GetUsernameAvailabilityAndSuggestions", {
    body: { variables: { username } },
  });
}

export async function backupCode() {
  const res = await this.v1_1("get:account/backup_code", {});
  return await res.json();
}

export async function generateBackupCode() {
  const res = await this.v1_1("post:account/backup_code", {});
  return await res.json();
}

export async function disable2FA() {
  const res = await this.v1_1("account/login_verification_enrollment", {});
  return await res.json();
}

export async function remove2FAMethod(methodId) {
  const res = await this.v1_1("account/login_verification/remove_method", {
    body: JSON.stringify({ method_id: methodId }),
  });
  return await res.json();
}

export async function tempPassword() {
  const res = await this.v1_1("account/login_verification/temporary_password", {});
  return await res.json();
}

export async function renameSecurityKey(methodId, name) {
  const res = await this.v1_1("account/login_verification/rename_security_key_method", {
    body: JSON.stringify({ method_id: methodId, name }),
  });
  return await res.json();
}

export async function connectedApps() {
  const res = await this.v1_1("oauth/list", {});
  return await res.json();
}

export async function revokeApp(token) {
  const res = await this.v1_1("oauth/revoke", {
    body: JSON.stringify({ token }),
  });
  return await res.json();
}

export async function deleteSSOConnection(connectionId) {
  const res = await this.v1_1("sso/delete_connection", {
    body: JSON.stringify({ connection_id: connectionId }),
  });
  return await res.json();
}

export async function personalizationInterests() {
  const res = await this.v1_1("account/personalization/twitter_interests", {});
  return await res.json();
}

export async function emailYourData() {
  const res = await this.v1_1("account/personalization/email_your_data", {});
  return await res.json();
}

export async function multiList() {
  const res = await this.v1_1("account/multi/list", {});
  return await res.json();
}

export async function enableVerifiedPhoneLabel() {
  return await this.graphql("EnableVerifiedPhoneLabel", {
    body: { variables: {} },
  });
}

export async function disableVerifiedPhoneLabel() {
  return await this.graphql("DisableVerifiedPhoneLabel", {
    body: { variables: {} },
  });
}

export async function dataSaverMode() {
  return await this.graphql("DataSaverMode", {
    variables: {},
  });
}

export async function setDataSaver(dataSaverMode) {
  return await this.graphql("WriteDataSaverPreferences", {
    body: { variables: { dataSaverMode } },
  });
}

export async function mutedKeywords() {
  const res = await this.v1_1("mutes/keywords/list", {});
  return await res.json();
}

export async function deleteMutedKeyword(keywordId) {
  const res = await this.v1_1("mutes/keywords/destroy", {
    body: JSON.stringify({ ids: keywordId }),
  });
  return await res.json();
}

export async function updateMutedKeyword(params = {}) {
  const res = await this.v1_1("mutes/keywords/update", {
    body: JSON.stringify(params),
  });
  return await res.json();
}

export async function advancedFilters() {
  const res = await this.v1_1("get:mutes/advanced_filters", {});
  return await res.json();
}

export async function updateAdvancedFilters(params = {}) {
  const res = await this.v1_1("post:mutes/advanced_filters", {
    body: JSON.stringify(params),
  });
  return await res.json();
}

export async function helpSettings() {
  const res = await this.v1_1("help/settings", {});
  return await res.json();
}

export async function emailNotificationSettings(params = {}) {
  return await this.graphql("WriteEmailNotificationSettings", {
    body: { variables: { ...params } },
  });
}

export async function viewerEmailSettings() {
  return await this.graphql("ViewerEmailSettings", {
    variables: {},
  });
}

export async function accountLabel() {
  return await this.graphql("UserAccountLabel", {
    variables: {},
  });
}

export async function disableAccountLabel() {
  return await this.graphql("DisableUserAccountLabel", {
    body: { variables: {} },
  });
}
