import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export interface LoginAttempt {
  id: number;
  visitorId: string;
  email: string;
  success: number;
  createdAt: number;
}

export function GET() {
  const attempts = db
    .prepare("SELECT * FROM login_attempts ORDER BY createdAt DESC")
    .all() as LoginAttempt[];
  return NextResponse.json(attempts);
}
