import { NextResponse } from "next/server";
import { db } from "@/db";
import { videos, categories } from "@/db/schema";
import { desc, eq, like, and, sql } from "drizzle-orm";
import { sql as drizzleSql } from "drizzle-orm/sql";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Build the base query for count
    const countQuery = db.select({
      count: drizzleSql`count(${videos.id})`
    }).from(videos);
    
    // Build the base query for results
    const baseQuery = db.select({
      video: videos,
      categoryName: categories.name,
    })
    .from(videos)
    .leftJoin(categories, eq(videos.categoryId, categories.id));
    
    // Add conditions
    let whereConditions = [];
    if (title) {
      whereConditions.push(like(videos.title, `%${title}%`));
    }
    
    if (categoryId) {
      whereConditions.push(eq(videos.categoryId, parseInt(categoryId)));
    }
    
    try {
      // Apply where conditions to count query if needed
      let totalCount;
      if (whereConditions.length > 0) {
        const countResult = await countQuery.where(and(...whereConditions));
        totalCount = Number(countResult[0].count);
      } else {
        const countResult = await countQuery;
        totalCount = Number(countResult[0].count);
      }
      
      // Execute the query with conditions, order, and pagination
      const results = whereConditions.length > 0
        ? await baseQuery
            .where(and(...whereConditions))
            .orderBy(desc(videos.createdAt))
            .limit(limit)
            .offset(offset)
        : await baseQuery
            .orderBy(desc(videos.createdAt))
            .limit(limit)
            .offset(offset);
      
      // Transform results to include category name
      const videoList = results.map(item => ({
        ...item.video,
        categoryName: item.categoryName
      }));
      
      return NextResponse.json({
        videos: videoList,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      });
    } catch (dbError) {
      console.error("Database error fetching videos:", dbError);
      return NextResponse.json(
        { error: "Gagal mengambil data video", details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, videoUrl, categoryId } = body;
    
    if (!title || !videoUrl || !categoryId) {
      return NextResponse.json(
        { error: "Title, video URL, and category ID are required" },
        { status: 400 }
      );
    }
    
    // Validate categoryId exists
    try {
      const categoryExists = await db.select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, parseInt(categoryId)))
        .limit(1);
      
      if (categoryExists.length === 0) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 400 }
        );
      }
    } catch (categoryError) {
      console.error("Error validating category:", categoryError);
      return NextResponse.json(
        { error: "Failed to validate category", details: categoryError instanceof Error ? categoryError.message : String(categoryError) },
        { status: 500 }
      );
    }
    
    try {
      // Check if videos table exists in the database
      try {
        const tableExists = await db.execute(sql`SELECT to_regclass('public.videos')`);
        console.log("Table check result:", tableExists);
        
        // Check if the table exists using the first result
        const result = tableExists[0] as { to_regclass: string | null };
        if (!result?.to_regclass) {
          // If table doesn't exist, try to create it
          try {
            console.log("Videos table not found, attempting to create it");
            await db.execute(sql`
              CREATE TABLE IF NOT EXISTS "videos" (
                "id" SERIAL PRIMARY KEY,
                "title" TEXT NOT NULL,
                "video_url" TEXT NOT NULL,
                "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
                "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
                "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
              );
            `);
            console.log("Videos table created successfully");
          } catch (createError) {
            console.error("Error creating videos table:", createError);
            return NextResponse.json(
              { error: "Videos table does not exist and automatic creation failed. Please run migrations (bun run db:generate)." },
              { status: 500 }
            );
          }
        }
      } catch (tableCheckError) {
        console.error("Error checking if table exists:", tableCheckError);
        // Continue anyway as the error might just be that the table already exists
      }
      
      // Create new video record
      const newVideo = {
        title,
        videoUrl,
        categoryId: parseInt(categoryId),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log("Attempting to insert video with data:", JSON.stringify(newVideo, null, 2));
      
      const insertedVideo = await db.insert(videos).values(newVideo).returning();
      console.log("Successfully inserted video:", insertedVideo[0]);
      
      return NextResponse.json(insertedVideo[0]);
    } catch (insertError) {
      console.error("Database error creating video:", insertError);
      return NextResponse.json(
        { 
          error: "Failed to create video record in database", 
          details: insertError instanceof Error ? insertError.message : String(insertError),
          stack: insertError instanceof Error ? insertError.stack : undefined,
          name: insertError instanceof Error ? insertError.name : 'Unknown Error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, videoUrl, categoryId } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }
    
    // Update video data
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (title !== undefined) updateData.title = title;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    
    const updatedVideo = await db.update(videos)
      .set(updateData)
      .where(eq(videos.id, id))
      .returning();
    
    if (!updatedVideo.length) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedVideo[0]);
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }
    
    // Check if video exists
    const existingVideo = await db.select()
      .from(videos)
      .where(eq(videos.id, parseInt(id)));
    
    if (existingVideo.length === 0) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }
    
    // Delete video
    await db.delete(videos).where(eq(videos.id, parseInt(id)));
    
    return NextResponse.json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
