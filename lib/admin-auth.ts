import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * One shop, one owner, one password. Full Supabase auth would be more
 * account than Vince needs. The cookie holds a signed expiry, never the
 * password, so it can't be replayed after it lapses or forged without the
 * secret.
 */

const COOKIE_NAME = "vf_admin";
const SESSION_DAYS = 30;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET is not set.");
  return value;
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
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(attempt, expected);
}

export function createSessionToken() {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function sessionTokenValid(token: string | undefined) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload))) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

export const ADMIN_COOKIE = COOKIE_NAME;
export const ADMIN_SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;
