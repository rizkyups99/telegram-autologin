/**
 * This script ensures cloud access tables exist in the database
 * Run with: bun run src/scripts/init-cloud-access-tables.ts
 */

import { sql } from 'drizzle-orm';
import { db } from '../db';

async function initCloudAccessTables() {
  console.log('Starting cloud access tables initialization...');
  
  try {
    // Create user_audio_cloud_access table if it doesn't exist
    console.log('Creating user_audio_cloud_access table if it doesn\'t exist...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "user_audio_cloud_access" (
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
        PRIMARY KEY ("user_id", "category_id")
      );
    `);
    
    // Create user_pdf_cloud_access table if it doesn't exist
    console.log('Creating user_pdf_cloud_access table if it doesn\'t exist...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "user_pdf_cloud_access" (
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
        PRIMARY KEY ("user_id", "category_id")
      );
    `);
    
    // Create user_file_cloud_access table if it doesn't exist
    console.log('Creating user_file_cloud_access table if it doesn\'t exist...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "user_file_cloud_access" (
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
        PRIMARY KEY ("user_id", "category_id")
      );
    `);
    
    console.log('Cloud access tables initialization completed successfully');
  } catch (error) {
    console.error('Error initializing cloud access tables:', error);
    throw error;
  }
}

// Run the function
initCloudAccessTables()
  .then(() => {
    console.log('Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
