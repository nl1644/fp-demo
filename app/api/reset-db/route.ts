import { NextResponse } from "next/server";
import { resetDb } from "@/lib/db";

export async function GET() {
  resetDb();
  return NextResponse.json({ success: true });
}
