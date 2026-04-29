import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await checkDatabaseHealth();

  if (!health.ok) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: health,
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      status: "ok",
      database: health,
    },
    { status: 200 },
  );
}
