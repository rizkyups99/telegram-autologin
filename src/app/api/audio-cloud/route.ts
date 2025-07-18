import { NextResponse } from "next/server";
import { db } from "@/db";
import { audioCloudFiles, categories } from "@/db/schema";
import { desc, eq, like, and, sql } from "drizzle-orm";
import { sql as drizzleSql } from "drizzle-orm/sql";
import { NewAudioCloudFile } from "@/db/schema";

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
      count: drizzleSql`count(${audioCloudFiles.id})`
    }).from(audioCloudFiles);
    
    // Build the base query for results
    const baseQuery = db.select({
      file: audioCloudFiles,
      categoryName: categories.name,
    })
    .from(audioCloudFiles)
    .leftJoin(categories, eq(audioCloudFiles.categoryId, categories.id));
    
    // Add conditions
    let whereConditions = [];
    if (title) {
      whereConditions.push(like(audioCloudFiles.title, `%${title}%`));
    }
    
    if (categoryId) {
      whereConditions.push(eq(audioCloudFiles.categoryId, parseInt(categoryId)));
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
      const orderDirection = sort === 'asc' ? audioCloudFiles.id : desc(audioCloudFiles.createdAt);
      
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
      const fileList = results.map(item => ({
        ...item.file,
        categoryName: item.categoryName
      }));
      
      // Ensure we're returning a consistent format
      const responseData = {
        files: fileList,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      };
      
      return NextResponse.json(responseData);
    } catch (dbError) {
      console.error("Database error fetching audio cloud files:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch audio cloud files", details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching audio cloud files:", error);
    return NextResponse.json(
      { error: "Failed to fetch audio cloud files" },
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
      // Create new audio cloud file record
      const newFile: NewAudioCloudFile = {
        title,
        fileUrl,
        categoryId: parseInt(categoryId),
      };
      
      // Check if audioCloudFiles table exists in the database
      try {
        const tableExists = await db.execute(sql`SELECT to_regclass('public.audio_cloud_files')`);
        console.log("Table check result:", tableExists);
        
        // Check if the table exists using the first result
        const result = tableExists[0] as { to_regclass: string | null };
        if (!result?.to_regclass) {
          // If table doesn't exist, try to create it
          try {
            console.log("Audio cloud files table not found, attempting to create it");
            await db.execute(sql`
              CREATE TABLE IF NOT EXISTS "audio_cloud_files" (
                "id" SERIAL PRIMARY KEY,
                "title" TEXT NOT NULL,
                "file_url" TEXT NOT NULL,
                "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
                "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
                "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
              );
            `);
            console.log("Audio cloud files table created successfully");
          } catch (createError) {
            console.error("Error creating audio_cloud_files table:", createError);
            return NextResponse.json(
              { error: "Audio cloud files table does not exist and automatic creation failed. Please run migrations." },
              { status: 500 }
            );
          }
        }
      } catch (tableCheckError) {
        console.error("Error checking if table exists:", tableCheckError);
        // Continue anyway as the error might just be that the table already exists
      }
      
      const insertedFile = await db.insert(audioCloudFiles).values(newFile).returning();
      
      return NextResponse.json(insertedFile[0]);
    } catch (insertError) {
      console.error("Database error creating audio cloud file:", insertError);
      return NextResponse.json(
        { 
          error: "Failed to create audio cloud file", 
          details: insertError instanceof Error ? insertError.message : String(insertError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating audio cloud file:", error);
    return NextResponse.json(
      { error: "Failed to create audio cloud file" },
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
        { error: "File ID is required" },
        { status: 400 }
      );
    }
    
    // Update file data
    const updateData: Partial<NewAudioCloudFile> = {
      updatedAt: new Date(),
    };
    
    if (title !== undefined) updateData.title = title;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    
    const updatedFile = await db.update(audioCloudFiles)
      .set(updateData)
      .where(eq(audioCloudFiles.id, id))
      .returning();
    
    if (!updatedFile.length) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedFile[0]);
  } catch (error) {
    console.error("Error updating audio cloud file:", error);
    return NextResponse.json(
      { error: "Failed to update audio cloud file" },
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
        { error: "File ID is required" },
        { status: 400 }
      );
    }
    
    // Check if file exists
    const existingFile = await db.select()
      .from(audioCloudFiles)
      .where(eq(audioCloudFiles.id, parseInt(id)));
    
    if (existingFile.length === 0) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }
    
    // Delete file
    await db.delete(audioCloudFiles).where(eq(audioCloudFiles.id, parseInt(id)));
    
    return NextResponse.json({ success: true, message: "Audio cloud file deleted successfully" });
  } catch (error) {
    console.error("Error deleting audio cloud file:", error);
    return NextResponse.json(
      { error: "Failed to delete audio cloud file" },
      { status: 500 }
    );
  }
}
