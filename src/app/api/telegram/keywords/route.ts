import { NextResponse } from "next/server";
import { db } from "@/db";
import { telegramSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const keywordsSetting = await db.select()
      .from(telegramSettings)
      .where(eq(telegramSettings.key, "forwarding_keywords"));
    
    let keywords = ["pembayaran"]; // Default keyword
    
    if (keywordsSetting.length > 0 && keywordsSetting[0].value) {
      try {
        keywords = JSON.parse(keywordsSetting[0].value);
      } catch (e) {
        console.error("Error parsing keywords:", e);
      }
    }
    
    return NextResponse.json(keywords);
  } catch (error) {
    console.error("Error fetching keywords:", error);
    return NextResponse.json(
      { error: "Failed to fetch keywords" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keywords } = body;
    
    if (!Array.isArray(keywords)) {
      return NextResponse.json(
        { error: "Keywords must be an array" },
        { status: 400 }
      );
    }
    
    // Update the keywords setting in the database
    const keywordsSetting = await db.select()
      .from(telegramSettings)
      .where(eq(telegramSettings.key, "forwarding_keywords"));
    
    if (keywordsSetting.length === 0) {
      // Create the setting if it doesn't exist
      await db.insert(telegramSettings).values({
        key: "forwarding_keywords",
        value: JSON.stringify(keywords)
      });
    } else {
      // Update the existing setting
      await db.update(telegramSettings)
        .set({ value: JSON.stringify(keywords) })
        .where(eq(telegramSettings.key, "forwarding_keywords"));
    }
    
    return NextResponse.json({ success: true, keywords });
  } catch (error) {
    console.error("Error updating keywords:", error);
    return NextResponse.json(
      { error: "Failed to update keywords" },
      { status: 500 }
    );
  }
}
