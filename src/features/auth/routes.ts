import { FastifyReply, FastifyRequest } from "fastify";
import type { RouteConfig } from "../../router";
import { v4 } from "uuid";
import cache from "../../cache";

const AUTHORIZE_URL = `${process.env.API_HOST}/oauth/authorize`;
const TOKEN_URL = `${process.env.API_HOST}/oauth/token`;

const API_PARAMS = {
  client_id: process.env.API_CLIENT!,
  scope: process.env.API_SCOPE!,
  state: process.env.API_CSRF!,
  response_type: "code",
  redirect_uri: `http://${process.env.HOST}:${process.env.PORT}/auth/callback`,
};

async function authorizeRequest(
  req: FastifyRequest<{
    Querystring: {
      email: string;
    };
  }>,
  res: FastifyReply,
) {
  req.log.info(req);

  if (!req.query.email) {
    return res.code(400).send("Email is Required");
  }

  const req_uid = v4();
  const redirect_url = new URL(AUTHORIZE_URL);

  redirect_url.searchParams.append("client_id", API_PARAMS.client_id);
  redirect_url.searchParams.append("scope", API_PARAMS.scope);
  redirect_url.searchParams.append("state", req_uid);
  redirect_url.searchParams.append("response_type", API_PARAMS.response_type);
  redirect_url.searchParams.append("redirect_uri", API_PARAMS.redirect_uri);

  req.log.warn(redirect_url.href);
  //set empty
  cache.set(req_uid, req.query.email);
  return res.send({
    redirect: redirect_url.href,
    req: req_uid,
    email: req.query.email,
  });
}

async function exchangeToken(
  req: FastifyRequest<{
    Querystring: {
      state: string;
      code: string;
    };
  }>,
  res: FastifyReply,
) {
  req.log.info(req);

  const code = req.query.code;
  const state = req.query.state;

  if (!code || !state) {
    return res.code(400).send("Wrong call params ");
  }

  const email = cache.get<string>(state);
  if (!email) {
    return res.code(500).send("Couldn't get email ");
  }

  const url = new URL(TOKEN_URL);

  const body = new URLSearchParams();
  body.append("scope", API_PARAMS.scope);
  body.append("redirect_uri", API_PARAMS.redirect_uri);
  body.append("code", code);
  body.append("grant_type", "authorization_code");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${API_PARAMS.client_id}:${process.env.API_SECRET}`, "utf-8").toString("base64")}`,
    },
    body,
  });
  const data = (await response.json()) as { access_token: string };
  req.log.info(data);

  cache.set<{ access_token: string }>(`${email}_${state}`, {
    access_token: data.access_token,
  });

  return res.send(
    "Successfully authorized! You can close this window and return to the terminal.",
  );
}

async function getToken(
  req: FastifyRequest<{
    Querystring: {
      req: string;
      email: string;
    };
  }>,
  res: FastifyReply,
) {
  if (!req.query.email || !req.query.req) {
    return res.code(400).send("Missing query params");
  }

  const key = `${req.query.email}_${req.query.req}`;
  const access_token = cache.get<{ access_token: string }>(key);
  return res.send(access_token);
}

export const authRoutes: RouteConfig[] = [
  {
    method: "GET",
    url: "/auth/authorize",
    handler: authorizeRequest,
  },
  {
    method: "GET",
    url: "/auth/callback",
    handler: exchangeToken,
  },
  {
    method: "GET",
    url: "/auth/token",
    handler: getToken,
  },
];
