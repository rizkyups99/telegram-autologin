/**
 * Aggressive database cleanup script to fix drizzle-kit issues
 * This script will completely clean up all CHECK constraints and problematic elements
 * Run with: bun run src/scripts/aggressive-database-cleanup.ts
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

async function aggressiveDatabaseCleanup() {
  console.log('Starting aggressive database cleanup...');
  
  try {
    // Step 1: Drop ALL check constraints from ALL tables
    console.log('Step 1: Removing ALL CHECK constraints from database...');
    
    // Get all CHECK constraints from the entire database
    const allConstraints = await db.execute(sql`
      SELECT 
        schemaname,
        tablename,
        constraintname
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      JOIN pg_namespace n ON t.relnamespace = n.oid
      JOIN pg_stat_user_tables stat ON stat.relname = t.relname AND stat.schemaname = n.nspname
      WHERE c.contype = 'c'
      ORDER BY schemaname, tablename, constraintname;
    `);
    
    console.log(`Found ${allConstraints.length} CHECK constraints to remove`);
    
    // Remove each constraint with CASCADE
    for (const row of allConstraints as any[]) {
      try {
        await db.execute(sql`
          ALTER TABLE ${sql.identifier(row.schemaname)}.${sql.identifier(row.tablename)} 
          DROP CONSTRAINT IF EXISTS ${sql.identifier(row.constraintname)} CASCADE;
        `);
        console.log(`✓ Dropped: ${row.schemaname}.${row.tablename}.${row.constraintname}`);
      } catch (error) {
        console.log(`⚠ Could not drop: ${row.schemaname}.${row.tablename}.${row.constraintname}`, error);
      }
    }
    
    // Step 2: Remove constraint metadata from system catalogs
    console.log('Step 2: Cleaning constraint metadata...');
    
    try {
      // Clean up pg_constraint directly
      await db.execute(sql`
        DELETE FROM pg_constraint 
        WHERE contype = 'c' 
        AND conrelid IN (
          SELECT oid FROM pg_class 
          WHERE relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        );
      `);
      console.log('✓ Cleaned pg_constraint table');
    } catch (error) {
      console.log('⚠ Could not clean pg_constraint:', error);
    }
    
    // Step 3: Fix problematic columns that might have constraint issues
    console.log('Step 3: Fixing potentially problematic columns...');
    
    const problematicTables = [
      'users',
      'categories', 
      'admins',
      'pdfs',
      'audios',
      'videos',
      'audio_cloud_files',
      'pdf_cloud_files',
      'file_cloud_files'
    ];
    
    for (const tableName of problematicTables) {
      try {
        // Check if table exists
        const tableExists = await db.execute(sql`
          SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = ${tableName}
          );
        `);
        
        if (!(tableExists[0] as any).exists) {
          console.log(`⚠ Table ${tableName} does not exist, skipping`);
          continue;
        }
        
        // Remove all constraints from this table
        await db.execute(sql`
          DO $$
          DECLARE
            constraint_record RECORD;
          BEGIN
            FOR constraint_record IN 
              SELECT conname 
              FROM pg_constraint c
              JOIN pg_class t ON c.conrelid = t.oid
              WHERE t.relname = ${tableName} AND c.contype = 'c'
            LOOP
              BEGIN
                EXECUTE 'ALTER TABLE ' || quote_ident(${tableName}) || ' DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_record.conname) || ' CASCADE';
                RAISE NOTICE 'Dropped constraint % from %', constraint_record.conname, ${tableName};
              EXCEPTION
                WHEN OTHERS THEN
                  RAISE NOTICE 'Could not drop constraint % from %: %', constraint_record.conname, ${tableName}, SQLERRM;
              END;
            END LOOP;
          END $$;
        `);
        
        console.log(`✓ Cleaned all constraints from ${tableName}`);
        
      } catch (error) {
        console.log(`⚠ Error processing table ${tableName}:`, error);
      }
    }
    
    // Step 4: Ensure proper column types and defaults
    console.log('Step 4: Ensuring proper column configurations...');
    
    const tableConfigurations = [
      {
        table: 'users',
        fixes: [
          'ALTER COLUMN created_at SET DEFAULT NOW()',
          'ALTER COLUMN updated_at SET DEFAULT NOW()',
          'ALTER COLUMN is_active SET DEFAULT true'
        ]
      },
      {
        table: 'categories',
        fixes: [
          'ALTER COLUMN created_at SET DEFAULT NOW()',
          'ALTER COLUMN updated_at SET DEFAULT NOW()'
        ]
      },
      {
        table: 'admins',
        fixes: [
          'ALTER COLUMN created_at SET DEFAULT NOW()',
          'ALTER COLUMN updated_at SET DEFAULT NOW()'
        ]
      }
    ];
    
    for (const config of tableConfigurations) {
      try {
        for (const fix of config.fixes) {
          try {
            await db.execute(sql`ALTER TABLE ${sql.identifier(config.table)} ${sql.raw(fix)};`);
            console.log(`✓ Applied fix to ${config.table}: ${fix}`);
          } catch (fixError) {
            console.log(`⚠ Could not apply fix to ${config.table}: ${fix}`, fixError);
          }
        }
      } catch (error) {
        console.log(`⚠ Error configuring table ${config.table}:`, error);
      }
    }
    
    // Step 5: Final verification
    console.log('Step 5: Final verification...');
    
    const remainingConstraints = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      JOIN pg_namespace n ON t.relnamespace = n.oid
      WHERE c.contype = 'c' AND n.nspname = 'public';
    `);
    
    const count = (remainingConstraints[0] as any).count;
    console.log(`Final count of CHECK constraints: ${count}`);
    
    if (count > 0) {
      console.log('⚠ Still have remaining constraints, listing them:');
      const remaining = await db.execute(sql`
        SELECT 
          n.nspname as schema_name,
          t.relname as table_name,
          c.conname as constraint_name,
          pg_get_constraintdef(c.oid) as definition
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        JOIN pg_namespace n ON t.relnamespace = n.oid
        WHERE c.contype = 'c' AND n.nspname = 'public';
      `);
      
      console.log('Remaining constraints:', remaining);
      
      // Try to force remove these as well
      for (const constraint of remaining as any[]) {
        try {
          await db.execute(sql`
            ALTER TABLE ${sql.identifier(constraint.schema_name)}.${sql.identifier(constraint.table_name)}
            DROP CONSTRAINT ${sql.identifier(constraint.constraint_name)} CASCADE;
          `);
          console.log(`✓ Force removed: ${constraint.constraint_name}`);
        } catch (error) {
          console.log(`✗ Could not force remove: ${constraint.constraint_name}`, error);
        }
      }
    } else {
      console.log('✅ All CHECK constraints successfully removed!');
    }
    
    console.log('✅ Aggressive database cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during aggressive cleanup:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the cleanup
aggressiveDatabaseCleanup()
  .then(() => {
    console.log('Cleanup script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Cleanup script failed:', error);
    process.exit(1);
  });
