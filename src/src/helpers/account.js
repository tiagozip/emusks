import parseUser from "../parsers/user.js";

export default (client) => ({
  async settings() {
    const res = await client.v1_1("get:account/settings", {});
    return await res.json();
  },

  async updateSettings(params = {}) {
    const res = await client.v1_1("post:account/settings", {
      body: JSON.stringify(params),
    });
    return await res.json();
  },

  async verifyPassword(password) {
    const res = await client.v1_1("account/verify_password", {
      body: `password=${encodeURIComponent(password)}`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    return await res.json();
  },

  async changePassword(currentPassword, newPassword) {
    const res = await client.v1_1("account/change_password", {
      body: JSON.stringify({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPassword,
      }),
    });
    return await res.json();
  },

  async deactivate() {
    const res = await client.v1_1("account/deactivate", {});
    return await res.json();
  },

  async logout() {
    const res = await client.v1_1("account/logout", {});
    return await res.json();
  },

  async rateLimitStatus(params = {}) {
    const res = await client.v1_1("application/rate_limit_status", { params });
    return await res.json();
  },

  async viewer() {
    const res = await client.graphql("Viewer", {
      variables: { withCommunitiesMemberships: true },
      fieldToggles: { withAuxiliaryUserLabels: false },
    });
    const user = res?.data?.viewer?.user_results?.result;
    return user ? parseUser(user) : res;
  },

  async sessions() {
    return await client.graphql("UserSessionsList", {
      variables: {},
    });
  },

  async preferences() {
    return await client.graphql("UserPreferences", {
      variables: {},
    });
  },

  async claims() {
    return await client.graphql("GetUserClaims", {
      variables: {},
    });
  },

  async phoneState() {
    return await client.graphql("ProfileUserPhoneState", {
      variables: {},
    });
  },

  async passwordStrength(password) {
    const res = await client.v1_1("account/password_strength", {
      body: JSON.stringify({ password }),
    });
    return await res.json();
  },

  async resendConfirmationEmail() {
    const res = await client.v1_1("account/resend_confirmation_email", {});
    return await res.json();
  },

  async emailPhoneInfo(params = {}) {
    const res = await client.v1_1("users/email_phone_info", { params });
    return await res.json();
  },

  async emailAvailable(email) {
    const res = await client.v1_1("users/email_available", {
      params: { email },
    });
    return await res.json();
  },

  async phoneAvailable(phone) {
    const res = await client.v1_1("users/phone_number_available", {
      params: { phone_number: phone },
    });
    return await res.json();
  },

  async usernameAvailable(username) {
    return await client.graphql("GetUsernameAvailabilityAndSuggestions", {
      body: { variables: { username } },
    });
  },

  async backupCode() {
    const res = await client.v1_1("get:account/backup_code", {});
    return await res.json();
  },

  async generateBackupCode() {
    const res = await client.v1_1("post:account/backup_code", {});
    return await res.json();
  },

  async disable2FA() {
    const res = await client.v1_1("account/login_verification_enrollment", {});
    return await res.json();
  },

  async remove2FAMethod(methodId) {
    const res = await client.v1_1("account/login_verification/remove_method", {
      body: JSON.stringify({ method_id: methodId }),
    });
    return await res.json();
  },

  async tempPassword() {
    const res = await client.v1_1("account/login_verification/temporary_password", {});
    return await res.json();
  },

  async renameSecurityKey(methodId, name) {
    const res = await client.v1_1("account/login_verification/rename_security_key_method", {
      body: JSON.stringify({ method_id: methodId, name }),
    });
    return await res.json();
  },

  async connectedApps() {
    const res = await client.v1_1("oauth/list", {});
    return await res.json();
  },

  async revokeApp(token) {
    const res = await client.v1_1("oauth/revoke", {
      body: JSON.stringify({ token }),
    });
    return await res.json();
  },

  async deleteSSOConnection(connectionId) {
    const res = await client.v1_1("sso/delete_connection", {
      body: JSON.stringify({ connection_id: connectionId }),
    });
    return await res.json();
  },

  async personalizationInterests() {
    const res = await client.v1_1("account/personalization/twitter_interests", {});
    return await res.json();
  },

  async emailYourData() {
    const res = await client.v1_1("account/personalization/email_your_data", {});
    return await res.json();
  },

  async multiList() {
    const res = await client.v1_1("account/multi/list", {});
    return await res.json();
  },

  async enableVerifiedPhoneLabel() {
    return await client.graphql("EnableVerifiedPhoneLabel", {
      body: { variables: {} },
    });
  },

  async disableVerifiedPhoneLabel() {
    return await client.graphql("DisableVerifiedPhoneLabel", {
      body: { variables: {} },
    });
  },

  async dataSaverMode() {
    return await client.graphql("DataSaverMode", {
      variables: {},
    });
  },

  async setDataSaver(dataSaverMode) {
    return await client.graphql("WriteDataSaverPreferences", {
      body: { variables: { dataSaverMode } },
    });
  },

  async mutedKeywords() {
    const res = await client.v1_1("mutes/keywords/list", {});
    return await res.json();
  },

  async deleteMutedKeyword(keywordId) {
    const res = await client.v1_1("mutes/keywords/destroy", {
      body: JSON.stringify({ ids: keywordId }),
    });
    return await res.json();
  },

  async updateMutedKeyword(params = {}) {
    const res = await client.v1_1("mutes/keywords/update", {
      body: JSON.stringify(params),
    });
    return await res.json();
  },

  async advancedFilters() {
    const res = await client.v1_1("get:mutes/advanced_filters", {});
    return await res.json();
  },

  async updateAdvancedFilters(params = {}) {
    const res = await client.v1_1("post:mutes/advanced_filters", {
      body: JSON.stringify(params),
    });
    return await res.json();
  },

  async helpSettings() {
    const res = await client.v1_1("help/settings", {});
    return await res.json();
  },

  async emailNotificationSettings(params = {}) {
    return await client.graphql("WriteEmailNotificationSettings", {
      body: { variables: { ...params } },
    });
  },

  async viewerEmailSettings() {
    return await client.graphql("ViewerEmailSettings", {
      variables: {},
    });
  },

  async accountLabel() {
    return await client.graphql("UserAccountLabel", {
      variables: {},
    });
  },

  async disableAccountLabel() {
    return await client.graphql("DisableUserAccountLabel", {
      body: { variables: {} },
    });
  },
});
