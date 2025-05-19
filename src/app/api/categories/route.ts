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
    const { name, description } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }
    
    // Create new category
    const newCategory: NewCategory = {
      name,
      description: description || null,
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

// Update an existing category
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }
    
    // Check if category exists
    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, id));
    
    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    // Update category data
    const updateData: Partial<NewCategory> = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    
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

// Delete a category
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }
    
    // Check if category exists
    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, parseInt(id)));
    
    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    // Delete category
    await db.delete(categories).where(eq(categories.id, parseInt(id)));
    
    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
