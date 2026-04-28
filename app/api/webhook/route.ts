import { NextResponse } from "next/server";
import { insertFpEvent } from "@/lib/fpEvents";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Webhook received:\n", JSON.stringify(body, null, 2));

    const timestamp = new Date(body.timestamp).toLocaleString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });

    insertFpEvent({
      timestamp,
      event_id:        body.requestId ?? body.event_id ?? null,
      visitor_id:      body.visitorId ?? body.visitor_id ?? null,
      confidence_score: body.confidence?.score
                        ?? body.products?.identification?.data?.confidence?.score
                        ?? null,
      ip_address:      body.ip ?? null,
      // paths below are uncertain — verify against first real webhook payload
      suspect_score:   body.products?.suspectScore?.data?.result ?? null,
      vpn:             body.products?.vpn?.data?.result ? 1 : 0,
      developer_tool:  body.products?.developerTools?.data?.result ? 1 : 0,
      country_name:    body.products?.ipInfo?.data?.v4?.geolocation?.country?.name
                       ?? body.products?.ipInfo?.data?.v6?.geolocation?.country?.name
                       ?? null,
      incognito:       body.products?.incognito?.data?.result ? 1 : 0,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
