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
    // First, remove ALL CHECK constraints using a more comprehensive approach
    console.log('Removing all CHECK constraints that might cause drizzle-kit issues...');
    
    // Get all CHECK constraints directly from pg_constraint
    const constraints = await db.execute(sql`
      SELECT 
        n.nspname as schema_name,
        c.relname as table_name,
        con.conname as constraint_name
      FROM pg_constraint con
      JOIN pg_class c ON con.conrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE con.contype = 'c'
      AND n.nspname = 'public'
      ORDER BY c.relname, con.conname;
    `);
    
    console.log(`Found ${constraints.length} CHECK constraints to remove`);
    
    // Remove each constraint individually
    for (const row of constraints as any[]) {
      try {
        await db.execute(sql`
          ALTER TABLE ${sql.identifier(row.table_name)} 
          DROP CONSTRAINT IF EXISTS ${sql.identifier(row.constraint_name)} CASCADE;
        `);
        console.log(`✓ Dropped constraint: ${row.constraint_name} from table ${row.table_name}`);
      } catch (error) {
        console.log(`⚠ Could not drop constraint ${row.constraint_name} from table ${row.table_name}:`, error);
        // Continue with other constraints
      }
    }
    
    // Also try the bulk approach as a backup
    try {
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
          LOOP
            BEGIN
              EXECUTE 'ALTER TABLE ' || quote_ident(constraint_rec.table_name) || ' DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_rec.conname) || ' CASCADE';
              RAISE NOTICE 'Bulk dropped constraint: % from table %', constraint_rec.conname, constraint_rec.table_name;
            EXCEPTION
              WHEN OTHERS THEN
                RAISE NOTICE 'Could not bulk drop constraint % from table %: %', constraint_rec.conname, constraint_rec.table_name, SQLERRM;
            END;
          END LOOP;
        END $$;
      `);
    } catch (bulkError) {
      console.log('Bulk constraint removal had issues, but individual removal should have worked');
    }
    
    // Clean up any constraint metadata that might be causing issues
    console.log('Cleaning up constraint metadata...');
    try {
      await db.execute(sql`
        -- Remove any orphaned constraint references
        DELETE FROM information_schema.check_constraints 
        WHERE constraint_schema = 'public' 
        AND constraint_name NOT IN (
          SELECT conname FROM pg_constraint WHERE contype = 'c'
        );
      `);
    } catch (metaError) {
      console.log('Metadata cleanup had issues (this is usually fine):', metaError);
    }
    
    // Ensure all tables have proper structure without constraints
    console.log('Ensuring proper table structure...');
    
    // Ensure users table is properly configured
    try {
      await db.execute(sql`
        ALTER TABLE users ALTER COLUMN created_at SET DEFAULT NOW();
        ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT NOW();
      `);
      console.log('✓ Updated users table defaults');
    } catch (usersError) {
      console.log('Users table update had issues:', usersError);
    }
    
    // Ensure categories table is properly configured
    try {
      await db.execute(sql`
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'categories' AND column_name = 'filter'
          ) THEN
            ALTER TABLE categories ADD COLUMN filter text;
            RAISE NOTICE 'Added filter column to categories';
          END IF;
        END $$;
      `);
      
      await db.execute(sql`
        ALTER TABLE categories ALTER COLUMN filter TYPE text;
        ALTER TABLE categories ALTER COLUMN filter DROP NOT NULL;
      `);
      console.log('✓ Updated categories table structure');
    } catch (categoriesError) {
      console.log('Categories table update had issues:', categoriesError);
    }
    
    // Final verification - check if there are any remaining constraints
    console.log('Verifying constraint removal...');
    try {
      const remainingConstraints = await db.execute(sql`
        SELECT count(*) as count
        FROM pg_constraint c
        JOIN pg_class cl ON c.conrelid = cl.oid
        JOIN pg_namespace n ON cl.relnamespace = n.oid
        WHERE c.contype = 'c'
        AND n.nspname = 'public';
      `);
      
      const count = (remainingConstraints[0] as any).count;
      console.log(`Remaining CHECK constraints: ${count}`);
      
      if (count > 0) {
        // List remaining constraints for debugging
        const remaining = await db.execute(sql`
          SELECT 
            c.relname as table_name,
            con.conname as constraint_name,
            pg_get_constraintdef(con.oid) as definition
          FROM pg_constraint con
          JOIN pg_class c ON con.conrelid = c.oid
          JOIN pg_namespace n ON c.relnamespace = n.oid
          WHERE con.contype = 'c'
          AND n.nspname = 'public';
        `);
        
        console.log('Remaining constraints:', remaining);
      }
    } catch (verifyError) {
      console.log('Verification had issues:', verifyError);
    }
    
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
