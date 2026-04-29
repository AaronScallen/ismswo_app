import { z } from "zod";

export const userRoleSchema = z.enum([
  "requester",
  "secretary",
  "technician",
  "sysadmin",
  "manager",
]);

export const workOrderSystemSchema = z.enum([
  "access-control",
  "security-cameras",
  "intrusion-detection",
]);

export const workOrderStatusSchema = z.enum([
  "submitted",
  "under-review",
  "assigned",
  "in-progress",
  "completed",
]);

export const workOrderPrioritySchema = z.enum(["low", "normal", "high"]);

export type UserRole = z.infer<typeof userRoleSchema>;
export type WorkOrderSystem = z.infer<typeof workOrderSystemSchema>;
export type WorkOrderStatus = z.infer<typeof workOrderStatusSchema>;
export type WorkOrderPriority = z.infer<typeof workOrderPrioritySchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const createWorkOrderSchema = z.object({
  title: z.string().trim().min(4).max(120),
  location: z.string().trim().min(4).max(160),
  system: workOrderSystemSchema,
  priority: workOrderPrioritySchema.default("normal"),
  description: z.string().trim().min(12).max(1200),
});

export const workOrderAssignmentSchema = z.object({
  assignedToUserId: z.string().trim().min(1),
  status: z.enum(["assigned", "in-progress", "completed"]).optional(),
});

export const workOrderReviewSchema = z.object({
  status: z.enum(["under-review", "assigned", "in-progress", "completed"]),
});

export const technicianStatusSchema = z.object({
  status: z.enum(["in-progress", "completed"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;
export type WorkOrderAssignmentInput = z.infer<
  typeof workOrderAssignmentSchema
>;
export type WorkOrderReviewInput = z.infer<typeof workOrderReviewSchema>;
export type TechnicianStatusInput = z.infer<typeof technicianStatusSchema>;

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AppUser = PublicUser & {
  passwordHash: string;
};

export type WorkOrder = {
  id: string;
  title: string;
  requestedAt: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  location: string;
  system: WorkOrderSystem;
  status: WorkOrderStatus;
  assignedToUserId: string | null;
  assignedToName: string | null;
  priority: WorkOrderPriority;
  description: string;
};

export type AppDatabase = {
  users: AppUser[];
  workOrders: WorkOrder[];
};
