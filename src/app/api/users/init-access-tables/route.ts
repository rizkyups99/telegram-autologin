import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    // Read initialization SQL
    const sqlFilePath = path.join(process.cwd(), 'src/db/init-access-tables.sql');
    let sqlContent: string;
    
    try {
      sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    } catch (error) {
      console.error('Error reading SQL file:', error);
      return NextResponse.json(
        { error: "Failed to read initialization SQL file" },
        { status: 500 }
      );
    }

    // Execute SQL statements
    try {
      await db.execute(sql.raw(sqlContent));
      
      return NextResponse.json({
        success: true,
        message: "User access tables initialized successfully",
      });
    } catch (dbError) {
      console.error('Database error during table initialization:', dbError);
      return NextResponse.json(
        { 
          error: "Failed to initialize tables", 
          details: dbError instanceof Error ? dbError.message : String(dbError)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error initializing access tables:', error);
    return NextResponse.json(
      { error: "Failed to initialize user access tables" },
      { status: 500 }
    );
  }
}
