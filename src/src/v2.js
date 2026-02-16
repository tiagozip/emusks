import getCycleTLS from "./cycletls.js";
import v2Api from "./static/v2.js";

export default async function v2(queryName, { params, body, headers } = {}) {
  let entry = v2Api[queryName];
  if (!entry) {
    throw new Error(`v2 endpoint ${queryName} not found`);
  }

  const [method, baseUrl] = entry;

  let finalUrl = baseUrl;

  if (params && Object.keys(params).length) {
    const searchParams = new URLSearchParams(params);
    const separator = baseUrl.includes("?") ? "&" : "?";
    finalUrl = `${baseUrl}${separator}${searchParams.toString()}`;
  }

  const url = new URL(finalUrl);
  const pathname = url.pathname;

  const requestHeaders = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    authorization: `Bearer ${this.auth.client.bearer}`,
    "content-type": "application/json",
    "x-csrf-token": this.auth.csrfToken,
    "x-twitter-active-user": "yes",
    "x-twitter-auth-type": "OAuth2Session",
    "x-twitter-client-language": "en",
    "x-client-transaction-id": await this.auth.generateTransactionId(
      method.toUpperCase(),
      pathname,
    ),
    priority: "u=1, i",
    "sec-ch-ua": '"Not(A:Brand";v="8", "Chromium";v="144"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    cookie:
      this.auth.client.headers.cookie + (this.elevatedCookies ? `; ${this.elevatedCookies}` : ""),
    ...headers,
  };

  const cycleTLS = await getCycleTLS();

  return await cycleTLS(
    finalUrl,
    {
      headers: requestHeaders,
      userAgent: this.auth.client.fingerprints.userAgent,
      ja3: this.auth.client.fingerprints.ja3,
      ja4r: this.auth.client.fingerprints.ja4r,
      body: body || undefined,
      proxy: this.proxy || undefined,
      referrer: "https://x.com/",
    },
    method,
  );
}
