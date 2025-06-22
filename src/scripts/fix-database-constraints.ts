/**
 * This script fixes database constraint issues that might be causing drizzle-kit problems
 * Run with: bun run src/scripts/fix-database-constraints.ts
 */

import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Initialize database connection directly
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function fixDatabaseConstraints() {
  console.log('Starting database constraint fix process...');
  
  try {
    // First, let's see what CHECK constraints exist on the categories table
    console.log('Checking existing constraints on categories table...');
    const constraints = await db.execute(sql`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint 
      WHERE conrelid = 'categories'::regclass 
      AND contype = 'c';
    `);
    
    console.log('Found constraints:', constraints);
    
    // Remove any CHECK constraints on the categories table that might be problematic
    console.log('Removing potential CHECK constraints on categories table...');
    await db.execute(sql`
      DO $$ 
      DECLARE 
        constraint_name text;
      BEGIN
        FOR constraint_name IN 
          SELECT conname 
          FROM pg_constraint 
          WHERE conrelid = 'categories'::regclass 
          AND contype = 'c'
        LOOP
          EXECUTE 'ALTER TABLE categories DROP CONSTRAINT IF EXISTS ' || constraint_name;
          RAISE NOTICE 'Dropped constraint: %', constraint_name;
        END LOOP;
      END $$;
    `);
    
    // Ensure the filter column exists and is of type text
    console.log('Ensuring filter column is properly configured...');
    await db.execute(sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'categories' AND column_name = 'filter'
        ) THEN
          ALTER TABLE categories ADD COLUMN filter text;
          RAISE NOTICE 'Added filter column';
        END IF;
      END $$;
    `);
    
    // Update the filter column to allow any text values
    console.log('Updating filter column to allow flexible values...');
    await db.execute(sql`
      ALTER TABLE categories ALTER COLUMN filter TYPE text;
    `);
    
    // Also check for and remove problematic CHECK constraints across all tables
    console.log('Checking for other problematic CHECK constraints...');
    const allConstraints = await db.execute(sql`
      SELECT 
        t.table_name,
        c.conname,
        pg_get_constraintdef(c.oid) as definition
      FROM pg_constraint c
      JOIN pg_class cl ON c.conrelid = cl.oid
      JOIN information_schema.tables t ON cl.relname = t.table_name
      WHERE c.contype = 'c'
      AND t.table_schema = 'public';
    `);
    
    console.log('All CHECK constraints in database:', allConstraints);
    
    // Remove the problematic users constraint that references non-existent column
    console.log('Removing problematic CHECK constraint on users table...');
    await db.execute(sql`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_change_confirm_status_check;
    `);
    
    // Remove any other CHECK constraints that might reference non-existent columns
    console.log('Removing any other problematic CHECK constraints...');
    await db.execute(sql`
      DO $$ 
      DECLARE 
        constraint_rec record;
      BEGIN
        FOR constraint_rec IN 
          SELECT 
            t.table_name,
            c.conname
          FROM pg_constraint c
          JOIN pg_class cl ON c.conrelid = cl.oid
          JOIN information_schema.tables t ON cl.relname = t.table_name
          WHERE c.contype = 'c'
          AND t.table_schema = 'public'
          AND c.conname LIKE '%email_change_confirm_status%'
        LOOP
          EXECUTE 'ALTER TABLE ' || constraint_rec.table_name || ' DROP CONSTRAINT IF EXISTS ' || constraint_rec.conname;
          RAISE NOTICE 'Dropped problematic constraint: % from table %', constraint_rec.conname, constraint_rec.table_name;
        END LOOP;
      END $$;
    `);
    
    console.log('Database constraint fix process completed successfully');
  } catch (error) {
    console.error('Error fixing database constraints:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the function
fixDatabaseConstraints()
  .then(() => console.log('Script finished'))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
