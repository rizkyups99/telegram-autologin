import { NextResponse } from "next/server";
import { db } from "@/db";
import { telegramSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const formatSetting = await db.select()
      .from(telegramSettings)
      .where(eq(telegramSettings.key, "message_format"));
    
    let messageFormat = `
💰 PEMBAYARAN

Waktu: May. 14, 2025, 18:02 WIB
Order ID: 250514SFWZGVO
Payment Method: Virtual Account
Store: IKHTIAR JALUR LANGIT
Business: JALUR LANGIT DIGITAL

Page: CO-AUDIO PENARIK REZEKI
Page Link: https://jalurlangitdigital.myscalev.com/co-aspr
Advertiser: Rizky Yulianto
CS: Admin Satu

Nama: Empun Tiana
Telepon: 6285225705335
Alamat:
Lokasi:`;
    
    if (formatSetting.length > 0 && formatSetting[0].value) {
      messageFormat = formatSetting[0].value;
    }
    
    return NextResponse.json({ format: messageFormat });
  } catch (error) {
    console.error("Error fetching message format:", error);
    return NextResponse.json(
      { error: "Failed to fetch message format" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { format } = body;
    
    if (!format) {
      return NextResponse.json(
        { error: "Message format is required" },
        { status: 400 }
      );
    }
    
    // Update the message format setting in the database
    const formatSetting = await db.select()
      .from(telegramSettings)
      .where(eq(telegramSettings.key, "message_format"));
    
    if (formatSetting.length === 0) {
      // Create the setting if it doesn't exist
      await db.insert(telegramSettings).values({
        key: "message_format",
        value: format
      });
    } else {
      // Update the existing setting
      await db.update(telegramSettings)
        .set({ value: format })
        .where(eq(telegramSettings.key, "message_format"));
    }
    
    return NextResponse.json({ success: true, format });
  } catch (error) {
    console.error("Error updating message format:", error);
    return NextResponse.json(
      { error: "Failed to update message format" },
      { status: 500 }
    );
  }
}
