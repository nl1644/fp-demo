import { NextResponse } from "next/server";
import { insertFpEvent } from "@/lib/fpEvents";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // console.log("Webhook received:\n", JSON.stringify(body, null, 2));

    const timestamp = new Date(body.timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const toBit = (v: unknown) => (v == null ? null : v ? 1 : 0);

    insertFpEvent({
      timestamp,
      event_id: body.requestId ?? body.event_id ?? null,
      visitor_id: body.identification.visitor_id ?? null,
      confidence_score: body.identification.confidence.score ?? null,
      ip_address: body.ip_address ?? null,
      suspect_score: body.suspect_score ?? null,
      vpn: toBit(body.vpn),
      developer_tool: toBit(body.developer_tools),
      incognito: toBit(body.incognito),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 },
    );
  }
}
