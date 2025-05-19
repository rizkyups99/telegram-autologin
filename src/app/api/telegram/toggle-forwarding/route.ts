import { NextResponse } from "next/server";
import { db } from "@/db";
import { telegramSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { active } = body;
    
    // Update the forwarding setting in the database
    await db.update(telegramSettings)
      .set({ value: active ? "true" : "false" })
      .where(eq(telegramSettings.key, "forwarding_active"));
    
    return NextResponse.json({ success: true, active });
  } catch (error) {
    console.error("Error toggling forwarding:", error);
    return NextResponse.json(
      { error: "Failed to toggle forwarding" },
      { status: 500 }
    );
  }
}
