import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export function GET() {
  const accounts = db
    .prepare("SELECT email FROM accounts ORDER BY email ASC")
    .all() as { email: string }[];
  return NextResponse.json(accounts);
}
