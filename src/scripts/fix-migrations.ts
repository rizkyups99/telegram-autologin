/**
 * This script helps fix migration issues when tables already exist
 * Run with: bun run src/scripts/fix-migrations.ts
 */

import { sql } from 'drizzle-orm';
import { db } from '../db';

async function fixMigrations() {
  console.log('Starting migration repair process...');
  
  try {
    // Ensure drizzle migrations table exists
    await db.execute(sql`
      CREATE SCHEMA IF NOT EXISTS drizzle;
      
      CREATE TABLE IF NOT EXISTS drizzle."__drizzle_migrations" (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at timestamp with time zone DEFAULT now()
      );
    `);
    
    // Check and update migration records
    const existingMigrations = await db.execute(sql`
      SELECT * FROM drizzle."__drizzle_migrations" ORDER BY created_at;
    `);
    
    console.log(`Found ${existingMigrations.length} existing migrations`);
    
    // If we have fewer than expected migrations, add entries for existing tables
    if (existingMigrations.length < 5) {
      console.log('Adding missing migration records for existing tables...');
      
      // Add placeholder migrations for existing tables
      const placeholderHashes = [
        'placeholder_initial_schema',
        'placeholder_telegram_tables',
        'placeholder_user_access_tables',
        'placeholder_audios_table',
        'placeholder_videos_table'
      ];
      
      for (const hash of placeholderHashes) {
        const exists = existingMigrations.some((m: any) => m.hash === hash);
        
        if (!exists) {
          await db.execute(sql`
            INSERT INTO drizzle."__drizzle_migrations" (hash, created_at)
            VALUES (${hash}, NOW())
          `);
          console.log(`Added placeholder migration: ${hash}`);
        }
      }
    }
    
    console.log('Migration repair process completed successfully');
  } catch (error) {
    console.error('Error fixing migrations:', error);
  }
}

// Run the function
fixMigrations()
  .then(() => console.log('Script finished'))
  .catch(console.error);
