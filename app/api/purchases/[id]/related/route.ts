import { NextResponse } from "next/server";
import { getRelatedPurchases } from "@/lib/purchases";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  return NextResponse.json(getRelatedPurchases(numId));
}
