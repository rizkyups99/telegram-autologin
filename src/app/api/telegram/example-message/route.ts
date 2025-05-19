import { NextResponse } from "next/server";
import { db } from "@/db";
import { telegramSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const exampleSetting = await db.select()
      .from(telegramSettings)
      .where(eq(telegramSettings.key, "example_message"));
    
    let exampleMessage = `
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
    
    if (exampleSetting.length > 0 && exampleSetting[0].value) {
      exampleMessage = exampleSetting[0].value;
    }
    
    return NextResponse.json({ message: exampleMessage });
  } catch (error) {
    console.error("Error fetching example message:", error);
    return NextResponse.json(
      { error: "Failed to fetch example message" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: "Example message is required" },
        { status: 400 }
      );
    }
    
    // Update the example message setting in the database
    const exampleSetting = await db.select()
      .from(telegramSettings)
      .where(eq(telegramSettings.key, "example_message"));
    
    if (exampleSetting.length === 0) {
      // Create the setting if it doesn't exist
      await db.insert(telegramSettings).values({
        key: "example_message",
        value: message
      });
    } else {
      // Update the existing setting
      await db.update(telegramSettings)
        .set({ value: message })
        .where(eq(telegramSettings.key, "example_message"));
    }
    
    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Error updating example message:", error);
    return NextResponse.json(
      { error: "Failed to update example message" },
      { status: 500 }
    );
  }
}
