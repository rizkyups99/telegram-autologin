import { NextResponse } from "next/server";
import { db } from "@/db";
import { whatsappSettings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// Ensure WhatsApp settings table exists
async function ensureWhatsappSettingsTable() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "whatsapp_settings" (
        "id" SERIAL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "value" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
  } catch (error) {
    console.error("Error creating whatsapp_settings table:", error);
  }
}

export async function GET() {
  try {
    // Ensure table exists first
    await ensureWhatsappSettingsTable();
    
    const settings = await db.select()
      .from(whatsappSettings)
      .where(eq(whatsappSettings.key, "admin_phone"));
    
    let phoneNumber = "6285716665995"; // Default phone number
    
    if (settings.length > 0 && settings[0].value) {
      phoneNumber = settings[0].value;
    }
    
    return NextResponse.json({ phoneNumber });
  } catch (error) {
    console.error("Error fetching WhatsApp settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch WhatsApp settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Ensure table exists first
    await ensureWhatsappSettingsTable();
    
    const body = await request.json();
    const { phoneNumber } = body;
    
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }
    
    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }
    
    // Update or create the WhatsApp phone setting
    const existingSetting = await db.select()
      .from(whatsappSettings)
      .where(eq(whatsappSettings.key, "admin_phone"));
    
    if (existingSetting.length === 0) {
      // Create the setting if it doesn't exist
      await db.insert(whatsappSettings).values({
        key: "admin_phone",
        value: phoneNumber
      });
    } else {
      // Update the existing setting
      await db.update(whatsappSettings)
        .set({ 
          value: phoneNumber,
          updatedAt: new Date()
        })
        .where(eq(whatsappSettings.key, "admin_phone"));
    }
    
    return NextResponse.json({ success: true, phoneNumber });
  } catch (error) {
    console.error("Error updating WhatsApp settings:", error);
    return NextResponse.json(
      { error: "Failed to update WhatsApp settings" },
      { status: 500 }
    );
  }
}
