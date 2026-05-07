/**
 * Shared constants for the demo-grade admin gate.
 *
 * Imported by both `proxy.ts` (cookie check) and `lib/admin-actions.ts`
 * (login/logout server actions) so the password and cookie name live in
 * exactly one place.
 *
 * DEMO ONLY: the password is a hardcoded literal and the cookie value is
 * the password itself. Not suitable for real auth — replace with a random
 * opaque token compared against a server-side allowlist (or a signed
 * value) before shipping anything user-facing.
 */
export const ADMIN_PASSWORD = "letmeinadminagent";
export const ADMIN_COOKIE_NAME = "admin_auth";
