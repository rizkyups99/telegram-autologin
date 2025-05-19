import { NextResponse } from "next/server";
import { db } from "@/db";
import { audios, categories } from "@/db/schema";
import { desc, eq, like, and, sql } from "drizzle-orm";
import { sql as drizzleSql } from "drizzle-orm/sql";
import { NewAudio } from "@/db/schema";

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
      count: drizzleSql`count(${audios.id})`
    }).from(audios);
    
    // Build the base query for results
    const baseQuery = db.select({
      audio: audios,
      categoryName: categories.name,
    })
    .from(audios)
    .leftJoin(categories, eq(audios.categoryId, categories.id));
    
    // Add conditions
    let whereConditions = [];
    if (title) {
      whereConditions.push(like(audios.title, `%${title}%`));
    }
    
    if (categoryId) {
      whereConditions.push(eq(audios.categoryId, parseInt(categoryId)));
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
      
      // Get sort direction from params, default to desc if not specified
      const sort = searchParams.get('sort') || 'desc';
      const orderDirection = sort === 'asc' ? audios.id : desc(audios.createdAt);
      
      // Execute the query with conditions, order, and pagination
      const results = whereConditions.length > 0
        ? await baseQuery
            .where(and(...whereConditions))
            .orderBy(orderDirection)
            .limit(limit)
            .offset(offset)
        : await baseQuery
            .orderBy(orderDirection)
            .limit(limit)
            .offset(offset);
      
      // Transform results to include category name
      const audioList = results.map(item => ({
        ...item.audio,
        categoryName: item.categoryName
      }));
      
      // Ensure we're returning a consistent format
      const responseData = {
        audios: audioList,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      };
      
      console.log("Audio API response:", {
        count: audioList.length,
        total: totalCount,
        page
      });
      
      return NextResponse.json(responseData);
    } catch (dbError) {
      console.error("Database error fetching audios:", dbError);
      return NextResponse.json(
        { error: "Gagal mengambil data audio", details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching audios:", error);
    return NextResponse.json(
      { error: "Failed to fetch audios" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, fileUrl, categoryId } = body;
    
    if (!title || !fileUrl || !categoryId) {
      return NextResponse.json(
        { error: "Title, file URL, and category ID are required" },
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
      // Create new audio record
      const newAudio: NewAudio = {
        title,
        fileUrl,
        categoryId: parseInt(categoryId),
        updatedAt: new Date(),
      };
      
      console.log("Attempting to insert audio with data:", JSON.stringify(newAudio, null, 2));
      
      // Check if audios table exists in the database
      try {
        const tableExists = await db.execute(sql`SELECT to_regclass('public.audios')`);
        console.log("Table check result:", tableExists);
        
        // Check if the table exists using the first result
        const result = tableExists[0] as { to_regclass: string | null };
        if (!result?.to_regclass) {
          return NextResponse.json(
            { error: "Audios table does not exist in the database. Run migrations first (bun run db:generate)." },
            { status: 500 }
          );
        }
      } catch (tableCheckError) {
        console.error("Error checking if table exists:", tableCheckError);
        // Continue anyway as the error might just be that the table already exists
      }
      
      const insertedAudio = await db.insert(audios).values(newAudio).returning();
      console.log("Successfully inserted audio:", insertedAudio[0]);
      
      return NextResponse.json(insertedAudio[0]);
    } catch (insertError) {
      console.error("Database error creating audio:", insertError);
      return NextResponse.json(
        { 
          error: "Failed to create audio record in database", 
          details: insertError instanceof Error ? insertError.message : String(insertError),
          stack: insertError instanceof Error ? insertError.stack : undefined,
          name: insertError instanceof Error ? insertError.name : 'Unknown Error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating audio:", error);
    return NextResponse.json(
      { error: "Failed to create audio" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, fileUrl, categoryId } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Audio ID is required" },
        { status: 400 }
      );
    }
    
    // Update audio data
    const updateData: Partial<NewAudio> = {
      updatedAt: new Date(),
    };
    
    if (title !== undefined) updateData.title = title;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    
    const updatedAudio = await db.update(audios)
      .set(updateData)
      .where(eq(audios.id, id))
      .returning();
    
    if (!updatedAudio.length) {
      return NextResponse.json(
        { error: "Audio not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedAudio[0]);
  } catch (error) {
    console.error("Error updating audio:", error);
    return NextResponse.json(
      { error: "Failed to update audio" },
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
        { error: "Audio ID is required" },
        { status: 400 }
      );
    }
    
    // Check if audio exists
    const existingAudio = await db.select()
      .from(audios)
      .where(eq(audios.id, parseInt(id)));
    
    if (existingAudio.length === 0) {
      return NextResponse.json(
        { error: "Audio not found" },
        { status: 404 }
      );
    }
    
    // Delete audio
    await db.delete(audios).where(eq(audios.id, parseInt(id)));
    
    return NextResponse.json({ success: true, message: "Audio deleted successfully" });
  } catch (error) {
    console.error("Error deleting audio:", error);
    return NextResponse.json(
      { error: "Failed to delete audio" },
      { status: 500 }
    );
  }
}
