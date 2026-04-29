import type { UserRole, WorkOrder } from "@/lib/contracts";

export const managementRoles: UserRole[] = ["manager", "sysadmin"];
export const reviewRoles: UserRole[] = ["manager", "sysadmin", "secretary"];

export function canReviewRequests(role: UserRole) {
  return reviewRoles.includes(role);
}

export function canAssignRequests(role: UserRole) {
  return managementRoles.includes(role);
}

export function canSubmitRequests(role: UserRole) {
  return role === "requester" || canReviewRequests(role);
}

export function canViewWorkOrder(
  role: UserRole,
  userId: string,
  workOrder: WorkOrder,
) {
  if (role === "requester") {
    return workOrder.requesterId === userId;
  }

  if (role === "technician") {
    return workOrder.assignedToUserId === userId;
  }

  return true;
}
