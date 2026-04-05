/**
 * PostgreSQL client (postgres.js) — singleton for Next.js dev (HMR) and production.
 *
 * Environment variables (set in `.env.local` for local dev, or your host’s secrets in production):
 *
 * - DATABASE_URL — Full connection URI, e.g. `postgresql://user:password@host:5432/dbname`
 *   If set (non-empty), it is used and individual PG_* vars below are ignored for the URL.
 *
 * - PGHOST — Database host (default: localhost) when DATABASE_URL is not used.
 * - PGPORT — Port (default: 5432).
 * - PGUSER — Username (default: postgres).
 * - PGPASSWORD — Password (URL-encoded automatically when building the connection string).
 * - PGDATABASE — Database name (default: postgres).
 * - PGSSLMODE — e.g. `prefer`, `disable`, `require` (default: prefer). Appended to the URI as `sslmode`.
 * - PGCONNECT_TIMEOUT — Seconds to wait when connecting (default: 10).
 *
 * Provide either DATABASE_URL or PGHOST / PGPORT / PGUSER / PGPASSWORD / PGDATABASE (and optional PGSSLMODE / PGCONNECT_TIMEOUT).
 */

import postgres from "postgres";

declare global {
  // Cache client across hot reloads in development (same pattern works in production within one Node process).
  // eslint-disable-next-line no-var -- required for global augmentation
  var __postgresSql: postgres.Sql | undefined;
}

function buildConnectionStringFromEnv(): string {
  const host = process.env.PGHOST ?? "localhost";
  const port = process.env.PGPORT ?? "5432";
  const user = process.env.PGUSER ?? "postgres";
  const password = process.env.PGPASSWORD ?? "";
  const database = process.env.PGDATABASE ?? "postgres";

  const u = encodeURIComponent(user);
  const p = encodeURIComponent(password);
  const sslmode = process.env.PGSSLMODE ?? "prefer";
  const connectTimeout = process.env.PGCONNECT_TIMEOUT ?? "10";
  const base = `postgresql://${u}:${p}@${host}:${port}/${database}`;
  const qs = new URLSearchParams({
    sslmode,
    connect_timeout: connectTimeout,
  });
  return `${base}?${qs.toString()}`;
}

function getConnectionString(): string {
  const fromUrl = process.env.DATABASE_URL?.trim();
  if (fromUrl) return fromUrl;
  return buildConnectionStringFromEnv();
}

function createSql(): postgres.Sql {
  const connectionString = getConnectionString();
  const connectTimeout = Number(process.env.PGCONNECT_TIMEOUT ?? 10);
  return postgres(connectionString, {
    max: process.env.NODE_ENV === "production" ? 10 : 5,
    idle_timeout: 20,
    connect_timeout: connectTimeout,
  });
}

const sql = globalThis.__postgresSql ?? createSql();
globalThis.__postgresSql = sql;

export { sql };
export default sql;
