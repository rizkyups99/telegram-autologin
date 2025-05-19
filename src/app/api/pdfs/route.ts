import { NextResponse } from "next/server";
import { db } from "@/db";
import { pdfs, categories } from "@/db/schema";
import { desc, eq, like, and, sql } from "drizzle-orm";
import { NewPDF } from "@/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const categoryId = searchParams.get('categoryId');
    
    // Build the base query
    const baseQuery = db.select({
      pdf: pdfs,
      categoryName: categories.name,
    })
    .from(pdfs)
    .leftJoin(categories, eq(pdfs.categoryId, categories.id));
    
    // Add conditions
    let whereConditions = [];
    if (title) {
      whereConditions.push(like(pdfs.title, `%${title}%`));
    }
    
    if (categoryId) {
      whereConditions.push(eq(pdfs.categoryId, parseInt(categoryId)));
    }
    
    // Get sort direction from params, default to desc if not specified
    const sort = searchParams.get('sort') || 'desc';
    const orderDirection = sort === 'asc' ? pdfs.id : desc(pdfs.createdAt);
    
    try {
      // Execute the query with conditions and order by
      const results = whereConditions.length > 0
        ? await baseQuery.where(and(...whereConditions)).orderBy(orderDirection)
        : await baseQuery.orderBy(orderDirection);
      
      // Transform results to include category name
      const pdfList = results.map(item => ({
        ...item.pdf,
        categoryName: item.categoryName
      }));
      
      return NextResponse.json(pdfList);
    } catch (dbError) {
      console.error("Database error fetching PDFs:", dbError);
      return NextResponse.json(
        { error: "Gagal mengambil data PDF", details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    return NextResponse.json(
      { error: "Failed to fetch PDFs" },
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
      // Create new PDF
      const newPDF: NewPDF = {
        title,
        coverUrl,
        fileUrl,
        categoryId: parseInt(categoryId),
        updatedAt: new Date(),
      };
      
      console.log("Attempting to insert PDF with data:", JSON.stringify(newPDF, null, 2));
      
      // Check if pdfs table exists in the database
      try {
        const tableExists = await db.execute(sql`SELECT to_regclass('public.pdfs')`);
        console.log("Table check result:", tableExists);
        
        // Check if the table exists using the first result
        const result = tableExists[0] as { to_regclass: string | null };
        if (!result?.to_regclass) {
          return NextResponse.json(
            { error: "PDFs table does not exist in the database. Run migrations first (bun run db:generate)." },
            { status: 500 }
          );
        }
      } catch (tableCheckError) {
        console.error("Error checking if table exists:", tableCheckError);
        // Continue anyway as the error might just be that the table already exists
      }
      
      const insertedPDF = await db.insert(pdfs).values(newPDF).returning();
      console.log("Successfully inserted PDF:", insertedPDF[0]);
      
      return NextResponse.json(insertedPDF[0]);
    } catch (insertError) {
      console.error("Database error creating PDF:", insertError);
      return NextResponse.json(
        { 
          error: "Failed to create PDF record in database", 
          details: insertError instanceof Error ? insertError.message : String(insertError),
          stack: insertError instanceof Error ? insertError.stack : undefined,
          name: insertError instanceof Error ? insertError.name : 'Unknown Error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating PDF:", error);
    return NextResponse.json(
      { error: "Failed to create PDF" },
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
        { error: "PDF ID is required" },
        { status: 400 }
      );
    }
    
    // Update PDF data
    const updateData: Partial<NewPDF> = {
      updatedAt: new Date(),
    };
    
    if (title !== undefined) updateData.title = title;
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    
    const updatedPDF = await db.update(pdfs)
      .set(updateData)
      .where(eq(pdfs.id, id))
      .returning();
    
    if (!updatedPDF.length) {
      return NextResponse.json(
        { error: "PDF not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPDF[0]);
  } catch (error) {
    console.error("Error updating PDF:", error);
    return NextResponse.json(
      { error: "Failed to update PDF" },
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
        { error: "PDF ID is required" },
        { status: 400 }
      );
    }
    
    // Check if PDF exists
    const existingPDF = await db.select()
      .from(pdfs)
      .where(eq(pdfs.id, parseInt(id)));
    
    if (existingPDF.length === 0) {
      return NextResponse.json(
        { error: "PDF not found" },
        { status: 404 }
      );
    }
    
    // Delete PDF
    await db.delete(pdfs).where(eq(pdfs.id, parseInt(id)));
    
    return NextResponse.json({ success: true, message: "PDF deleted successfully" });
  } catch (error) {
    console.error("Error deleting PDF:", error);
    return NextResponse.json(
      { error: "Failed to delete PDF" },
      { status: 500 }
    );
  }
}
