import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * One shop, one owner, one password. A real auth provider would be more
 * account than Vince needs, and this site has no database to put one in. The cookie holds a signed expiry, never the
 * password, so it can't be replayed after it lapses or forged without the
 * secret.
 */

const COOKIE_NAME = "vf_admin";
const SESSION_DAYS = 30;

/**
 * Blank counts as unset, the same as missing. A host that imports variable
 * names from .env.example supplies empty strings for all of them.
 */
function secret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function passwordMatches(attempt: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  // No password or no signing secret configured means no way in, rather
  // than a 500 on a page the footer links to from every page of the site.
  if (!expected || !secret()) return false;
  return safeEqual(attempt, expected);
}

export function createSessionToken() {
  if (!secret()) throw new Error("ADMIN_SESSION_SECRET is not set.");
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function sessionTokenValid(token: string | undefined) {
  if (!token || !secret()) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload))) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

export const ADMIN_COOKIE = COOKIE_NAME;
export const ADMIN_SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;
