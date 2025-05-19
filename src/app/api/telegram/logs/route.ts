import { NextResponse } from "next/server";
import { db } from "@/db";
import { telegramLogs } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const logs = await db.select().from(telegramLogs).orderBy(desc(telegramLogs.timestamp)).limit(100);
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching telegram logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
