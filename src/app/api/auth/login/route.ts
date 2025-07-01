import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, accessCode } = body;
    
    if (!username || !accessCode) {
      return NextResponse.json(
        { error: "Username dan kode akses diperlukan" },
        { status: 400 }
      );
    }
    
    // Find user with matching username and access code
    const user = await db.select()
      .from(users)
      .where(
        and(
          eq(users.username, username),
          eq(users.accessCode, accessCode)
        )
      )
      .limit(1);
    
    if (user.length === 0) {
      return NextResponse.json(
        { error: "Username atau kode akses tidak valid" },
        { status: 401 }
      );
    }
    
    // Check if user is active
    if (!user[0].isActive) {
      return NextResponse.json(
        { error: "Akun tidak aktif" },
        { status: 403 }
      );
    }
    
    // Return user data (including createdAt for expiry calculation)
    const userData = {
      id: user[0].id,
      username: user[0].username,
      name: user[0].name,
      createdAt: user[0].createdAt,
    };
    
    return NextResponse.json({
      success: true,
      user: userData
    });
    
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  }
}
