import { NextResponse } from "next/server";
import {
  getSessionCookieOptions,
  signSession,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/contracts";
import { findUserByEmail, toPublicUser } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid login payload.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const user = await findUserByEmail(parsed.data.email);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const passwordMatches = await verifyPassword(
    parsed.data.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const sessionUser = toPublicUser(user);
  const response = NextResponse.json({ user: sessionUser });
  response.cookies.set(
    "isms_session",
    signSession(sessionUser),
    getSessionCookieOptions(),
  );

  return response;
}
