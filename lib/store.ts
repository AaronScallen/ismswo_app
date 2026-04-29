import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import {
  type AppDatabase,
  type AppUser,
  type CreateWorkOrderInput,
  type PublicUser,
  type RegisterInput,
  type UserRole,
  type WorkOrder,
} from "@/lib/contracts";
import { hashPassword } from "@/lib/auth";
import { canViewWorkOrder } from "@/lib/rbac";

const demoPassword = "Password123!";
const databaseUrl = process.env.DATABASE_URL;

let pool: Pool | null = null;
let schemaReadyPromise: Promise<void> | null = null;

function getPool() {
  if (!databaseUrl || databaseUrl.trim().length === 0) {
    throw new Error(
      "DATABASE_URL is not set. Create .env.local with a valid PostgreSQL connection string and restart the dev server.",
    );
  }

  if (!pool) {
    pool = new Pool({ connectionString: databaseUrl });
  }

  return pool;
}

function ensureSchemaReady() {
  if (!schemaReadyPromise) {
    schemaReadyPromise = ensureSchema();
  }

  return schemaReadyPromise;
}

function toPublicUser(user: AppUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password_hash: string;
};

type WorkOrderRow = {
  id: string;
  title: string;
  requested_at: Date | string;
  requester_id: string;
  requester_name: string;
  requester_email: string;
  location: string;
  system: WorkOrder["system"];
  status: WorkOrder["status"];
  assigned_to_user_id: string | null;
  assigned_to_name: string | null;
  priority: WorkOrder["priority"];
  description: string;
};

function fromUserRow(row: UserRow): AppUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    passwordHash: row.password_hash,
  };
}

function fromWorkOrderRow(row: WorkOrderRow): WorkOrder {
  return {
    id: row.id,
    title: row.title,
    requestedAt: new Date(row.requested_at).toISOString(),
    requesterId: row.requester_id,
    requesterName: row.requester_name,
    requesterEmail: row.requester_email,
    location: row.location,
    system: row.system,
    status: row.status,
    assignedToUserId: row.assigned_to_user_id,
    assignedToName: row.assigned_to_name,
    priority: row.priority,
    description: row.description,
  };
}

async function ensureSchema() {
  const db = getPool();

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS work_orders (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      requested_at TIMESTAMPTZ NOT NULL,
      requester_id TEXT NOT NULL REFERENCES users(id),
      requester_name TEXT NOT NULL,
      requester_email TEXT NOT NULL,
      location TEXT NOT NULL,
      system TEXT NOT NULL,
      status TEXT NOT NULL,
      assigned_to_user_id TEXT NULL REFERENCES users(id),
      assigned_to_name TEXT NULL,
      priority TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);
}

async function queryUsers() {
  await ensureSchemaReady();
  const result = await getPool().query<UserRow>(
    `SELECT id, name, email, role, password_hash FROM users`,
  );
  return result.rows.map(fromUserRow);
}

async function queryWorkOrders() {
  await ensureSchemaReady();
  const result = await getPool().query<WorkOrderRow>(
    `
      SELECT
        id,
        title,
        requested_at,
        requester_id,
        requester_name,
        requester_email,
        location,
        system,
        status,
        assigned_to_user_id,
        assigned_to_name,
        priority,
        description
      FROM work_orders
    `,
  );
  return result.rows.map(fromWorkOrderRow);
}

export async function checkDatabaseHealth() {
  const startedAt = Date.now();

  try {
    await ensureSchemaReady();
    await getPool().query("SELECT 1");

    return {
      ok: true,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      ok: false,
      latencyMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
      message:
        error instanceof Error ? error.message : "Unknown database error.",
    };
  }
}

export async function getDemoCredentials() {
  return {
    password: demoPassword,
    users: [
      { role: "manager", email: "manager@isms.local" },
      { role: "sysadmin", email: "sysadmin1@isms.local" },
      { role: "secretary", email: "secretary@isms.local" },
      { role: "technician", email: "marcus.green@isms.local" },
      { role: "requester", email: "requester@demo.local" },
    ],
  };
}

export async function findUserByEmail(email: string) {
  await ensureSchemaReady();

  const result = await getPool().query<UserRow>(
    `
      SELECT id, name, email, role, password_hash
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
    `,
    [email],
  );

  return result.rows[0] ? fromUserRow(result.rows[0]) : null;
}

