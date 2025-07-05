// Script to create initial superadmin account
import { db } from '../src/db';
import { admins } from '../src/db/schema';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';

async function createSuperAdmin() {
  try {
    console.log("Checking if superadmin already exists...");
    
    try {
      // Check if admin with email already exists
      const existingAdmin = await db.select()
        .from(admins)
        .where(eq(admins.email, 'superadmin@admin.com'))
        .limit(1);
      
      if (existingAdmin.length > 0) {
        console.log("Superadmin already exists!");
        process.exit(0);
      }
    } catch (queryError) {
      // If the error is about the table not existing, we'll create it
      if (String(queryError).includes("relation") && String(queryError).includes("does not exist")) {
        console.log("Admin table doesn't exist. Creating it directly...");
        
        try {
          // Create table with direct SQL
          const sql = `
          CREATE TABLE IF NOT EXISTS admins (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            access_code TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          );
          `;
          
          await db.execute(sql);
          console.log("Admin table created successfully!");
        } catch (tableError) {
          console.error("Failed to create admin table:", tableError);
          
          // If even direct SQL fails, try connecting directly to PostgreSQL
          console.log("Attempting direct connection to PostgreSQL...");
          try {
            const sql = postgres(process.env.DATABASE_URL || '', { prepare: false });
            
            await sql`
            CREATE TABLE IF NOT EXISTS admins (
              id SERIAL PRIMARY KEY,
              email TEXT NOT NULL UNIQUE,
              access_code TEXT NOT NULL,
              created_at TIMESTAMP NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            );`;
            
            console.log("Created admin table with direct connection!");
            
            // Insert the superadmin
            await sql`
            INSERT INTO admins (email, access_code, created_at, updated_at)
            VALUES ('superadmin@admin.com', '8567899393', NOW(), NOW())
            ON CONFLICT (email) DO NOTHING;
            `;
            
            console.log("Superadmin created with direct SQL connection!");
            process.exit(0);
          } catch (directConnError) {
            console.error("Failed even with direct connection:", directConnError);
            process.exit(1);
          }
        }
      } else {
        // For other errors, log and exit
        console.error("Error checking if superadmin exists:", queryError);
        process.exit(1);
      }
    }
    
    console.log("Creating superadmin account...");
    
    // Create the admin in database
    const insertedAdmin = await db.insert(admins)
      .values({
        email: 'superadmin@admin.com',
        accessCode: '8567899393',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    console.log("Superadmin created successfully!");
    console.log(insertedAdmin[0]);
    
  } catch (error) {
    console.error("Error creating superadmin:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

createSuperAdmin();
