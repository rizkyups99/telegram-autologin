import { NextResponse } from "next/server";
import { db } from "@/db";
import { pdfCloudFiles, categories } from "@/db/schema";
import { desc, eq, like, and, sql } from "drizzle-orm";
import { sql as drizzleSql } from "drizzle-orm/sql";
import { NewPDFCloudFile } from "@/db/schema";

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
      count: drizzleSql`count(${pdfCloudFiles.id})`
    }).from(pdfCloudFiles);
    
    // Build the base query for results
    const baseQuery = db.select({
      file: pdfCloudFiles,
      categoryName: categories.name,
    })
    .from(pdfCloudFiles)
    .leftJoin(categories, eq(pdfCloudFiles.categoryId, categories.id));
    
    // Add conditions
    let whereConditions = [];
    if (title) {
      whereConditions.push(like(pdfCloudFiles.title, `%${title}%`));
    }
    
    if (categoryId) {
      whereConditions.push(eq(pdfCloudFiles.categoryId, parseInt(categoryId)));
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
      const orderDirection = sort === 'asc' ? pdfCloudFiles.id : desc(pdfCloudFiles.createdAt);
      
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
      console.error("Database error fetching PDF cloud files:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch PDF cloud files", details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching PDF cloud files:", error);
    return NextResponse.json(
      { error: "Failed to fetch PDF cloud files" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, coverUrl, fileUrl, categoryId } = body;
    
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
      // Create new PDF cloud file record
      const newFile: NewPDFCloudFile = {
        title,
        coverUrl,
        fileUrl,
        categoryId: parseInt(categoryId),
        updatedAt: new Date(),
      };
      
      const insertedFile = await db.insert(pdfCloudFiles).values(newFile).returning();
      
      return NextResponse.json(insertedFile[0]);
    } catch (insertError) {
      console.error("Database error creating PDF cloud file:", insertError);
      return NextResponse.json(
        { 
          error: "Failed to create PDF cloud file", 
          details: insertError instanceof Error ? insertError.message : String(insertError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating PDF cloud file:", error);
    return NextResponse.json(
      { error: "Failed to create PDF cloud file" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, coverUrl, fileUrl, categoryId } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }
    
    // Update file data
    const updateData: Partial<NewPDFCloudFile> = {
      updatedAt: new Date(),
    };
    
    if (title !== undefined) updateData.title = title;
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    
    const updatedFile = await db.update(pdfCloudFiles)
      .set(updateData)
      .where(eq(pdfCloudFiles.id, id))
      .returning();
    
    if (!updatedFile.length) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedFile[0]);
  } catch (error) {
    console.error("Error updating PDF cloud file:", error);
    return NextResponse.json(
      { error: "Failed to update PDF cloud file" },
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
      .from(pdfCloudFiles)
      .where(eq(pdfCloudFiles.id, parseInt(id)));
    
    if (existingFile.length === 0) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }
    
    // Delete file
    await db.delete(pdfCloudFiles).where(eq(pdfCloudFiles.id, parseInt(id)));
    
    return NextResponse.json({ success: true, message: "PDF cloud file deleted successfully" });
  } catch (error) {
    console.error("Error deleting PDF cloud file:", error);
    return NextResponse.json(
      { error: "Failed to delete PDF cloud file" },
      { status: 500 }
    );
  }
}
