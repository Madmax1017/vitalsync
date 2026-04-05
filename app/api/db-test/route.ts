import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await sql`SELECT NOW() AS now`;
    const row = rows[0] as { now: Date } | undefined;
    const now = row?.now;
    return NextResponse.json({
      ok: true,
      now: now instanceof Date ? now.toISOString() : now,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
