import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  technicianStatusSchema,
  workOrderAssignmentSchema,
  workOrderReviewSchema,
} from "@/lib/contracts";
import { canAssignRequests, canReviewRequests } from "@/lib/rbac";
import { findUserById, updateWorkOrder } from "@/lib/store";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);

  if (canAssignRequests(sessionUser.role)) {
    if (body && typeof body === "object" && "assignedToUserId" in body) {
      const parsed = workOrderAssignmentSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "Invalid assignment payload.",
            issues: parsed.error.flatten(),
          },
          { status: 400 },
        );
      }

      const assignedUser = await findUserById(parsed.data.assignedToUserId);

      if (!assignedUser || assignedUser.role !== "technician") {
        return NextResponse.json(
          { error: "Technician not found." },
          { status: 404 },
        );
      }

      const updatedWorkOrder = await updateWorkOrder(id, (workOrder) => ({
        ...workOrder,
        assignedToUserId: assignedUser.id,
        assignedToName: assignedUser.name,
        status: parsed.data.status ?? "assigned",
      }));

      if (!updatedWorkOrder) {
        return NextResponse.json(
          { error: "Work order not found." },
          { status: 404 },
        );
      }

      return NextResponse.json({ workOrder: updatedWorkOrder });
    }

    const parsed = workOrderReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid review payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updatedWorkOrder = await updateWorkOrder(id, (workOrder) => ({
      ...workOrder,
      status: parsed.data.status,
    }));

    if (!updatedWorkOrder) {
      return NextResponse.json(
        { error: "Work order not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ workOrder: updatedWorkOrder });
  }

  if (canReviewRequests(sessionUser.role)) {
    const parsed = workOrderReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid review payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updatedWorkOrder = await updateWorkOrder(id, (workOrder) => ({
      ...workOrder,
      status: parsed.data.status,
    }));

    if (!updatedWorkOrder) {
      return NextResponse.json(
        { error: "Work order not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ workOrder: updatedWorkOrder });
  }

  if (sessionUser.role === "technician") {
    const parsed = technicianStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid technician payload.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const updatedWorkOrder = await updateWorkOrder(id, (workOrder) => {
      if (workOrder.assignedToUserId !== sessionUser.id) {
        return workOrder;
      }

      return {
        ...workOrder,
        status: parsed.data.status,
      };
    });

    if (!updatedWorkOrder) {
      return NextResponse.json(
        { error: "Work order not found." },
        { status: 404 },
      );
    }

    if (updatedWorkOrder.assignedToUserId !== sessionUser.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    return NextResponse.json({ workOrder: updatedWorkOrder });
  }

  return NextResponse.json({ error: "Forbidden." }, { status: 403 });
}
