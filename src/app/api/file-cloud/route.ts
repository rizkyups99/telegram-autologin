import { NextResponse } from "next/server";
import { db } from "@/db";
import { fileCloudFiles, categories } from "@/db/schema";
import { desc, eq, like, and, sql } from "drizzle-orm";
import { sql as drizzleSql } from "drizzle-orm/sql";
import { NewFileCloudFile } from "@/db/schema";

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
      count: drizzleSql`count(${fileCloudFiles.id})`
    }).from(fileCloudFiles);
    
    // Build the base query for results
    const baseQuery = db.select({
      file: fileCloudFiles,
      categoryName: categories.name,
    })
    .from(fileCloudFiles)
    .leftJoin(categories, eq(fileCloudFiles.categoryId, categories.id));
    
    // Add conditions
    let whereConditions = [];
    if (title) {
      whereConditions.push(like(fileCloudFiles.title, `%${title}%`));
    }
    
    if (categoryId) {
      whereConditions.push(eq(fileCloudFiles.categoryId, parseInt(categoryId)));
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
      const orderDirection = sort === 'asc' ? fileCloudFiles.id : desc(fileCloudFiles.createdAt);
      
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
      console.error("Database error fetching file cloud files:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch file cloud files", details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching file cloud files:", error);
    return NextResponse.json(
      { error: "Failed to fetch file cloud files" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, coverUrl, fileUrl, fileType, categoryId } = body;
    
    if (!title || !coverUrl || !fileUrl || !categoryId) {
      return NextResponse.json(
        { error: "Title, cover URL, file URL, and category ID are required" },
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
      // Create new file cloud file record
      const newFile: NewFileCloudFile = {
        title,
        coverUrl,
        fileUrl,
        fileType: fileType || null,
        categoryId: parseInt(categoryId),
        updatedAt: new Date(),
      };
      
      const insertedFile = await db.insert(fileCloudFiles).values(newFile).returning();
      
      return NextResponse.json(insertedFile[0]);
    } catch (insertError) {
      console.error("Database error creating file cloud file:", insertError);
      return NextResponse.json(
        { 
          error: "Failed to create file cloud file", 
          details: insertError instanceof Error ? insertError.message : String(insertError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating file cloud file:", error);
    return NextResponse.json(
      { error: "Failed to create file cloud file" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, coverUrl, fileUrl, fileType, categoryId } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }
    
    // Update file data
    const updateData: Partial<NewFileCloudFile> = {
      updatedAt: new Date(),
    };
    
    if (title !== undefined) updateData.title = title;
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
    if (fileType !== undefined) updateData.fileType = fileType;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    
    const updatedFile = await db.update(fileCloudFiles)
      .set(updateData)
      .where(eq(fileCloudFiles.id, id))
      .returning();
    
    if (!updatedFile.length) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedFile[0]);
  } catch (error) {
    console.error("Error updating file cloud file:", error);
    return NextResponse.json(
      { error: "Failed to update file cloud file" },
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
      .from(fileCloudFiles)
      .where(eq(fileCloudFiles.id, parseInt(id)));
    
    if (existingFile.length === 0) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }
    
    // Delete file
    await db.delete(fileCloudFiles).where(eq(fileCloudFiles.id, parseInt(id)));
    
    return NextResponse.json({ success: true, message: "File cloud file deleted successfully" });
  } catch (error) {
    console.error("Error deleting file cloud file:", error);
    return NextResponse.json(
      { error: "Failed to delete file cloud file" },
      { status: 500 }
    );
  }
}
