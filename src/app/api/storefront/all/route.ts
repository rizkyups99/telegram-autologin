import { NextResponse } from "next/server";
import { db } from "@/db";
import { storefrontProducts } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    // Get all products (including inactive ones) for admin view
    const products = await db.select()
      .from(storefrontProducts)
      .orderBy(desc(storefrontProducts.createdAt));
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching all storefront products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
