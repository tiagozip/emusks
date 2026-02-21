import { ClientTransaction, handleXMigration } from "x-client-transaction-id";
import getCycleTLS from "./cycletls.js";
import graphqlApi from "./static/graphql.js";

const GRAPHQL_ENDPOINTS = {
  main: {
    base: "https://api.x.com/graphql",
    referrer: "https://x.com/",
    secFetchSite: "same-site",
  },
  main_twitter: {
    base: "https://api.twitter.com/graphql",
    referrer: "https://twitter.com/",
    secFetchSite: "same-site",
  },
  web: {
    base: "https://x.com/i/api/graphql",
    referrer: "https://x.com/",
    secFetchSite: "same-origin",
  },
  web_twitter: {
    base: "https://twitter.com/i/api/graphql",
    referrer: "https://twitter.com/",
    secFetchSite: "same-origin",
  },
  tweetdeck: {
    base: "https://pro.x.com/i/api/graphql",
    referrer: "https://pro.x.com/",
    secFetchSite: "same-origin",
  },
  tweetdeck_twitter: {
    base: "https://pro.twitter.com/i/api/graphql",
    referrer: "https://pro.twitter.com/",
    secFetchSite: "same-origin",
  },
};

export { GRAPHQL_ENDPOINTS };

export default async function graphql(queryName, { variables, fieldToggles, body, headers } = {}) {
  const entry = graphqlApi[queryName];
  if (!entry) {
    throw new Error(`graphql query ${queryName} not found`);
  }

  const [method, , features, queryId] = entry;
  const isPost = method.toLowerCase() === "post";

  const endpointName = this.graphqlEndpoint || "web";
  const endpoint = GRAPHQL_ENDPOINTS[endpointName];
  if (!endpoint) {
    throw new Error(
      `unknown graphql endpoint "${endpointName}", expected: ${Object.keys(GRAPHQL_ENDPOINTS).join(", ")}`,
    );
  }

  let finalUrl = `${endpoint.base}/${queryId}/${queryName}`;
  let requestBody;

  if (isPost) {
    requestBody = {
      ...body,
      variables: { ...variables, ...body?.variables },
      queryId,
    };
    if (features) requestBody.features = features;
    if (fieldToggles && Object.keys(fieldToggles).length) {
      requestBody.fieldToggles = fieldToggles;
    }
  } else {
    if (variables && Object.keys(variables).length) {
      const separator = finalUrl.includes("?") ? "&" : "?";
      finalUrl = `${finalUrl}${separator}variables=${encodeURIComponent(JSON.stringify(variables))}`;
    }
    if (features) {
      const separator = finalUrl.includes("?") ? "&" : "?";
      finalUrl = `${finalUrl}${separator}features=${encodeURIComponent(JSON.stringify(features))}`;
    }
    if (fieldToggles && Object.keys(fieldToggles).length) {
      const separator = finalUrl.includes("?") ? "&" : "?";
      finalUrl = `${finalUrl}${separator}fieldToggles=${encodeURIComponent(JSON.stringify(fieldToggles))}`;
    }
  }

  const url = new URL(finalUrl);
  const pathname = url.pathname;

  const useTransactionIds =
    this.transactionIds !== undefined ? this.transactionIds : endpointName === "web";

  const requestHeaders = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    authorization: `Bearer ${this.auth.client.bearer}`,
    "content-type": "application/json",
    "x-csrf-token": this.auth.csrfToken,
    "x-twitter-active-user": "yes",
    "x-twitter-auth-type": "OAuth2Session",
    "x-twitter-client-language": "en",
    priority: "u=1, i",
    "sec-ch-ua": '"Not(A:Brand";v="8", "Chromium";v="144"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": endpoint.secFetchSite,
    "sec-gpc": "1",
    cookie:
      this.auth.client.headers.cookie + (this.elevatedCookies ? `; ${this.elevatedCookies}` : ""),
    ...headers,
  };

  if (useTransactionIds) {
    if (!this.auth.generateTransactionId) {
      const document = await handleXMigration();
      const transaction = new ClientTransaction(document);
      await transaction.initialize();
      this.auth.generateTransactionId = transaction.generateTransactionId.bind(transaction);
    }
    requestHeaders["x-client-transaction-id"] = await this.auth.generateTransactionId(
      method.toUpperCase(),
      pathname,
    );
  }

  const cycleTLS = await getCycleTLS();
  const res = await (
    await cycleTLS(
      finalUrl,
      {
        headers: requestHeaders,
        userAgent: this.auth.client.fingerprints.userAgent,
        ja3: this.auth.client.fingerprints.ja3,
        ja4r: this.auth.client.fingerprints.ja4r,
        body: isPost ? JSON.stringify(requestBody) : undefined,
        proxy: this.proxy || undefined,
        referrer: endpoint.referrer,
      },
      method,
    )
  ).json();

  if (res?.errors?.[0]) {
    throw new Error(res.errors.map((err) => err.message).join(", "));
  }

  return res;
}
