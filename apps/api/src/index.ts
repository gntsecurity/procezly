import { Hono } from "hono";
import { setCookie, deleteCookie, getCookie } from "hono/cookie";
import { EnvApiSchema } from "@procezly/shared";
import { parseTenantFromHostname, isReservedTenantSlug } from "@procezly/shared";
import { createDb } from "@procezly/db";
import { SignJWT, jwtVerify } from "jose";

type Bindings = {
  ROOT_DOMAIN: string;
  WEB_ORIGIN: string;
  SESSION_COOKIE_NAME: string;
  SESSION_SIGNING_KEY: string;
  AZURE_TENANT_ID: string;
  AZURE_CLIENT_ID: string;
  AZURE_CLIENT_SECRET: string;
  AZURE_REDIRECT_URI: string;
  DATABASE_URL: string;
};

type Session = {
  tenantSlug: string;
  tenantId: string;
  userId: string;
  email: string;
  name: string;
};

function getEnv(c: any) {
  const parsed = EnvApiSchema.safeParse(c.env);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.message };
  }
  return { ok: true as const, env: parsed.data as unknown as Bindings };
}

function originFromRequest(req: Request) {
  const url = new URL(req.url);
  return url.origin;
}

function currentHostname(req: Request) {
  const host = req.headers.get("host") || "";
  return host.split(",")[0].trim();
}

async function signSession(env: Bindings, session: Session) {
  const key = new TextEncoder().encode(env.SESSION_SIGNING_KEY);
  return await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(key);
}

async function verifySession(env: Bindings, token: string) {
  const key = new TextEncoder().encode(env.SESSION_SIGNING_KEY);
  const { payload } = await jwtVerify(token, key);
  return payload as unknown as Session;
}

function azureAuthorizeUrl(env: Bindings, state: string) {
  const authority = `https://login.microsoftonline.com/${encodeURIComponent(env.AZURE_TENANT_ID)}/oauth2/v2.0/authorize`;
  const u = new URL(authority);
  u.searchParams.set("client_id", env.AZURE_CLIENT_ID);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("redirect_uri", env.AZURE_REDIRECT_URI);
  u.searchParams.set("response_mode", "query");
  u.searchParams.set("scope", "openid profile email");
  u.searchParams.set("state", state);
  return u.toString();
}

