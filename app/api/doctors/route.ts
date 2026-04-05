import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, full_name, email, specialization, created_at
      FROM doctors
      ORDER BY id ASC
    `;

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
