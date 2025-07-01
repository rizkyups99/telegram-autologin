import { NextResponse } from "next/server";
import { db } from "@/db";
import { storefrontProducts } from "@/db/schema";
import { NewStorefrontProduct } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const products = await db.select()
      .from(storefrontProducts)
      .where(eq(storefrontProducts.isActive, true))
      .orderBy(desc(storefrontProducts.createdAt));
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching storefront products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received POST body:", JSON.stringify(body, null, 2));
    
    const { name, description, price, imageUrl, sourceType, sourceCategoryIds, paymentMethods, isActive } = body;
    
    // Validate required fields with specific error messages
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!price || price.toString().trim() === '') {
      return NextResponse.json(
        { error: "Product price is required" },
        { status: 400 }
      );
    }

    if (!imageUrl?.trim()) {
      return NextResponse.json(
        { error: "Product image URL is required" },
        { status: 400 }
      );
    }

    if (!sourceType) {
      return NextResponse.json(
        { error: "Source type is required" },
        { status: 400 }
      );
    }

    if (sourceCategoryIds === undefined || sourceCategoryIds === null) {
      return NextResponse.json(
        { error: "Source categories field is required" },
        { status: 400 }
      );
    }

    // Validate sourceCategoryIds is an array
    let categoryIds;
    try {
      if (typeof sourceCategoryIds === 'string') {
        categoryIds = JSON.parse(sourceCategoryIds);
      } else {
        categoryIds = sourceCategoryIds;
      }
      
      if (!Array.isArray(categoryIds)) {
        return NextResponse.json(
          { error: "Source categories must be an array" },
          { status: 400 }
        );
      }

      if (categoryIds.length === 0) {
        return NextResponse.json(
          { error: "At least one source category must be selected" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error parsing sourceCategoryIds:", error);
      return NextResponse.json(
        { error: "Invalid source categories format - must be a valid JSON array" },
        { status: 400 }
      );
    }

    // Validate price is a number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number" },
        { status: 400 }
      );
    }

    // Validate paymentMethods if provided
    let paymentMethodsArray;
    if (paymentMethods) {
      try {
        if (typeof paymentMethods === 'string') {
          paymentMethodsArray = JSON.parse(paymentMethods);
        } else {
          paymentMethodsArray = paymentMethods;
        }
        
        if (!Array.isArray(paymentMethodsArray)) {
          return NextResponse.json(
            { error: "Payment methods must be an array" },
            { status: 400 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid payment methods format" },
          { status: 400 }
        );
      }
    }
    
    const productData: NewStorefrontProduct = {
      name: name.trim(),
      description: description?.trim() || null,
      price: priceNum.toString(),
      imageUrl: imageUrl.trim(),
      sourceType,
      sourceCategoryIds: JSON.stringify(categoryIds),
      paymentMethods: paymentMethodsArray ? JSON.stringify(paymentMethodsArray) : JSON.stringify(['transfer', 'virtual_account']),
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date(),
    };

    console.log("Creating product with data:", JSON.stringify(productData, null, 2));
    
    const newProduct = await db.insert(storefrontProducts)
      .values(productData)
      .returning();
    
    return NextResponse.json(newProduct[0]);
  } catch (error) {
    console.error("Error creating storefront product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, price, imageUrl, sourceType, sourceCategoryIds, paymentMethods, isActive } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    
    const updateData: Partial<NewStorefrontProduct> = {
      updatedAt: new Date(),
    };
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (sourceType !== undefined) updateData.sourceType = sourceType;
    if (sourceCategoryIds !== undefined) updateData.sourceCategoryIds = JSON.stringify(sourceCategoryIds);
    if (paymentMethods !== undefined) updateData.paymentMethods = JSON.stringify(paymentMethods);
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const updatedProduct = await db.update(storefrontProducts)
      .set(updateData)
      .where(eq(storefrontProducts.id, id))
      .returning();
    
    if (!updatedProduct.length) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error("Error updating storefront product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
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
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    
    await db.delete(storefrontProducts)
      .where(eq(storefrontProducts.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting storefront product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
