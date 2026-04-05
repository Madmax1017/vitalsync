import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const result = await sql`SELECT NOW()`;
  return NextResponse.json(result);
}
