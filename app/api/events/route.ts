import { NextResponse } from "next/server";
import { getAllFpEvents } from "@/lib/fpEvents";

export async function GET() {
  return NextResponse.json(getAllFpEvents());
}
