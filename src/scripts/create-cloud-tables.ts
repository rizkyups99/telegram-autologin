/**
 * This script creates the cloud tables if they don't exist
 * Run with: bun run src/scripts/create-cloud-tables.ts
 */

import { sql } from 'drizzle-orm';
import { db } from '../db';

async function createCloudTables() {
  console.log('Starting cloud tables creation process...');
  
  try {
    // Create audio_cloud_files table if it doesn't exist
    console.log('Creating audio_cloud_files table if it doesn\'t exist...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "audio_cloud_files" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "file_url" TEXT NOT NULL,
        "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    // Create pdf_cloud_files table if it doesn't exist
    console.log('Creating pdf_cloud_files table if it doesn\'t exist...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "pdf_cloud_files" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "cover_url" TEXT NOT NULL,
        "file_url" TEXT NOT NULL,
        "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    // Create file_cloud_files table if it doesn't exist
    console.log('Creating file_cloud_files table if it doesn\'t exist...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "file_cloud_files" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "cover_url" TEXT NOT NULL,
        "file_url" TEXT NOT NULL,
        "file_type" TEXT,
        "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    console.log('Cloud tables creation process completed successfully');
  } catch (error) {
    console.error('Error creating cloud tables:', error);
  }
}

// Run the function
createCloudTables()
  .then(() => console.log('Script finished'))
  .catch(console.error);
