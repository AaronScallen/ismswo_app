import { NextResponse } from "next/server";
import { getSessionCookieOptions, signSession } from "@/lib/auth";
import { registerSchema } from "@/lib/contracts";
import { createRequester, findUserByEmail } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid registration payload.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const existingUser = await findUserByEmail(parsed.data.email);

  if (existingUser) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 },
    );
  }

  const user = await createRequester(parsed.data);
  const response = NextResponse.json({ user }, { status: 201 });
  response.cookies.set(
    "isms_session",
    signSession(user),
    getSessionCookieOptions(),
  );

  return response;
}
