import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NewCategory } from "@/db/schema";

export async function GET() {
  try {
    const allCategories = await db.select().from(categories).orderBy(desc(categories.createdAt));
    
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// Create a new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, filter } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Validate filter
    const validFilters = ['audio', 'pdf', 'video', 'audio_cloud', 'pdf_cloud', 'file_cloud'];
    if (filter && !validFilters.includes(filter)) {
      return NextResponse.json(
        { error: "Invalid filter type" },
        { status: 400 }
      );
    }
    
    // Create new category
    const newCategory: NewCategory = {
      name,
      description: description || null,
      filter: filter || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const insertedCategory = await db.insert(categories).values(newCategory).returning();
    
    return NextResponse.json(insertedCategory[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, filter } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Category ID diperlukan" },
        { status: 400 }
      );
    }
    
    if (!name) {
      return NextResponse.json(
        { error: "Nama kategori diperlukan" },
        { status: 400 }
      );
    }
    
    // Check if category exists
    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, id));
    
    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }
    
    // Check if another category with the same name exists (excluding current one)
    const duplicateCategory = await db.select()
      .from(categories)
      .where(eq(categories.name, name));
    
    if (duplicateCategory.length > 0 && duplicateCategory[0].id !== id) {
      return NextResponse.json(
        { error: "Kategori dengan nama ini sudah ada" },
        { status: 400 }
      );
    }
    
    const updateData: Partial<NewCategory> = {
      name,
      description: description || null,
      filter: filter || null,
      updatedAt: new Date()
    };
    
    const updatedCategory = await db.update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    
    return NextResponse.json(updatedCategory[0]);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
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
        { error: "Category ID diperlukan" },
        { status: 400 }
      );
    }
    
    // Check if category exists
    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, parseInt(id)));
    
    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }
    
    // Delete category
    await db.delete(categories).where(eq(categories.id, parseInt(id)));
    
    return NextResponse.json({ success: true, message: "Kategori berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
