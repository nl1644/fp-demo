import { NextResponse } from "next/server";
import { attemptLogin } from "@/lib/accounts";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, eventId, sealedResult, otp } = body;
    const result = await attemptLogin({ email, password, eventId, sealedResult, otp });

    if (result.success && email) {
      await createSession(email);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }
}