export async function findUserById(id: string) {
  await ensureSchemaReady();

  const result = await getPool().query<UserRow>(
    `
      SELECT id, name, email, role, password_hash
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] ? fromUserRow(result.rows[0]) : null;
}

export async function createRequester(input: RegisterInput) {
  await ensureSchemaReady();

  const user: AppUser = {
    id: randomUUID(),
    name: input.name,
    email: input.email.toLowerCase(),
    role: "requester",
    passwordHash: await hashPassword(input.password),
  };

  await getPool().query(
    `
      INSERT INTO users (id, name, email, role, password_hash)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [user.id, user.name, user.email, user.role, user.passwordHash],
  );

  return toPublicUser(user);
}

export async function listTechnicians() {
  await ensureSchemaReady();

  const result = await getPool().query<UserRow>(
    `
      SELECT id, name, email, role, password_hash
      FROM users
      WHERE role = 'technician'
      ORDER BY name ASC
    `,
  );

  return result.rows.map(fromUserRow).map(toPublicUser);
}

export async function listUsersByRole(role: UserRole) {
  await ensureSchemaReady();

  const result = await getPool().query<UserRow>(
    `
      SELECT id, name, email, role, password_hash
      FROM users
      WHERE role = $1
      ORDER BY name ASC
    `,
    [role],
  );

  return result.rows.map(fromUserRow).map(toPublicUser);
}

export async function listVisibleWorkOrders(user: PublicUser) {
  const workOrders = await queryWorkOrders();

  return workOrders.filter((workOrder) =>
    canViewWorkOrder(user.role, user.id, workOrder),
  );
}

export async function createWorkOrder(
  input: CreateWorkOrderInput,
  requester: PublicUser,
) {
  await ensureSchemaReady();

  const workOrder: WorkOrder = {
    id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
    title: input.title,
    requestedAt: new Date().toISOString(),
    requesterId: requester.id,
    requesterName: requester.name,
    requesterEmail: requester.email,
    location: input.location,
    system: input.system,
    status: "submitted",
    assignedToUserId: null,
    assignedToName: null,
    priority: input.priority,
    description: input.description,
  };

  await getPool().query(
    `
      INSERT INTO work_orders (
        id,
        title,
        requested_at,
        requester_id,
        requester_name,
        requester_email,
        location,
        system,
        status,
        assigned_to_user_id,
        assigned_to_name,
        priority,
        description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `,
    [
      workOrder.id,
      workOrder.title,
      workOrder.requestedAt,
      workOrder.requesterId,
      workOrder.requesterName,
      workOrder.requesterEmail,
      workOrder.location,
      workOrder.system,
      workOrder.status,
      workOrder.assignedToUserId,
      workOrder.assignedToName,
      workOrder.priority,
      workOrder.description,
    ],
  );

  return workOrder;
}

export async function updateWorkOrder(
  workOrderId: string,
  updater: (workOrder: WorkOrder, database: AppDatabase) => WorkOrder,
) {
  const [users, workOrders] = await Promise.all([
    queryUsers(),
    queryWorkOrders(),
  ]);
  const index = workOrders.findIndex(
    (workOrder) => workOrder.id === workOrderId,
  );

  if (index === -1) {
    return null;
  }

  const databaseSnapshot: AppDatabase = {
    users,
    workOrders,
  };

  const updatedWorkOrder = updater(workOrders[index], databaseSnapshot);

  await getPool().query(
    `
      UPDATE work_orders
      SET
        title = $2,
        requested_at = $3,
        requester_id = $4,
        requester_name = $5,
        requester_email = $6,
        location = $7,
        system = $8,
        status = $9,
        assigned_to_user_id = $10,
        assigned_to_name = $11,
        priority = $12,
        description = $13
      WHERE id = $1
    `,
    [
      updatedWorkOrder.id,
      updatedWorkOrder.title,
      updatedWorkOrder.requestedAt,
      updatedWorkOrder.requesterId,
      updatedWorkOrder.requesterName,
      updatedWorkOrder.requesterEmail,
      updatedWorkOrder.location,
      updatedWorkOrder.system,
      updatedWorkOrder.status,
      updatedWorkOrder.assignedToUserId,
      updatedWorkOrder.assignedToName,
      updatedWorkOrder.priority,
      updatedWorkOrder.description,
    ],
  );

  return updatedWorkOrder;
}

export function getDashboardStats(workOrders: WorkOrder[]) {
  const openStatuses = new Set([
    "submitted",
    "under-review",
    "assigned",
    "in-progress",
  ]);

  return {
    total: workOrders.length,
    open: workOrders.filter((order) => openStatuses.has(order.status)).length,
    awaitingReview: workOrders.filter(
      (order) =>
        order.status === "submitted" || order.status === "under-review",
    ).length,
    highPriority: workOrders.filter((order) => order.priority === "high")
      .length,
    completed: workOrders.filter((order) => order.status === "completed")
      .length,
  };
}

export { toPublicUser };
