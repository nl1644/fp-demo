import { NextResponse } from "next/server";
import { tours } from "@/lib/tours";

export async function GET() {
  return NextResponse.json(tours);
}
