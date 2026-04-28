import { NextResponse } from "next/server";
import { getAllPurchases } from "@/lib/purchases";

export async function GET() {
  return NextResponse.json(getAllPurchases());
}
