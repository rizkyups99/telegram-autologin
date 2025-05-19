import { NextResponse } from "next/server";
import { db } from "@/db";
import { userAudioAccess, userPdfAccess, userVideoAccess, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

// Get categories a user has access to
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Get audio category access
    const audioAccess = await db.select({
      categoryId: userAudioAccess.categoryId,
      categoryName: categories.name
    })
    .from(userAudioAccess)
    .leftJoin(categories, eq(userAudioAccess.categoryId, categories.id))
    .where(eq(userAudioAccess.userId, parseInt(userId)));
    
    // Get PDF category access
    const pdfAccess = await db.select({
      categoryId: userPdfAccess.categoryId,
      categoryName: categories.name
    })
    .from(userPdfAccess)
    .leftJoin(categories, eq(userPdfAccess.categoryId, categories.id))
    .where(eq(userPdfAccess.userId, parseInt(userId)));
    
    // Get video category access
    const videoAccess = await db.select({
      categoryId: userVideoAccess.categoryId,
      categoryName: categories.name
    })
    .from(userVideoAccess)
    .leftJoin(categories, eq(userVideoAccess.categoryId, categories.id))
    .where(eq(userVideoAccess.userId, parseInt(userId)));
    
    return NextResponse.json({
      audio: audioAccess,
      pdf: pdfAccess,
      video: videoAccess
    });
    
  } catch (error) {
    console.error("Error fetching user category access:", error);
    return NextResponse.json(
      { error: "Failed to fetch user category access" },
      { status: 500 }
    );
  }
}

// Update user's category access
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, audioCategories, pdfCategories, videoCategories } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Clear existing audio access
    await db.delete(userAudioAccess)
      .where(eq(userAudioAccess.userId, userId));
    
    // Add new audio access
    if (Array.isArray(audioCategories) && audioCategories.length > 0) {
      const audioAccessValues = audioCategories.map(categoryId => ({
        userId,
        categoryId
      }));
      
      await db.insert(userAudioAccess)
        .values(audioAccessValues)
        .onConflictDoNothing();
    }
    
    // Clear existing PDF access
    await db.delete(userPdfAccess)
      .where(eq(userPdfAccess.userId, userId));
    
    // Add new PDF access
    if (Array.isArray(pdfCategories) && pdfCategories.length > 0) {
      const pdfAccessValues = pdfCategories.map(categoryId => ({
        userId,
        categoryId
      }));
      
      await db.insert(userPdfAccess)
        .values(pdfAccessValues)
        .onConflictDoNothing();
    }
    
    // Clear existing video access
    await db.delete(userVideoAccess)
      .where(eq(userVideoAccess.userId, userId));
    
    // Add new video access
    if (Array.isArray(videoCategories) && videoCategories.length > 0) {
      const videoAccessValues = videoCategories.map(categoryId => ({
        userId,
        categoryId
      }));
      
      await db.insert(userVideoAccess)
        .values(videoAccessValues)
        .onConflictDoNothing();
    }
    
    return NextResponse.json({
      success: true,
      message: "User category access updated successfully"
    });
    
  } catch (error) {
    console.error("Error updating user category access:", error);
    return NextResponse.json(
      { error: "Failed to update user category access" },
      { status: 500 }
    );
  }
}
