import { NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allAdmins = await db.select().from(admins).orderBy(desc(admins.createdAt));
    
    return NextResponse.json(allAdmins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

// Create a new admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, accessCode } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    // Check if admin with email already exists
    try {
      const existingAdmin = await db.select()
        .from(admins)
        .where(eq(admins.email, email));
      
      if (existingAdmin.length > 0) {
        return NextResponse.json(
          { error: "Admin with this email already exists" },
          { status: 400 }
        );
      }
    } catch (err) {
      console.log("DB query error (may be first run):", err);
      // Continue execution - might be first run with no table yet
    }
    
    // Generate random access code if not provided
    const finalAccessCode = accessCode || Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      // Create the admin in database
      const insertedAdmin = await db.insert(admins)
        .values({
          email,
          accessCode: finalAccessCode,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      return NextResponse.json(insertedAdmin[0]);
    } catch (dbError) {
      console.error("Database insertion error:", dbError);
      
      // Check if this might be a table doesn't exist error
      if (String(dbError).includes("relation") && String(dbError).includes("does not exist")) {
        // Try to create the table directly with SQL
        try {
          const sql = `
          CREATE TABLE IF NOT EXISTS admins (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            access_code TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          );
          `;
          
          await db.execute(sql);
          
          // Try the insert again
          const insertedAdmin = await db.insert(admins)
            .values({
              email,
              accessCode: finalAccessCode,
              createdAt: new Date(),
              updatedAt: new Date()
            })
            .returning();
            
          console.log("Successfully created admin after direct table creation");
          return NextResponse.json(insertedAdmin[0]);
        } catch (directSqlError) {
          console.error("Failed direct SQL table creation:", directSqlError);
          return NextResponse.json(
            { error: "Admin table doesn't exist yet and couldn't be created automatically." },
            { status: 500 }
          );
        }
      }
      
      throw dbError; // Re-throw for general error handling
    }
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// Update an existing admin
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, email, accessCode } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Admin ID is required" },
        { status: 400 }
      );
    }
    
    // Check if admin exists
    const existingAdmin = await db.select()
      .from(admins)
      .where(eq(admins.id, id));
    
    if (existingAdmin.length === 0) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }
    
    // Update admin data
    const updateData: { email?: string; accessCode?: string } = {};
    
    if (email) updateData.email = email;
    if (accessCode) updateData.accessCode = accessCode;
    
    const updatedAdmin = await db.update(admins)
      .set(updateData)
      .where(eq(admins.id, id))
      .returning();
    
    return NextResponse.json(updatedAdmin[0]);
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      { error: "Failed to update admin" },
      { status: 500 }
    );
  }
}

// Delete an admin
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Admin ID is required" },
        { status: 400 }
      );
    }
    
    // Check if admin exists
    const existingAdmin = await db.select()
      .from(admins)
      .where(eq(admins.id, parseInt(id)));
    
    if (existingAdmin.length === 0) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }
    
    // Delete admin
    await db.delete(admins).where(eq(admins.id, parseInt(id)));
    
    return NextResponse.json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      { error: "Failed to delete admin" },
      { status: 500 }
    );
  }
}
