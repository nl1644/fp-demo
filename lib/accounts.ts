import { db } from "./db";
import { env } from "@/lib/env";
const {
  unsealEventsResponse,
  DecryptionAlgorithm,
} = require("@fingerprint/node-sdk");

export interface LoginResult {
  success: boolean;
  otpRequired?: boolean;
  error?: string;
}

const OTP_CODE = "123";

export async function attemptLogin({
  email,
  password,
  eventId,
  sealedResult,
  otp,
}: {
  email?: string;
  password?: string;
  eventId?: string;
  sealedResult?: string;
  otp?: string;
}): Promise<LoginResult> {
  if (!email || !password) {
    console.error("Missing email or password.");
    return { success: false, error: "Login failed." };
  }
  let visitorId: string | undefined;
  let sealedResultSuccess = false;

  // Try extracting visitorId from sealed result first
  const decryptionKey = env.BASE64_KEY;
  if (sealedResult && decryptionKey) {
    try {
      const unsealedData = await unsealEventsResponse(
        Buffer.from(sealedResult, "base64"),
        [
          {
            key: Buffer.from(decryptionKey, "base64"),
            algorithm: DecryptionAlgorithm.Aes256Gcm,
          },
        ],
      );
      visitorId = unsealedData?.identification?.visitor_id;
      console.log(
        "Decrypted sealed result:\n",
        JSON.stringify(unsealedData, null, 2),
      );
      sealedResultSuccess = true;
    } catch (e) {
      console.error("Failed to unseal result, falling back to Server API:", e);
    }
  }

  // Fall back to Server API only if sealed result didn't succeed
  if (!sealedResultSuccess) {
    console.error("NOT USING SCR.");
    if (eventId && env.fpServerApiKey) {
      try {
        const response = await fetch(
          `https://api.fpjs.io/v4/events/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${env.fpServerApiKey}`,
            },
          },
        );
        if (!response.ok) {
          console.error(
            `Fingerprint API call failed with status: ${response.status} ${response.statusText}`,
          );
        } else {
          const data = await response.json();
          visitorId = data.identification.visitor_id;
        }
      } catch (e) {
        console.error("Error communicating with Fingerprint API:", e);
      }
    } else if (eventId && !env.fpServerApiKey) {
      console.warn(
        "FP_SERVER_API_KEY is missing. Cannot perform server-side Fingerprint event validation.",
      );
    }
  }

  if (visitorId && getRecentFailedAttempts(visitorId) > 2) {
    logFailedAttempt(visitorId, email);
    console.error("Too many failed logins.");
    return { success: false, error: "Login failed" };
  }

  const user = findAccountByEmail(email);
  if (!user || user.password !== password) {
    if (visitorId) logFailedAttempt(visitorId, email);
    console.error("Invalid credentials");
    return { success: false, error: "Login failed." };
  }

  const hasLoginSuccessWEmail = hasSuccessfulLogin(email);
  const hasLoginSuccessWEmailVisitorId = visitorId
    ? hasSuccessfulLoginWithVisitor(email, visitorId)
    : false;

  if (!hasLoginSuccessWEmail || !hasLoginSuccessWEmailVisitorId) {
    if (!otp) return { success: false, otpRequired: true };
    if (otp !== OTP_CODE)
      return { success: false, error: "Invalid verification code." };
  }

  if (visitorId) logSuccessfulAttempt(visitorId, email);
  return { success: true };
}

// --- Helpers ---
function findAccountByEmail(email: string) {
  return db
    .prepare(`SELECT email, password FROM accounts WHERE email = ?`)
    .get(email) as { email: string; password: string } | undefined;
}

function logFailedAttempt(visitorId: string, email: string) {
  db.prepare(
    `INSERT INTO login_attempts (visitorId, email, success, createdAt) VALUES (?, ?, 0, ?)`,
  ).run(visitorId, email, Date.now());
}

function getRecentFailedAttempts(visitorId: string): number {
  const since = Date.now() - 24 * 60 * 60 * 1000;
  const row = db
    .prepare(
      `SELECT COUNT(*) as count
       FROM login_attempts
       WHERE visitorId = ? AND success = 0 AND createdAt >= ?`,
    )
    .get(visitorId, since) as { count: number };
  return row.count;
}

function hasSuccessfulLogin(email: string): boolean {
  return !!db
    .prepare(
      `SELECT 1 from login_attempts WHERE email = ? AND success = 1 LIMIT 1`,
    )
    .get(email);
}

function hasSuccessfulLoginWithVisitor(
  email: string,
  visitorId: string,
): boolean {
  return !!db
    .prepare(
      `SELECT 1 from login_attempts WHERE email = ? AND visitorId = ? AND success = 1 LIMIT 1`,
    )
    .get(email, visitorId);
}

function logSuccessfulAttempt(visitorId: string, email: string) {
  db.prepare(
    `INSERT INTO login_attempts (visitorId, email, success, createdAt) VALUES (?, ?, 1, ?)`,
  ).run(visitorId, email, Date.now());
}
