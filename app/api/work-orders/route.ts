import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createWorkOrderSchema } from "@/lib/contracts";
import { canSubmitRequests } from "@/lib/rbac";
import { createWorkOrder, listVisibleWorkOrders } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const workOrders = await listVisibleWorkOrders(sessionUser);
  return NextResponse.json({ workOrders });
}

export async function POST(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!canSubmitRequests(sessionUser.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createWorkOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid work order payload.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const workOrder = await createWorkOrder(parsed.data, sessionUser);
  return NextResponse.json({ workOrder }, { status: 201 });
}
