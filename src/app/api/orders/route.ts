import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, cartItems, storefrontProducts } from "@/db/schema";
import { NewOrder } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, customerName, customerEmail, customerPhone, totalAmount, paymentMethod, items } = body;
    
    if (!sessionId || !customerName || !customerEmail || !customerPhone || !totalAmount || !paymentMethod || !items) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    
    const orderData: NewOrder = {
      sessionId,
      customerName,
      customerEmail,
      customerPhone,
      totalAmount,
      paymentMethod,
      items: JSON.stringify(items),
      status: 'pending',
      updatedAt: new Date()
    };
    
    const newOrder = await db.insert(orders)
      .values(orderData)
      .returning();
    
    // Clear cart after successful order
    await db.delete(cartItems)
      .where(eq(cartItems.sessionId, sessionId));
    
    return NextResponse.json(newOrder[0]);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allOrders = await db.select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
    
    return NextResponse.json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
