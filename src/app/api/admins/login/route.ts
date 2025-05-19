import { NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, accessCode } = body;
    
    if (!email || !accessCode) {
      return NextResponse.json(
        { error: "Email dan kode akses diperlukan" },
        { status: 400 }
      );
    }
    
    // Handle superadmin special case
    if (email === "superadmin@admin.com" && accessCode === "8567899393") {
      return NextResponse.json({
        success: true,
        admin: {
          id: 0,  // Special ID for superadmin
          email: email
        }
      });
    }
    
    try {
      // Find admin with matching email and access code
      const admin = await db.select()
        .from(admins)
        .where(
          and(
            eq(admins.email, email),
            eq(admins.accessCode, accessCode)
          )
        )
        .limit(1);
      
      if (admin.length === 0) {
        return NextResponse.json(
          { error: "Email atau kode akses tidak valid" },
          { status: 401 }
        );
      }
      
      // Return admin data (excluding sensitive information)
      const adminData = {
        id: admin[0].id,
        email: admin[0].email,
      };
      
      return NextResponse.json({
        success: true,
        admin: adminData
      });
    } catch (dbError) {
      console.error("Database error during admin login:", dbError);
      
      // If this is the superadmin login attempt, allow it even if DB fails
      if (email === "superadmin@admin.com" && accessCode === "8567899393") {
        return NextResponse.json({
          success: true,
          admin: {
            id: 0,  // Special ID for superadmin
            email: email
          }
        });
      }
      
      // If table doesn't exist yet, it's a first run situation
      return NextResponse.json(
        { error: "Database error. Please make sure migrations have been run." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  }
}
