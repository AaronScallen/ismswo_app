import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { canAssignRequests } from "@/lib/rbac";
import { listTechnicians } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!canAssignRequests(sessionUser.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const technicians = await listTechnicians();
  return NextResponse.json({ technicians });
}
