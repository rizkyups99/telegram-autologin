import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    console.log("Attempting to disable Row Level Security on storage objects table");
    
    try {
      // Disable RLS on the storage.objects table
      await db.execute(sql`ALTER TABLE "storage"."objects" DISABLE ROW LEVEL SECURITY;`);
      
      // Try to also disable RLS on related storage tables
      try {
        await db.execute(sql`ALTER TABLE "storage"."buckets" DISABLE ROW LEVEL SECURITY;`);
      } catch (bucketsError) {
        console.warn("Notice: Could not disable RLS on storage.buckets table:", bucketsError);
        // Continue anyway, since objects is the main table we need
      }
      
      return NextResponse.json({
        success: true,
        message: "Row Level Security has been disabled for storage objects. Uploads should now work."
      });
    } catch (error) {
      console.error("Error disabling RLS:", error);
      
      // If the direct approach failed, provide SQL instructions
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        sqlInstructions: `
-- Run this SQL in your Supabase SQL editor:
ALTER TABLE "storage"."objects" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "storage"."buckets" DISABLE ROW LEVEL SECURITY;
        `
      });
    }
  } catch (error) {
    console.error("Error processing disable RLS request:", error);
    return NextResponse.json(
      { error: "Failed to disable RLS", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
