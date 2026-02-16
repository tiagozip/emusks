import { ClientTransaction, handleXMigration } from "x-client-transaction-id";
import clients from "./clients.js";
import getCycleTLS from "./cycletls.js";
import flowLogin from "./flow.js";
import graphql from "./graphql.js";
import initHelpers from "./helpers/index.js";
import parseUser from "./parsers/user.js";
import v1_1 from "./v1.1.js";
import v2 from "./v2.js";

export default class Emusks {
  auth = null;
  elevatedCookies = null;

  async elevate(password) {
    if (!this.auth) throw new Error("must be logged in before calling elevate");

    const res = await this.v1_1("account/verify_password", {
      body: `password=${encodeURIComponent(password)}`,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });

    const setCookies = res.headers["Set-Cookie"] || [];

    const json = await res.json();
    if (json.status !== "ok") {
      throw new Error("invalid password");
    }

    const cookieParts = [];
    for (const setCookie of setCookies) {
      const cookiePair = setCookie.split(";")[0];
      if (cookiePair) {
        cookieParts.push(cookiePair);
      }
    }

    this.elevatedCookies = cookieParts.join("; ");

    return json;
  }

  async login(p) {
    if (typeof p === "string") {
      if (p.length > 50 || p.length < 20) {
        throw new Error("invalid auth token length!");
      }
      p = { auth_token: p };
    }

    if (p.type === "password") {
      if (!p.username) throw new Error("username is required for password login");
      if (!p.password) throw new Error("password is required for password login");

      const flowResult = await flowLogin({
        username: p.username,
        password: p.password,
        email: p.email,
        phone: p.phone,
        onRequest: p.onRequest,
        proxy: p.proxy,
      });

      p = {
        auth_token: flowResult.authToken,
        client: p.client,
        proxy: p.proxy,
      };
    }

    if (!p.client) p.client = "web";
    if (!p.auth_token) throw new Error("auth_token is required!");
    if (typeof p.client === "string") p.client = clients[p.client];
    if (!p.client) throw new Error("invalid client!");
    if (p.proxy) this.proxy = p.proxy;
    
    if (!p.client.bearer) {
      throw new Error("client is missing bearer token!");
    }
    if (!p.client.userAgent || !p.client.fingerprints) {
      p.client.userAgent =
        p.client.userAgent ||
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36";
      
      p.client.fingerprints = p.client.fingerprints || {
        ja3: "771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,35-5-27-16-0-10-13-23-45-65037-17613-18-65281-51-43-11,4588-29-23-24,0",
        ja4r: "t13d1516h2_002f,0035,009c,009d,1301,1302,1303,c013,c014,c02b,c02c,c02f,c030,cca8,cca9_0005,000a,000b,000d,0012,0017,001b,0023,002b,002d,0033,44cd,fe0d,ff01_0403,0804,0401,0503,0805,0501,0806,0601",
      };
    }

    p.client.headers = {
      "accept-language": "en-US,en;q=0.9",
      priority: "u=1, i",
      "sec-ch-ua": '"Not(A:Brand";v="8", "Chromium";v="144"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "sec-gpc": "1",
    };

    const cycleTLS = await getCycleTLS();
    const res = await cycleTLS("https://x.com/", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        cookie: `auth_token=${p.auth_token};`,
        ...p.client.headers,
      },
      userAgent: p.client.fingerprints.userAgent,
      ja3: p.client.fingerprints.ja3,
      ja4r: p.client.fingerprints.ja4r,
      proxy: p.proxy || undefined,
      referrer: "https://x.com/",
    });

    const setCookies = res.headers["Set-Cookie"] || [];
    const csrfToken = setCookies
      .find((c) => c?.startsWith?.("ct0="))
      ?.split?.(";")?.[0]
      ?.split?.("=")?.[1];

    if (!csrfToken) {
      throw new Error("[emusks] failed to log in");
    }

    this.auth = p;
    this.auth.csrfToken = csrfToken;

    const cookieParts = [`auth_token=${p.auth_token}`];
    for (const setCookie of setCookies) {
      const cookiePair = setCookie.split(";")[0];
      if (cookiePair && !cookiePair.startsWith("auth_token=")) {
        cookieParts.push(cookiePair);
      }
    }
    this.auth.client.headers.cookie = cookieParts.join("; ");

    const document = await handleXMigration();
    const transaction = new ClientTransaction(document);
    await transaction.initialize();
    this.auth.generateTransactionId = transaction.generateTransactionId.bind(transaction);

    const responseText = await res.text();
    const initialStateMatch = responseText.match(/window\.__INITIAL_STATE__\s*=\s*({.*?});/s);

    if (!initialStateMatch) {
      console.warn("[emusks] failed to extract initial state from response");
      return;
    }

    const initialState = JSON.parse(initialStateMatch[1]);
    const usersEntities = initialState?.entities?.users?.entities;
    const initialStateUser = usersEntities && Object.values(usersEntities)[0];

    if (!initialStateUser) {
      console.warn("[emusks] failed to extract user from initial state");
      return;
    }

    this.user = parseUser(initialStateUser);
    this.settings = initialState?.settings?.remote?.settings;

    return this.user;
  }
}

Emusks.prototype.graphql = graphql;
Emusks.prototype.v1_1 = v1_1;
Emusks.prototype.v2 = v2;
initHelpers(Emusks.prototype);
