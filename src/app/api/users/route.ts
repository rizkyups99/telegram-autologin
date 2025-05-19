import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userAudioAccess, userPdfAccess, userVideoAccess } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { NewUser } from "@/db/schema";

export async function GET() {
  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    
    // Initialize tables if needed
    try {
      await fetch('/api/users/init-access-tables', { method: 'POST' });
    } catch (initError) {
      console.warn('Access tables initialization warning:', initError);
      // Continue anyway
    }
    
    // Fetch category access for each user using raw SQL to handle missing tables gracefully
    const usersWithAccess = await Promise.all(allUsers.map(async user => {
      let audioCategoryIds: number[] = [];
      let pdfCategoryIds: number[] = [];
      let videoCategoryIds: number[] = [];
      
      try {
        // Get audio category access
        try {
          const audioResult = await db.execute(sql`
            SELECT "category_id" FROM "user_audio_access" WHERE "user_id" = ${user.id}
          `);
          audioCategoryIds = (audioResult as any[]).map(row => row.category_id);
        } catch (audioError) {
          console.warn(`Error getting audio access for user ${user.id}:`, audioError);
        }
        
        // Get PDF category access
        try {
          const pdfResult = await db.execute(sql`
            SELECT "category_id" FROM "user_pdf_access" WHERE "user_id" = ${user.id}
          `);
          pdfCategoryIds = (pdfResult as any[]).map(row => row.category_id);
        } catch (pdfError) {
          console.warn(`Error getting PDF access for user ${user.id}:`, pdfError);
        }
        
        // Get video category access
        try {
          const videoResult = await db.execute(sql`
            SELECT "category_id" FROM "user_video_access" WHERE "user_id" = ${user.id}
          `);
          videoCategoryIds = (videoResult as any[]).map(row => row.category_id);
        } catch (videoError) {
          console.warn(`Error getting video access for user ${user.id}:`, videoError);
        }
      } catch (accessError) {
        console.warn(`Error getting category access for user ${user.id}:`, accessError);
      }
      
      return {
        ...user,
        audioCategoryIds,
        pdfCategoryIds,
        videoCategoryIds
      };
    }));
    
    return NextResponse.json(usersWithAccess);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Update an existing user
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, username, name, accessCode, isActive, audioCategoryIds, pdfCategoryIds, videoCategoryIds } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, id));
    
    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Ensure the access tables exist
    try {
      // Try to initialize tables if they don't exist yet
      await fetch('/api/users/init-access-tables', { method: 'POST' });
    } catch (initError) {
      console.warn('Access tables initialization warning:', initError);
      // Continue anyway - the main user update is more important
    }
    
    // Update user data
    const updateData: Partial<NewUser> = {};
    
    if (username !== undefined) updateData.username = username;
    if (name !== undefined) updateData.name = name;
    if (accessCode !== undefined) updateData.accessCode = accessCode;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const updatedUser = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    
    try {
      // Update audio category access
      if (audioCategoryIds !== undefined) {
        try {
          // Delete existing access records
          await db.execute(sql`DELETE FROM "user_audio_access" WHERE "user_id" = ${id}`);
          
          // Add new access records if any categories are selected
          if (Array.isArray(audioCategoryIds) && audioCategoryIds.length > 0) {
            for (const categoryId of audioCategoryIds) {
              try {
                await db.execute(sql`
                  INSERT INTO "user_audio_access" ("user_id", "category_id")
                  VALUES (${id}, ${parseInt(String(categoryId))})
                  ON CONFLICT ("user_id", "category_id") DO NOTHING
                `);
              } catch (err) {
                console.warn(`Error inserting audio category ${categoryId}:`, err);
              }
            }
          }
        } catch (audioAccessError) {
          console.warn('Error updating audio access:', audioAccessError);
        }
      }
      
      // Update PDF category access
      if (pdfCategoryIds !== undefined) {
        try {
          // Delete existing access records
          await db.execute(sql`DELETE FROM "user_pdf_access" WHERE "user_id" = ${id}`);
          
          // Add new access records if any categories are selected
          if (Array.isArray(pdfCategoryIds) && pdfCategoryIds.length > 0) {
            for (const categoryId of pdfCategoryIds) {
              try {
                await db.execute(sql`
                  INSERT INTO "user_pdf_access" ("user_id", "category_id")
                  VALUES (${id}, ${parseInt(String(categoryId))})
                  ON CONFLICT ("user_id", "category_id") DO NOTHING
                `);
              } catch (err) {
                console.warn(`Error inserting PDF category ${categoryId}:`, err);
              }
            }
          }
        } catch (pdfAccessError) {
          console.warn('Error updating PDF access:', pdfAccessError);
        }
      }
      
      // Update video category access
      if (videoCategoryIds !== undefined) {
        try {
          // Delete existing access records
          await db.execute(sql`DELETE FROM "user_video_access" WHERE "user_id" = ${id}`);
          
          // Add new access records if any categories are selected
          if (Array.isArray(videoCategoryIds) && videoCategoryIds.length > 0) {
            for (const categoryId of videoCategoryIds) {
              try {
                await db.execute(sql`
                  INSERT INTO "user_video_access" ("user_id", "category_id")
                  VALUES (${id}, ${parseInt(String(categoryId))})
                  ON CONFLICT ("user_id", "category_id") DO NOTHING
                `);
              } catch (err) {
                console.warn(`Error inserting video category ${categoryId}:`, err);
              }
            }
          }
        } catch (videoAccessError) {
          console.warn('Error updating video access:', videoAccessError);
        }
      }
    } catch (accessError) {
      console.error('Error updating category access:', accessError);
      // Continue anyway, user update succeeded
    }
    
    return NextResponse.json({
      ...updatedUser[0],
      audioCategoryIds,
      pdfCategoryIds,
      videoCategoryIds
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// Delete a user
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(id)));
    
    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Delete category access records using raw SQL for better error handling
    try {
      await db.execute(sql`DELETE FROM "user_audio_access" WHERE "user_id" = ${parseInt(id)}`);
    } catch (audioError) {
      console.warn(`Error deleting audio access for user ${id}:`, audioError);
      // Continue anyway
    }
    
    try {
      await db.execute(sql`DELETE FROM "user_pdf_access" WHERE "user_id" = ${parseInt(id)}`);
    } catch (pdfError) {
      console.warn(`Error deleting PDF access for user ${id}:`, pdfError);
      // Continue anyway
    }
    
    try {
      await db.execute(sql`DELETE FROM "user_video_access" WHERE "user_id" = ${parseInt(id)}`);
    } catch (videoError) {
      console.warn(`Error deleting video access for user ${id}:`, videoError);
      // Continue anyway
    }
    
    // Delete user
    await db.delete(users).where(eq(users.id, parseInt(id)));
    
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, name, accessCode, isActive, audioCategoryIds, pdfCategoryIds, videoCategoryIds } = body;
    
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.username, username));
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User with this username already exists" },
        { status: 400 }
      );
    }
    
    // Ensure the access tables exist
    try {
      // Try to initialize tables if they don't exist yet
      await fetch('/api/users/init-access-tables', { method: 'POST' });
    } catch (initError) {
      console.warn('Access tables initialization warning:', initError);
      // Continue anyway - the main user creation is more important
    }
    
    // Create new user
    const newUser: NewUser = {
      username,
      password: username, // Using username as password
      accessCode: accessCode || username, // Using username as access code if not provided
      name: name || "",
      isActive: isActive !== undefined ? isActive : true
    };
      
    // Insert user and get the created user with ID
    const insertedUser = await db.insert(users).values(newUser).returning();
    const userId = insertedUser[0].id;
      
    try {
      // Save category access for audio
      if (audioCategoryIds && Array.isArray(audioCategoryIds) && audioCategoryIds.length > 0) {
        // Use manual SQL insertion to handle potential missing tables gracefully
        for (const categoryId of audioCategoryIds) {
          try {
            await db.execute(sql`
              INSERT INTO "user_audio_access" ("user_id", "category_id")
              VALUES (${userId}, ${parseInt(String(categoryId))})
              ON CONFLICT ("user_id", "category_id") DO NOTHING
            `);
          } catch (err) {
            console.warn(`Error inserting audio category ${categoryId}:`, err);
          }
        }
      }
      
      // Save category access for PDF
      if (pdfCategoryIds && Array.isArray(pdfCategoryIds) && pdfCategoryIds.length > 0) {
        for (const categoryId of pdfCategoryIds) {
          try {
            await db.execute(sql`
              INSERT INTO "user_pdf_access" ("user_id", "category_id")
              VALUES (${userId}, ${parseInt(String(categoryId))})
              ON CONFLICT ("user_id", "category_id") DO NOTHING
            `);
          } catch (err) {
            console.warn(`Error inserting PDF category ${categoryId}:`, err);
          }
        }
      }
      
      // Save category access for video
      if (videoCategoryIds && Array.isArray(videoCategoryIds) && videoCategoryIds.length > 0) {
        for (const categoryId of videoCategoryIds) {
          try {
            await db.execute(sql`
              INSERT INTO "user_video_access" ("user_id", "category_id")
              VALUES (${userId}, ${parseInt(String(categoryId))})
              ON CONFLICT ("user_id", "category_id") DO NOTHING
            `);
          } catch (err) {
            console.warn(`Error inserting video category ${categoryId}:`, err);
          }
        }
      }
    } catch (accessError) {
      console.error("Error saving category access:", accessError);
      // Continue anyway - user creation succeeded
    }
    
    return NextResponse.json({
      ...insertedUser[0],
      audioCategoryIds,
      pdfCategoryIds,
      videoCategoryIds
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
