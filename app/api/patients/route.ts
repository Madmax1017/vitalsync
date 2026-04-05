import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");

    let rows;
    if (doctorId !== null && doctorId !== "") {
      const id = Number.parseInt(doctorId, 10);
      if (Number.isNaN(id)) {
        return NextResponse.json(
          { success: false, error: "Invalid doctorId" },
          { status: 400 }
        );
      }
      rows = await sql`
        SELECT id, doctor_id, name, age, condition, room, status, vitals, medications, notes
        FROM patients
        WHERE doctor_id = ${id}
        ORDER BY id ASC
      `;
    } else {
      rows = await sql`
        SELECT id, doctor_id, name, age, condition, room, status, vitals, medications, notes
        FROM patients
        ORDER BY id ASC
      `;
    }

    const data = rows.map((row) => ({
      id: row.id,
      doctor_id: row.doctor_id,
      name: row.name,
      age: row.age,
      condition: row.condition,
      room: row.room,
      status: row.status,
      vitals:
        row.vitals && typeof row.vitals === "object" && !Array.isArray(row.vitals)
          ? row.vitals
          : { heartRate: "—", bp: "—", temp: "—" },
      medications: Array.isArray(row.medications) ? row.medications : [],
      notes: row.notes ?? "",
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
