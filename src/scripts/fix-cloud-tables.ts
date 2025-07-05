/**
 * Script to manually create cloud access tables to fix migration issues
 * Run with: bun run src/scripts/fix-cloud-tables.ts
 */

import { db } from '../db';
import { sql } from 'drizzle-orm';

async function createCloudAccessTables() {
  console.log('Creating cloud access tables...');
  
  try {
    // Create user_audio_cloud_access table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "user_audio_cloud_access" (
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
        PRIMARY KEY ("user_id", "category_id")
      );
    `);
    console.log('✓ user_audio_cloud_access table created');

    // Create user_pdf_cloud_access table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "user_pdf_cloud_access" (
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
        PRIMARY KEY ("user_id", "category_id")
      );
    `);
    console.log('✓ user_pdf_cloud_access table created');

    // Create user_file_cloud_access table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "user_file_cloud_access" (
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
        PRIMARY KEY ("user_id", "category_id")
      );
    `);
    console.log('✓ user_file_cloud_access table created');

    console.log('All cloud access tables created successfully!');
  } catch (error) {
    console.error('Error creating cloud access tables:', error);
    throw error;
  }
}

// Run the script
createCloudAccessTables()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
