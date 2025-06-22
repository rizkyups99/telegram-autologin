import { NextResponse } from "next/server";
import { db } from "@/db";
import { 
  users, 
  userAudioAccess, 
  userPdfAccess, 
  userVideoAccess,
  userAudioCloudAccess,
  userPdfCloudAccess,
  userFileCloudAccess
} from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { NewUser } from "@/db/schema";

export async function GET() {
  try {
    // Get users with their category access information using a single query
    const usersWithAccess = await db.execute(sql`
      SELECT 
        u.*,
        COALESCE(
          json_agg(DISTINCT audio_cats.category_id) FILTER (WHERE audio_cats.category_id IS NOT NULL), 
          '[]'
        ) as audio_category_ids,
        COALESCE(
          json_agg(DISTINCT pdf_cats.category_id) FILTER (WHERE pdf_cats.category_id IS NOT NULL), 
          '[]'
        ) as pdf_category_ids,
        COALESCE(
          json_agg(DISTINCT video_cats.category_id) FILTER (WHERE video_cats.category_id IS NOT NULL), 
          '[]'
        ) as video_category_ids,
        COALESCE(
          json_agg(DISTINCT audio_cloud_cats.category_id) FILTER (WHERE audio_cloud_cats.category_id IS NOT NULL), 
          '[]'
        ) as audio_cloud_category_ids,
        COALESCE(
          json_agg(DISTINCT pdf_cloud_cats.category_id) FILTER (WHERE pdf_cloud_cats.category_id IS NOT NULL), 
          '[]'
        ) as pdf_cloud_category_ids,
        COALESCE(
          json_agg(DISTINCT file_cloud_cats.category_id) FILTER (WHERE file_cloud_cats.category_id IS NOT NULL), 
          '[]'
        ) as file_cloud_category_ids
      FROM users u
      LEFT JOIN user_audio_access audio_cats ON u.id = audio_cats.user_id
      LEFT JOIN user_pdf_access pdf_cats ON u.id = pdf_cats.user_id
      LEFT JOIN user_video_access video_cats ON u.id = video_cats.user_id
      LEFT JOIN user_audio_cloud_access audio_cloud_cats ON u.id = audio_cloud_cats.user_id
      LEFT JOIN user_pdf_cloud_access pdf_cloud_cats ON u.id = pdf_cloud_cats.user_id
      LEFT JOIN user_file_cloud_access file_cloud_cats ON u.id = file_cloud_cats.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    
    // Transform the result to include category arrays
    const transformedUsers = (usersWithAccess as any[]).map(user => ({
      ...user,
      audioCategoryIds: user.audio_category_ids || [],
      pdfCategoryIds: user.pdf_category_ids || [],
      videoCategoryIds: user.video_category_ids || [],
      audioCloudCategoryIds: user.audio_cloud_category_ids || [],
      pdfCloudCategoryIds: user.pdf_cloud_category_ids || [],
      fileCloudCategoryIds: user.file_cloud_category_ids || []
    }));
    
    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Update an existing user
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, 
      username, 
      name, 
      accessCode, 
      isActive, 
      audioCategoryIds = [], 
      pdfCategoryIds = [], 
      videoCategoryIds = [],
      audioCloudCategoryIds = [],
      pdfCloudCategoryIds = [],
      fileCloudCategoryIds = []
    } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Update user data
    const updateData: Partial<NewUser> = {
      updatedAt: new Date(),
    };
    
    if (username !== undefined) updateData.username = username;
    if (name !== undefined) updateData.name = name;
    if (accessCode !== undefined) updateData.accessCode = accessCode;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const updatedUser = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    
    // Delete existing category access
    await db.delete(userAudioAccess).where(eq(userAudioAccess.userId, id));
    await db.delete(userPdfAccess).where(eq(userPdfAccess.userId, id));
    await db.delete(userVideoAccess).where(eq(userVideoAccess.userId, id));
    await db.delete(userAudioCloudAccess).where(eq(userAudioCloudAccess.userId, id));
    await db.delete(userPdfCloudAccess).where(eq(userPdfCloudAccess.userId, id));
    await db.delete(userFileCloudAccess).where(eq(userFileCloudAccess.userId, id));
    
    // Create new category access records
    const accessPromises = [];
    
    // Audio access
    if (audioCategoryIds.length > 0) {
      const audioAccessData = audioCategoryIds.map((categoryId: number) => ({
        userId: id,
        categoryId
      }));
      accessPromises.push(db.insert(userAudioAccess).values(audioAccessData));
    }
    
    // PDF access
    if (pdfCategoryIds.length > 0) {
      const pdfAccessData = pdfCategoryIds.map((categoryId: number) => ({
        userId: id,
        categoryId
      }));
      accessPromises.push(db.insert(userPdfAccess).values(pdfAccessData));
    }
    
    // Video access
    if (videoCategoryIds.length > 0) {
      const videoAccessData = videoCategoryIds.map((categoryId: number) => ({
        userId: id,
        categoryId
      }));
      accessPromises.push(db.insert(userVideoAccess).values(videoAccessData));
    }
    
    // Audio Cloud access
    if (audioCloudCategoryIds.length > 0) {
      const audioCloudAccessData = audioCloudCategoryIds.map((categoryId: number) => ({
        userId: id,
        categoryId
      }));
      accessPromises.push(db.insert(userAudioCloudAccess).values(audioCloudAccessData));
    }
    
    // PDF Cloud access
    if (pdfCloudCategoryIds.length > 0) {
      const pdfCloudAccessData = pdfCloudCategoryIds.map((categoryId: number) => ({
        userId: id,
        categoryId
      }));
      accessPromises.push(db.insert(userPdfCloudAccess).values(pdfCloudAccessData));
    }
    
    // File Cloud access
    if (fileCloudCategoryIds.length > 0) {
      const fileCloudAccessData = fileCloudCategoryIds.map((categoryId: number) => ({
        userId: id,
        categoryId
      }));
      accessPromises.push(db.insert(userFileCloudAccess).values(fileCloudAccessData));
    }
    
    // Execute all access insertions
    await Promise.all(accessPromises);
    
    // Return updated user with category access
    const userWithAccess = {
      ...updatedUser[0],
      audioCategoryIds,
      pdfCategoryIds,
      videoCategoryIds,
      audioCloudCategoryIds,
      pdfCloudCategoryIds,
      fileCloudCategoryIds
    };
    
    return NextResponse.json(userWithAccess);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// Delete a user
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(id)));
    
    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const userId = parseInt(id);
    
    // Delete user category access first
    await db.delete(userAudioAccess).where(eq(userAudioAccess.userId, userId));
    await db.delete(userPdfAccess).where(eq(userPdfAccess.userId, userId));
    await db.delete(userVideoAccess).where(eq(userVideoAccess.userId, userId));
    await db.delete(userAudioCloudAccess).where(eq(userAudioCloudAccess.userId, userId));
    await db.delete(userPdfCloudAccess).where(eq(userPdfCloudAccess.userId, userId));
    await db.delete(userFileCloudAccess).where(eq(userFileCloudAccess.userId, userId));
    
    // Delete user
    await db.delete(users).where(eq(users.id, parseInt(id)));
    
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      username, 
      name, 
      accessCode, 
      isActive, 
      audioCategoryIds = [], 
      pdfCategoryIds = [], 
      videoCategoryIds = [],
      audioCloudCategoryIds = [],
      pdfCloudCategoryIds = [],
      fileCloudCategoryIds = []
    } = body;
    
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }
    
    // Check if username already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }
    
    // Create new user data
    const userData: NewUser = {
      username,
      password: username, // Using username as password
      accessCode: accessCode || username, // Use username as access code if not provided
      name: name || null,
      isActive: isActive !== undefined ? isActive : true,
    };
    
    // Create user
    const newUser = await db.insert(users).values(userData).returning();
    const userId = newUser[0].id;
    
    // Create category access records
    const accessPromises = [];
    
    // Audio access
    if (audioCategoryIds.length > 0) {
      const audioAccessData = audioCategoryIds.map((categoryId: number) => ({
        userId,
        categoryId
      }));
      accessPromises.push(db.insert(userAudioAccess).values(audioAccessData));
    }
    
    // PDF access
    if (pdfCategoryIds.length > 0) {
      const pdfAccessData = pdfCategoryIds.map((categoryId: number) => ({
        userId,
        categoryId
      }));
      accessPromises.push(db.insert(userPdfAccess).values(pdfAccessData));
    }
    
    // Video access
    if (videoCategoryIds.length > 0) {
      const videoAccessData = videoCategoryIds.map((categoryId: number) => ({
        userId,
        categoryId
      }));
      accessPromises.push(db.insert(userVideoAccess).values(videoAccessData));
    }
    
    // Audio Cloud access
    if (audioCloudCategoryIds.length > 0) {
      const audioCloudAccessData = audioCloudCategoryIds.map((categoryId: number) => ({
        userId,
        categoryId
      }));
      accessPromises.push(db.insert(userAudioCloudAccess).values(audioCloudAccessData));
    }
    
    // PDF Cloud access
    if (pdfCloudCategoryIds.length > 0) {
      const pdfCloudAccessData = pdfCloudCategoryIds.map((categoryId: number) => ({
        userId,
        categoryId
      }));
      accessPromises.push(db.insert(userPdfCloudAccess).values(pdfCloudAccessData));
    }
    
    // File Cloud access
    if (fileCloudCategoryIds.length > 0) {
      const fileCloudAccessData = fileCloudCategoryIds.map((categoryId: number) => ({
        userId,
        categoryId
      }));
      accessPromises.push(db.insert(userFileCloudAccess).values(fileCloudAccessData));
    }
    
    // Execute all access insertions
    await Promise.all(accessPromises);
    
    // Return user with category access
    const userWithAccess = {
      ...newUser[0],
      audioCategoryIds,
      pdfCategoryIds,
      videoCategoryIds,
      audioCloudCategoryIds,
      pdfCloudCategoryIds,
      fileCloudCategoryIds
    };
    
    return NextResponse.json(userWithAccess);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
