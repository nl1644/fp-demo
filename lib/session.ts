import { cookies } from "next/headers";
import { db } from "./db";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "sessionId";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface Session {
  id: string;
  email: string;
  expiresAt: number;
}

export async function createSession(email: string) {
  const sessionId = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_DURATION;

  db.prepare(
    "INSERT INTO sessions (id, email, expiresAt) VALUES (?, ?, ?)"
  ).run(sessionId, email, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return sessionId;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) return null;

  const session = db
    .prepare("SELECT id, email, expiresAt FROM sessions WHERE id = ?")
    .get(sessionId) as Session | undefined;

  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    await deleteSession();
    return null;
  }

  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
