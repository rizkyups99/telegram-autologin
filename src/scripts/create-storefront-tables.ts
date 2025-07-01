/**
 * This script creates the storefront tables manually to bypass drizzle-kit issues
 * Run with: bun run src/scripts/create-storefront-tables.ts
 */

import { sql } from 'drizzle-orm';
import { db } from '../db';

async function createStorefrontTables() {
  console.log('Starting storefront tables creation process...');
  
  try {
    // Create storefront_products table
    console.log('Creating storefront_products table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "storefront_products" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" TEXT NOT NULL,
        "image_url" TEXT NOT NULL,
        "is_active" BOOLEAN DEFAULT true,
        "source_type" TEXT NOT NULL,
        "source_category_ids" TEXT NOT NULL,
        "payment_methods" TEXT NOT NULL DEFAULT '["transfer","virtual_account"]',
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    // Create cart_items table
    console.log('Creating cart_items table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "cart_items" (
        "id" SERIAL PRIMARY KEY,
        "session_id" TEXT NOT NULL,
        "product_id" INTEGER NOT NULL REFERENCES "storefront_products"("id"),
        "quantity" INTEGER DEFAULT 1 NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    // Create orders table
    console.log('Creating orders table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id" SERIAL PRIMARY KEY,
        "order_number" TEXT NOT NULL UNIQUE,
        "buyer_name" TEXT NOT NULL,
        "buyer_phone" TEXT NOT NULL,
        "buyer_email" TEXT NOT NULL,
        "total_amount" TEXT NOT NULL,
        "payment_method" TEXT NOT NULL,
        "payment_status" TEXT DEFAULT 'pending' NOT NULL,
        "items" TEXT NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    console.log('Storefront tables created successfully!');
  } catch (error) {
    console.error('Error creating storefront tables:', error);
    throw error;
  }
}

// Run the function
createStorefrontTables()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
