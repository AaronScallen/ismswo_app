import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { PublicUser, UserRole } from "@/lib/contracts";

const sessionDurationSeconds = 60 * 60 * 24;
export const sessionCookieName = "isms_session";

export type SessionUser = PublicUser;

type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
};

function getSessionSecret() {
  return process.env.JWT_SECRET ?? "isms-dev-secret-change-me";
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionDurationSeconds,
  };
}

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export function signSession(user: SessionUser) {
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return jwt.sign(payload, getSessionSecret(), {
    expiresIn: sessionDurationSeconds,
  });
}

export function verifySession(token: string): SessionUser | null {
  try {
    const payload = jwt.verify(token, getSessionSecret()) as SessionPayload;

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}
