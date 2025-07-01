import { NextResponse } from "next/server";
import { db } from "@/db";
import { cartItems, storefrontProducts } from "@/db/schema";
import { NewCartItem } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }
    
    const items = await db.select({
      cartItem: cartItems,
      product: storefrontProducts,
    })
    .from(cartItems)
    .leftJoin(storefrontProducts, eq(cartItems.productId, storefrontProducts.id))
    .where(eq(cartItems.sessionId, sessionId));
    
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, productId, quantity = 1 } = body;
    
    if (!sessionId || !productId) {
      return NextResponse.json(
        { error: "Session ID and Product ID are required" },
        { status: 400 }
      );
    }
    
    // Check if item already exists in cart
    const existingItem = await db.select()
      .from(cartItems)
      .where(and(
        eq(cartItems.sessionId, sessionId),
        eq(cartItems.productId, productId)
      ));
    
    if (existingItem.length > 0) {
      // Update quantity
      const updatedItem = await db.update(cartItems)
        .set({ quantity: existingItem[0].quantity + quantity })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();
      
      return NextResponse.json(updatedItem[0]);
    } else {
      // Add new item
      const cartData: NewCartItem = {
        sessionId,
        productId,
        quantity,
      };
      
      const newItem = await db.insert(cartItems)
        .values(cartData)
        .returning();
      
      return NextResponse.json(newItem[0]);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, quantity } = body;
    
    if (!id || quantity === undefined) {
      return NextResponse.json(
        { error: "Cart item ID and quantity are required" },
        { status: 400 }
      );
    }
    
    const updatedItem = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    
    return NextResponse.json(updatedItem[0]);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
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
        { error: "Cart item ID is required" },
        { status: 400 }
      );
    }
    
    await db.delete(cartItems)
      .where(eq(cartItems.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}
