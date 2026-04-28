import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { query } = await request.json();
  if (!query) return NextResponse.json({ error: "No query provided" }, { status: 400 });

  try {
    const stmt = db.prepare(query);
    const isSelect = query.trim().toLowerCase().startsWith("select");
    const result = isSelect ? stmt.all() : stmt.run();
    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
