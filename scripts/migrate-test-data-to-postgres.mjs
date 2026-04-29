import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { Client } from "pg";

const projectRoot = process.cwd();
const dataPath = path.join(projectRoot, "data", "app-db.json");

function parseDotEnv(content) {
  const pairs = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    pairs[key] = value;
  }

  return pairs;
}

async function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const envCandidates = [".env.local", ".env", ".env.example"];

  for (const envName of envCandidates) {
    const envPath = path.join(projectRoot, envName);

    try {
      const content = await readFile(envPath, "utf8");
      const parsed = parseDotEnv(content);

      if (parsed.DATABASE_URL) {
        return parsed.DATABASE_URL;
      }
    } catch {
      // Ignore missing env files and continue.
    }
  }

  throw new Error(
    "DATABASE_URL not found. Set it in the environment or in .env.local/.env/.env.example.",
  );
}

async function run() {
  const databaseUrl = await loadDatabaseUrl();
  const raw = await readFile(dataPath, "utf8");
  const seed = JSON.parse(raw);

  const client = new Client({ connectionString: databaseUrl });

  await client.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL,
        password_hash TEXT NOT NULL
      )
    `);

    await client.query(`
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

    for (const user of seed.users) {
      await client.query(
        `
          INSERT INTO users (id, name, email, role, password_hash)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id)
          DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            role = EXCLUDED.role,
            password_hash = EXCLUDED.password_hash
        `,
        [user.id, user.name, user.email, user.role, user.passwordHash],
      );
    }

    for (const workOrder of seed.workOrders) {
      await client.query(
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
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
          )
          ON CONFLICT (id)
          DO UPDATE SET
            title = EXCLUDED.title,
            requested_at = EXCLUDED.requested_at,
            requester_id = EXCLUDED.requester_id,
            requester_name = EXCLUDED.requester_name,
            requester_email = EXCLUDED.requester_email,
            location = EXCLUDED.location,
            system = EXCLUDED.system,
            status = EXCLUDED.status,
            assigned_to_user_id = EXCLUDED.assigned_to_user_id,
            assigned_to_name = EXCLUDED.assigned_to_name,
            priority = EXCLUDED.priority,
            description = EXCLUDED.description
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
    }

    await client.query("COMMIT");

    console.log(
      `Migration complete. Upserted ${seed.users.length} users and ${seed.workOrders.length} work orders.`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
});
