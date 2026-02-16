import getCycleTLS from "./cycletls.js";
import clients from "./clients.js";

const BASE_URL = "https://api.x.com/1.1/onboarding/task.json";
const GUEST_ACTIVATE_URL = "https://api.x.com/1.1/guest/activate.json";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36";

const SUBTASK_VERSIONS = {
  action_list: 2,
  alert_dialog: 1,
  app_download_cta: 1,
  check_logged_in_account: 2,
  choice_selection: 3,
  contacts_live_sync_permission_prompt: 0,
  cta: 7,
  email_verification: 2,
  end_flow: 1,
  enter_date: 1,
  enter_email: 2,
  enter_password: 5,
  enter_phone: 2,
  enter_recaptcha: 1,
  enter_text: 5,
  generic_urt: 3,
  in_app_notification: 1,
  interest_picker: 3,
  js_instrumentation: 1,
  menu_dialog: 1,
  notifications_permission_prompt: 2,
  open_account: 2,
  open_home_timeline: 1,
  open_link: 1,
  phone_verification: 4,
  privacy_options: 1,
  security_key: 3,
  select_avatar: 4,
  select_banner: 2,
  settings_list: 7,
  show_code: 1,
  sign_up: 2,
  sign_up_review: 4,
  tweet_selection_urt: 1,
  update_users: 1,
  upload_media: 1,
  user_recommendations_list: 4,
  user_recommendations_urt: 1,
  wait_spinner: 3,
  web_modal: 1,
};

const MAX_FLOW_STEPS = 20;

class CookieSession {
  constructor(cycleTLS, proxy) {
    this.cycleTLS = cycleTLS;
    this.cookies = {};
    this.proxy = proxy;
  }

