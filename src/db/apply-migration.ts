import { db } from "./index";
import fs from 'fs';
import path from 'path';
import { sql } from "drizzle-orm";

/**
 * Manually applies a specific migration SQL file to bypass drizzle-kit issues
 */
export async function applyMigrationFile(migrationName: string): Promise<void> {
  try {
    const migrationPath = path.join(process.cwd(), 'postgres', 'migrations', migrationName);
    
    // Check if file exists
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file ${migrationName} not found`);
    }
    
    // Read the SQL file
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');
    
    console.log(`Applying migration ${migrationName}...`);
    
    // Execute the SQL directly
    await db.execute(sql.raw(sqlContent));
    
    console.log(`Migration ${migrationName} applied successfully`);
  } catch (error) {
    console.error(`Failed to apply migration ${migrationName}:`, error);
    throw error;
  }
}
