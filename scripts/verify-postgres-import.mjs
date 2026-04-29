import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { Client } from "pg";

const projectRoot = process.cwd();

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
    const value = line.slice(separator + 1).trim();

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

  throw new Error("DATABASE_URL not found.");
}

async function run() {
  const databaseUrl = await loadDatabaseUrl();
  const client = new Client({ connectionString: databaseUrl });

  await client.connect();

  try {
    const users = await client.query(
      "SELECT COUNT(*)::int AS count FROM users",
    );
    const workOrders = await client.query(
      "SELECT COUNT(*)::int AS count FROM work_orders",
    );

    console.log(
      JSON.stringify({
        users: users.rows[0].count,
        work_orders: workOrders.rows[0].count,
      }),
    );
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