  getCookieString() {
    return Object.entries(this.cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  }

  parseCookies(cookieValue) {
    if (!cookieValue) return;
    const cookies = Array.isArray(cookieValue) ? cookieValue : [cookieValue];
    for (const cookie of cookies) {
      const parts = cookie.split(";")[0].split("=");
      if (parts.length >= 2) {
        this.cookies[parts[0].trim()] = parts.slice(1).join("=").trim();
      }
    }
  }

  async post(url, options = {}) {
    const headers = options.headers || {};
    const cookieString = this.getCookieString();
    if (cookieString) {
      headers["Cookie"] = cookieString;
    }

    const response = await this.cycleTLS(
      url,
      {
        body: options.json ? JSON.stringify(options.json) : options.body,
        ja3: clients.web.fingerprints.ja3,
        ja4r: clients.web.fingerprints.ja4r,
        userAgent: USER_AGENT,
        headers,
        proxy: this.proxy || undefined,
      },
      "post",
    );

    const setCookie = response.headers?.["Set-Cookie"] || response.headers?.["set-cookie"];
    if (setCookie) {
      this.parseCookies(setCookie);
    }

    return response;
  }
}

function getFlowHeaders(guestToken) {
  const headers = {
    Authorization: `Bearer ${clients.tweetdeck.bearer}`,
    "Content-Type": "application/json",
    Accept: "*/*",
    "Accept-Language": "en-US",
    "X-Twitter-Client-Language": "en-US",
    Origin: "https://x.com",
    Referer: "https://x.com/",
  };
  if (guestToken) {
    headers["X-Guest-Token"] = guestToken;
  }
  return headers;
}

async function makeRequest(session, headers, flowToken, subtaskData) {
  const payload = {
    flow_token: flowToken,
    subtask_inputs: Array.isArray(subtaskData) ? subtaskData : [subtaskData],
  };

  const response = await session.post(BASE_URL, { json: payload, headers });

  if (response.status !== 200) {
    const errorBody =
      typeof response.body === "string"
        ? response.body
        : JSON.stringify(response.body || response.data);
    throw new Error(`Flow request failed: ${response.status} - ${errorBody}`);
  }

  const data =
    typeof response.body === "string" ? JSON.parse(response.body) : response.body || response.data;

  const newFlowToken = data.flow_token;
  if (!newFlowToken) {
    throw new Error("Failed to get flow token from response");
  }

  return [newFlowToken, data];
}

async function getGuestToken(session) {
  const response = await session.post(GUEST_ACTIVATE_URL, {
    headers: { Authorization: `Bearer ${clients.tweetdeck.bearer}` },
  });

  if (response.status !== 200) {
    throw new Error("Failed to obtain guest token");
  }

  const data =
    typeof response.body === "string" ? JSON.parse(response.body) : response.body || response.data;

  const guestToken = data.guest_token;
  if (!guestToken) {
    throw new Error("Failed to obtain guest token");
  }

  return guestToken;
}

async function initFlow(session, guestToken) {
  const headers = getFlowHeaders(guestToken);
  const payload = {
    input_flow_data: {
      flow_context: {
        debug_overrides: {},
        start_location: { location: "manual_link" },
      },
      subtask_versions: SUBTASK_VERSIONS,
    },
  };

  const response = await session.post(`${BASE_URL}?flow_name=login`, {
    json: payload,
    headers,
  });

  if (response.status !== 200) {
    throw new Error("Failed to initialize login flow");
  }

  const data =
    typeof response.body === "string" ? JSON.parse(response.body) : response.body || response.data;

  const flowToken = data.flow_token;
  if (!flowToken) {
    throw new Error("Failed to get initial flow token");
  }

  return [flowToken, headers, data];
}

async function submitJsInstrumentation(session, flowToken, headers) {
  return await makeRequest(session, headers, flowToken, {
    subtask_id: "LoginJsInstrumentationSubtask",
    js_instrumentation: {
      response:
        '{"rf":{"a4fc506d24bb4843c48a1966940c2796bf4fb7617a2d515ad3297b7df6b459b6":121,"bff66e16f1d7ea28c04653dc32479cf416a9c8b67c80cb8ad533b2a44fee82a3":-1,"ac4008077a7e6ca03210159dbe2134dea72a616f03832178314bb9931645e4f7":-22,"c3a8a81a9b2706c6fec42c771da65a9597c537b8e4d9b39e8e58de9fe31ff239":-12},"s":"ZHYaDA9iXRxOl2J3AZ9cc23iJx-Fg5E82KIBA_fgeZFugZGYzRtf8Bl3EUeeYgsK30gLFD2jTQx9fAMsnYCw0j8ahEy4Pb5siM5zD6n7YgOeWmFFaXoTwaGY4H0o-jQnZi5yWZRAnFi4lVuCVouNz_xd2BO2sobCO7QuyOsOxQn2CWx7bjD8vPAzT5BS1mICqUWyjZDjLnRZJU6cSQG5YFIHEPBa8Kj-v1JFgkdAfAMIdVvP7C80HWoOqYivQR7IBuOAI4xCeLQEdxlGeT-JYStlP9dcU5St7jI6ExyMeQnRicOcxXLXsan8i5Joautk2M8dAJFByzBaG4wtrPhQ3QAAAZEi-_t7"}',
      link: "next_link",
    },
  });
}

async function submitUsername(session, flowToken, headers, username) {
  const [newFlowToken, data] = await makeRequest(session, headers, flowToken, {
    subtask_id: "LoginEnterUserIdentifierSSO",
    settings_list: {
      setting_responses: [
        {
          key: "user_identifier",
          response_data: { text_data: { result: username } },
        },
      ],
      link: "next_link",
    },
  });

  if (data.subtasks?.[0]?.cta?.primary_text?.text) {
    throw new Error(`Login denied: ${data.subtasks[0].cta.primary_text.text}`);
  }

  return [newFlowToken, data];
}

async function submitPassword(session, flowToken, headers, password) {
  return await makeRequest(session, headers, flowToken, {
    subtask_id: "LoginEnterPassword",
    enter_password: { password, link: "next_link" },
  });
}

async function submitAlternateIdentifier(session, flowToken, headers, text) {
  return await makeRequest(session, headers, flowToken, {
    subtask_id: "LoginEnterAlternateIdentifierSubtask",
    enter_text: { text: text.trim(), link: "next_link" },
  });
}

async function submit2FA(session, flowToken, headers, code) {
  return await makeRequest(session, headers, flowToken, {
    subtask_id: "LoginTwoFactorAuthChallenge",
    enter_text: { text: code.trim(), link: "next_link" },
  });
}

async function submitLoginAcid(session, flowToken, headers, code) {
  return await makeRequest(session, headers, flowToken, {
    subtask_id: "LoginAcid",
    enter_text: { text: code.trim(), link: "next_link" },
  });
}

async function submitAccountDuplicationCheck(session, flowToken, headers) {
  return await makeRequest(session, headers, flowToken, {
    subtask_id: "AccountDuplicationCheck",
    check_logged_in_account: { link: "AccountDuplicationCheck_false" },
  });
}

function getSubtaskIds(data) {
  if (!data?.subtasks) return [];
  return data.subtasks.map((s) => s.subtask_id);
}

function isLoginComplete(data) {
  if (!data?.subtasks) return false;
  for (const subtask of data.subtasks) {
    if (subtask.open_account || subtask.subtask_id === "LoginSuccessSubtask") {
      return true;
    }
  }
  return false;
}

function extractUserId(cookies) {
  const twid = (cookies.twid || "").replace(/"/g, "");
  for (const prefix of ["u=", "u%3D"]) {
    if (twid.includes(prefix)) {
      return twid.split(prefix)[1].split("&")[0].replace(/"/g, "");
    }
  }
  return null;
}

async function resolve(staticValue, onRequest, type) {
  if (staticValue) return staticValue;

  if (onRequest) {
    const value = await onRequest(type);
    if (value != null && value !== "") return value;
  }

  throw new Error(
    `the login flow is asking for "${type}" but no value was provided. either pass it directly or handle it in onRequest.`,
  );
}

export default async function flowLogin(opts) {
  const { username, password, email, phone, onRequest, proxy } = opts;

  if (!username) throw new Error("username is required for flow login");
  if (!password) throw new Error("password is required for flow login");

  const cycleTLS = await getCycleTLS();
  const session = new CookieSession(cycleTLS, proxy);

  const guestToken = await getGuestToken(session);

  let [flowToken, headers, data] = await initFlow(session, guestToken);
  headers["X-Guest-Token"] = guestToken;

  let step = 0;

  while (!isLoginComplete(data) && step < MAX_FLOW_STEPS) {
    step++;
    const subtaskIds = getSubtaskIds(data);

    if (subtaskIds.length === 0) {
      throw new Error("Login flow returned no subtasks and login is not complete");
    }

    const current = subtaskIds[0];

    switch (current) {
      case "LoginJsInstrumentationSubtask":
        [flowToken, data] = await submitJsInstrumentation(session, flowToken, headers);
        break;

      case "LoginEnterUserIdentifierSSO":
        [flowToken, data] = await submitUsername(session, flowToken, headers, username);
        break;

      case "LoginEnterPassword":
        [flowToken, data] = await submitPassword(session, flowToken, headers, password);
        break;

      case "LoginEnterAlternateIdentifierSubtask": {
        const value = await resolve(email || phone, onRequest, "alternate_identifier");
        [flowToken, data] = await submitAlternateIdentifier(session, flowToken, headers, value);
        break;
      }

      case "LoginTwoFactorAuthChallenge": {
        const code = await resolve(null, onRequest, "two_factor_code");
        [flowToken, data] = await submit2FA(session, flowToken, headers, code);
        break;
      }

      case "LoginAcid": {
        const code = await resolve(null, onRequest, "email_code");
        [flowToken, data] = await submitLoginAcid(session, flowToken, headers, code);
        break;
      }

      case "AccountDuplicationCheck":
        [flowToken, data] = await submitAccountDuplicationCheck(session, flowToken, headers);
        break;

      case "LoginSuccessSubtask":
        break;

      case "DenyLoginSubtask":
        throw new Error("Login was denied by Twitter. Your account may be locked or suspended.");

      default:
        throw new Error(
          `Unhandled login subtask: "${current}". All subtasks: [${subtaskIds.join(", ")}]`,
        );
    }
  }

  if (!isLoginComplete(data)) {
    throw new Error(
      `Login flow did not complete after ${MAX_FLOW_STEPS} steps. ` +
        `Last subtasks: [${getSubtaskIds(data).join(", ")}]`,
    );
  }

  const cookies = { ...session.cookies };
  const authToken = cookies.auth_token || null;
  const csrfToken = cookies.ct0 || null;
  const userId = extractUserId(cookies);

  if (!authToken) {
    throw new Error("Login flow completed but no auth_token was found in cookies");
  }

  return { authToken, csrfToken, userId, cookies };
}
