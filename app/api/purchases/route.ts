import { NextResponse } from "next/server";
import { createPurchase, getPurchasesByEmail } from "@/lib/purchases";
import { getSession } from "@/lib/session";
import { env } from "@/lib/env";
import { tours } from "@/lib/tours";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  return NextResponse.json(getPurchasesByEmail(email));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { tourId, quantity, eventId } = body;

  if (!tourId || !quantity) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const tour = tours.find((t) => t.id === tourId);
  if (!tour) return NextResponse.json({ error: "Tour not found" }, { status: 404 });

  let visitorId: string | undefined;
  if (eventId && env.fpServerApiKey) {
    try {
      const res = await fetch(`https://api.fpjs.io/v4/events/${eventId}`, {
        headers: { Authorization: `Bearer ${env.fpServerApiKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        visitorId = data.identification?.visitor_id;
      }
    } catch (e) {
      console.error("Fingerprint API error:", e);
    }
  }

  const purchase = createPurchase({
    tourId: tour.id,
    tourName: tour.name,
    quantity,
    price: tour.price * quantity,
    email: session.email,
    visitorId,
  });

  return NextResponse.json({ success: true, purchase });
}