async function azureTokenExchange(env: Bindings, code: string) {
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(env.AZURE_TENANT_ID)}/oauth2/v2.0/token`;
  const body = new URLSearchParams();
  body.set("client_id", env.AZURE_CLIENT_ID);
  body.set("client_secret", env.AZURE_CLIENT_SECRET);
  body.set("grant_type", "authorization_code");
  body.set("redirect_uri", env.AZURE_REDIRECT_URI);
  body.set("code", code);
  body.set("scope", "openid profile email");
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t);
  }
  return await res.json() as any;
}

function base64UrlDecode(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const s = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(s), c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function decodeJwtPayload(idToken: string) {
  const parts = idToken.split(".");
  if (parts.length < 2) throw new Error("invalid token");
  return JSON.parse(base64UrlDecode(parts[1]));
}

const app = new Hono<{ Bindings: Bindings }>();

app.use(async (c, next) => {
  const envResult = getEnv(c);
  if (!envResult.ok) return c.json({ error: "invalid_env", detail: envResult.error }, 500);
  await next();
});

app.get("/health", (c) => c.json({ ok: true }));

app.get("/tenancy/resolve", (c) => {
  const envResult = getEnv(c);
  if (!envResult.ok) return c.json({ error: "invalid_env" }, 500);
  const host = currentHostname(c.req.raw);
  const ctx = parseTenantFromHostname(host, envResult.env.ROOT_DOMAIN);
  if (!ctx) return c.json({ type: "root", rootDomain: envResult.env.ROOT_DOMAIN });
  if (isReservedTenantSlug(ctx.slug)) return c.json({ type: "reserved", slug: ctx.slug }, 400);
  return c.json({ type: "tenant", slug: ctx.slug, hostname: ctx.hostname });
});

app.get("/auth/login", async (c) => {
  const envResult = getEnv(c);
  if (!envResult.ok) return c.json({ error: "invalid_env" }, 500);
  const host = currentHostname(c.req.raw);
  const t = parseTenantFromHostname(host, envResult.env.ROOT_DOMAIN);
  if (!t) return c.redirect(envResult.env.WEB_ORIGIN + "/");
  if (isReservedTenantSlug(t.slug)) return c.text("Invalid tenant", 400);
  const state = crypto.randomUUID();
  setCookie(c, "procezly_state", JSON.stringify({ state, tenantSlug: t.slug, host }), {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/"
  });
  return c.redirect(azureAuthorizeUrl(envResult.env, state));
});

app.get("/auth/callback", async (c) => {
  const envResult = getEnv(c);
  if (!envResult.ok) return c.json({ error: "invalid_env" }, 500);

  const code = c.req.query("code");
  const state = c.req.query("state");
  if (!code || !state) return c.text("Missing code/state", 400);

  const stateCookie = getCookie(c, "procezly_state");
  if (!stateCookie) return c.text("Missing state cookie", 400);

  let parsed: any;
  try {
    parsed = JSON.parse(stateCookie);
  } catch {
    return c.text("Invalid state cookie", 400);
  }
  if (parsed.state !== state) return c.text("State mismatch", 400);

  const host = parsed.host as string;
  const tenantSlug = parsed.tenantSlug as string;

  const db = createDb(envResult.env.DATABASE_URL);

  const tokenSet = await azureTokenExchange(envResult.env, code);
  const idToken = tokenSet.id_token as string;
  const claims = decodeJwtPayload(idToken);

  const azureSub = String(claims.sub || "");
  const email = String(claims.preferred_username || claims.email || "");
  const name = String(claims.name || email || "User");

  const tenantRows = await db`select id, status from tenants where slug = ${tenantSlug} limit 1`;
  if (tenantRows.length === 0) {
    await db`insert into tenants (slug, display_name, status) values (${tenantSlug}, ${tenantSlug}, 'pending')`;
  }
  const tenant = (await db`select id, status from tenants where slug = ${tenantSlug} limit 1`)[0];

  if (tenant.status !== "active") {
    await db`insert into audit_log (tenant_id, action, entity_type, entity_id, new_value) values (${tenant.id}, 'login_blocked_tenant_not_active', 'tenant', ${tenant.id}, ${db.json({ tenantSlug, email })})`;
    return c.text("Tenant not active", 403);
  }

  const userRows = await db`select id from users where tenant_id = ${tenant.id} and azure_sub = ${azureSub} limit 1`;
  let userId: string;
  if (userRows.length === 0) {
    const inserted = await db`insert into users (tenant_id, azure_sub, email, display_name) values (${tenant.id}, ${azureSub}, ${email}, ${name}) returning id`;
    userId = inserted[0].id;
    await db`insert into audit_log (tenant_id, actor_user_id, action, entity_type, entity_id, new_value) values (${tenant.id}, ${userId}, 'user_created', 'user', ${userId}, ${db.json({ email, name })})`;
  } else {
    userId = userRows[0].id;
  }

  const sessionToken = await signSession(envResult.env, {
    tenantSlug,
    tenantId: tenant.id,
    userId,
    email,
    name
  });

  setCookie(c, envResult.env.SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/"
  });

  deleteCookie(c, "procezly_state", { path: "/" });

  const dest = `https://${host}/app`;
  return c.redirect(dest);
});

app.post("/auth/logout", async (c) => {
  const envResult = getEnv(c);
  if (!envResult.ok) return c.json({ error: "invalid_env" }, 500);
  deleteCookie(c, envResult.env.SESSION_COOKIE_NAME, { path: "/" });
  return c.json({ ok: true });
});

app.get("/v1/me", async (c) => {
  const envResult = getEnv(c);
  if (!envResult.ok) return c.json({ error: "invalid_env" }, 500);

  const token = getCookie(c, envResult.env.SESSION_COOKIE_NAME);
  if (!token) return c.json({ authenticated: false });

  try {
    const session = await verifySession(envResult.env, token);
    return c.json({ authenticated: true, session });
  } catch {
    return c.json({ authenticated: false });
  }
});

export default app;
