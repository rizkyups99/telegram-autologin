import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, telegramMessages, telegramLogs, telegramSettings, categories, NewUser, NewTelegramMessage, NewTelegramLog } from "@/db/schema";
import { eq, like } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Function to extract phone number from message
function extractPhoneNumber(message: string): string | null {
  const phoneRegex = /Telepon\s*:\s*(\d+)/i;
  const match = message.match(phoneRegex);
  return match ? match[1] : null;
}

// Function to extract access code from message
function extractAccessCode(message: string): string | null {
  const accessCodeRegex = /Kode Akses\s*:\s*(\d+)/i;
  const match = message.match(accessCodeRegex);
  return match ? match[1] : null;
}

// Function to extract customer name from message
function extractCustomerName(message: string): string | null {
  const nameRegex = /Nama\s*:\s*([^\n]+)/i;
  const match = message.match(nameRegex);
  return match ? match[1].trim() : null;
}

// Function to extract category info from message
function extractCategory(message: string, type: string): string | null {
  // Handle both regular and cloud categories
  const patterns = [
    new RegExp(`Kategori ${type}\\s*:\\s*([^\\n]+)`, 'i'),
    new RegExp(`${type} Kategori\\s*:\\s*([^\\n]+)`, 'i'),
    new RegExp(`${type}\\s*:\\s*([^\\n]+)`, 'i')
  ];
  
  for (const regex of patterns) {
    const match = message.match(regex);
    if (match && match[1]) {
      const categoryText = match[1].trim();
      // Return null for empty categories
      return categoryText === "" ? null : categoryText;
    }
  }
  
  return null;
}

// Function to extract cloud category info from message
function extractCloudCategory(message: string, type: string): string | null {
  const patterns = [
    new RegExp(`Kategori ${type} Cloud\\s*:\\s*([^\\n]+)`, 'i'),
    new RegExp(`${type} Cloud Kategori\\s*:\\s*([^\\n]+)`, 'i'),
    new RegExp(`${type} Cloud\\s*:\\s*([^\\n]+)`, 'i'),
    new RegExp(`Cloud ${type}\\s*:\\s*([^\\n]+)`, 'i')
  ];
  
  for (const regex of patterns) {
    const match = message.match(regex);
    if (match && match[1]) {
      const categoryText = match[1].trim();
      return categoryText === "" ? null : categoryText;
    }
  }
  
  return null;
}

// Debug log function
function logDebug(message: string, data?: any) {
  console.log(`[TELEGRAM WEBHOOK DEBUG] ${message}`, data ? data : '');
}

// Function to parse multiple categories from comma-separated string
function parseCategoriesArray(categoriesString: string | null): string[] {
  if (!categoriesString) return [];
  return categoriesString
    .split(',')
    .map(cat => cat.trim())
    .filter(cat => cat !== "");
}

// Function to check if message contains specific keywords
async function shouldForwardMessage(message: string): Promise<{ forward: boolean, keyword: string | null }> {
  try {
    // Get keywords from database
    const keywordsSetting = await db.select()
      .from(telegramSettings)
      .where(eq(telegramSettings.key, "forwarding_keywords"));
    
    let keywords = ["pembayaran"]; // Default keyword
    
    if (keywordsSetting.length > 0 && keywordsSetting[0].value) {
      try {
        keywords = JSON.parse(keywordsSetting[0].value);
      } catch (e) {
        console.error("Error parsing keywords:", e);
      }
    }
    
    // Check if message contains any of the keywords
    const matchedKeyword = keywords.find(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return { 
      forward: !!matchedKeyword, 
      keyword: matchedKeyword || null 
    };
  } catch (error) {
    console.error("Error checking keywords:", error);
    return { forward: false, keyword: null };
  }
}

// Function to check if forwarding is active
async function isForwardingActive(): Promise<boolean> {
  try {
    const forwardingSetting = await db.select()
      .from(telegramSettings)
      .where(eq(telegramSettings.key, "forwarding_active"));
    
    return forwardingSetting.length > 0 && forwardingSetting[0].value === "true";
  } catch (error) {
    console.error("Error checking forwarding status:", error);
    return false;
  }
}

/**
 * Ensures that the access tables required for category assignments exist.
 * This helps prevent errors when trying to insert records after a fresh installation.
 */
async function ensureAccessTablesExist(): Promise<void> {
  try {
    // Execute the SQL from init-access-tables.sql to create tables if they don't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "user_audio_access" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
        UNIQUE("user_id", "category_id")
      );

      CREATE TABLE IF NOT EXISTS "user_pdf_access" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
        UNIQUE("user_id", "category_id")
      );

      CREATE TABLE IF NOT EXISTS "user_video_access" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
        UNIQUE("user_id", "category_id")
      );
    `);
    
    logDebug('Successfully ensured access tables exist');
  } catch (error) {
    console.error('Error ensuring access tables exist:', error);
  }
}

// Function to create or update user from payment message
async function createUserFromMessage(phoneNumber: string | null, customerName: string | null, accessCode: string | null, message: string): Promise<boolean> {
  if (!phoneNumber) return false;
  
  try {
    logDebug(`Processing user creation for phone: ${phoneNumber}, name: ${customerName || "unknown"}`);
    
    // Ensure access tables exist before proceeding
    await ensureAccessTablesExist();
    
    // Extract category information from message
    const audioCategory = extractCategory(message, "Audio");
    const pdfCategory = extractCategory(message, "PDF");
    const videoCategory = extractCategory(message, "Video");
    
    // Extract cloud category information
    const audioCloudCategory = extractCloudCategory(message, "Audio");
    const pdfCloudCategory = extractCloudCategory(message, "PDF");  
    const fileCloudCategory = extractCloudCategory(message, "File");
    
    logDebug("Extracted categories:", { 
      audioCategory, 
      pdfCategory, 
      videoCategory,
      audioCloudCategory,
      pdfCloudCategory,
      fileCloudCategory
    });
    
    // Check if user already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.username, phoneNumber));
    
    let userId: number;
    let isNewUser = false;
    
    if (existingUser.length === 0) {
      // Create new user with phone as username and specified accessCode
      console.log("Creating new user with phone:", phoneNumber);
      
      const newUser = {
        username: phoneNumber,
        password: phoneNumber,
        accessCode: accessCode || phoneNumber, // Use provided access code or phone number as fallback
        name: customerName || "",
        isActive: true
      };
      
      const result = await db.insert(users).values(newUser).returning();
      userId = result[0].id;
      isNewUser = true;
      
      console.log(`Created new user with ID: ${userId}`);
    } else {
      userId = existingUser[0].id;
      console.log(`User already exists with ID: ${userId}`);
    }
    
    // Function to assign categories to user (handling multiple comma-separated categories)
    const assignCategories = async (categoryString: string | null, type: 'audio' | 'pdf' | 'video'): Promise<boolean> => {
      if (!categoryString) return false;
      
      // Parse categories array from comma-separated string
      const categoryNames = parseCategoriesArray(categoryString);
      if (categoryNames.length === 0) return false;
      
      let anyAssigned = false;
      
      // Process each category
      for (const categoryName of categoryNames) {
        try {
          logDebug(`Processing ${type} category: "${categoryName}"`);
          
          // Find the category by name (partial match)
          const matchingCategories = await db.select()
            .from(categories)
            .where(like(categories.name, `%${categoryName}%`));
          
          if (matchingCategories.length === 0) {
            logDebug(`No matching ${type} category found for: ${categoryName}`);
            continue;
          }
          
          const categoryId = matchingCategories[0].id;
          logDebug(`Found ${type} category: ${matchingCategories[0].name} (ID: ${categoryId})`);
          
          let tableName: string;
          if (type === 'audio') tableName = 'user_audio_access';
          else if (type === 'pdf') tableName = 'user_pdf_access';
          else tableName = 'user_video_access';
          
          // Build an SQL query that's safe for missing tables
          try {
            // Use parameterized query for better security and reliability
            await db.execute(sql`
              INSERT INTO ${sql.raw(tableName)} (user_id, category_id)
              VALUES (${userId}, ${categoryId})
              ON CONFLICT (user_id, category_id) DO NOTHING
            `);
            logDebug(`Assigned ${type} category ${categoryId} to user ${userId}`);
            anyAssigned = true;
          } catch (err) {
            console.error(`Error assigning ${type} category:`, err);
          }
        } catch (error) {
          console.error(`Error finding ${type} category:`, error);
        }
      }
      
      return anyAssigned;
    };

    // Function to assign cloud categories to user
    const assignCloudCategories = async (categoryString: string | null, type: 'audio_cloud' | 'pdf_cloud' | 'file_cloud'): Promise<boolean> => {
      if (!categoryString) return false;
      
      // Parse categories array from comma-separated string
      const categoryNames = parseCategoriesArray(categoryString);
      if (categoryNames.length === 0) return false;
      
      let anyAssigned = false;
      
      // Process each category
      for (const categoryName of categoryNames) {
        try {
          logDebug(`Processing ${type} category: "${categoryName}"`);
          
          // Find the category by name (partial match)
          const matchingCategories = await db.select()
            .from(categories)
            .where(like(categories.name, `%${categoryName}%`));
          
          if (matchingCategories.length === 0) {
            logDebug(`No matching ${type} category found for: ${categoryName}`);
            continue;
          }
          
          const categoryId = matchingCategories[0].id;
          logDebug(`Found ${type} category: ${matchingCategories[0].name} (ID: ${categoryId})`);
          
          let tableName: string;
          if (type === 'audio_cloud') tableName = 'user_audio_cloud_access';
          else if (type === 'pdf_cloud') tableName = 'user_pdf_cloud_access';
          else tableName = 'user_file_cloud_access';
          
          // Build an SQL query that's safe for missing tables
          try {
            // Use parameterized query for better security and reliability
            await db.execute(sql`
              INSERT INTO ${sql.raw(tableName)} (user_id, category_id)
              VALUES (${userId}, ${categoryId})
              ON CONFLICT (user_id, category_id) DO NOTHING
            `);
            logDebug(`Assigned ${type} category ${categoryId} to user ${userId}`);
            anyAssigned = true;
          } catch (err) {
            console.error(`Error assigning ${type} category:`, err);
          }
        } catch (error) {
          console.error(`Error finding ${type} category:`, error);
        }
      }
      
      return anyAssigned;
    };
    
    // Assign categories (now handling multiple categories per type including cloud categories)
    // Execute category assignments with detailed logging
    logDebug(`Processing category assignments for user ${userId}`);
    logDebug(`Audio category: ${audioCategory || 'none'}`);
    logDebug(`PDF category: ${pdfCategory || 'none'}`);
    logDebug(`Video category: ${videoCategory || 'none'}`);
    logDebug(`Audio Cloud category: ${audioCloudCategory || 'none'}`);
    logDebug(`PDF Cloud category: ${pdfCloudCategory || 'none'}`);
    logDebug(`File Cloud category: ${fileCloudCategory || 'none'}`);
    
    // Assign regular categories
    const audioAssigned = await assignCategories(audioCategory, 'audio');
    const pdfAssigned = await assignCategories(pdfCategory, 'pdf');
    const videoAssigned = await assignCategories(videoCategory, 'video');
    
    // Assign cloud categories
    const audioCloudAssigned = await assignCloudCategories(audioCloudCategory, 'audio_cloud');
    const pdfCloudAssigned = await assignCloudCategories(pdfCloudCategory, 'pdf_cloud');
    const fileCloudAssigned = await assignCloudCategories(fileCloudCategory, 'file_cloud');
    
    logDebug("Category assignment results:", {
      audioAssigned,
      pdfAssigned,
      videoAssigned,
      audioCloudAssigned,
      pdfCloudAssigned,
      fileCloudAssigned
    });
    
    return isNewUser || audioAssigned || pdfAssigned || videoAssigned || 
           audioCloudAssigned || pdfCloudAssigned || fileCloudAssigned;
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return false;
  }
}

// Function to forward message to target bot
async function forwardMessageToBot(message: string): Promise<{ success: boolean, error?: string }> {
  try {
    // Get target bot token from database
    const tokenSetting = await db.select()
      .from(telegramSettings)
      .where(eq(telegramSettings.key, "target_bot_token"));
    
    if (tokenSetting.length === 0 || !tokenSetting[0].value) {
      return { success: false, error: "Target bot token not found" };
    }
    
    const token = tokenSetting[0].value;
    
    // Get chat ID from database
    const chatIdSetting = await db.select()
      .from(telegramSettings)
      .where(eq(telegramSettings.key, "target_chat_id"));
    
    // Default to a placeholder chat ID if not found
    const chatId = chatIdSetting.length > 0 && chatIdSetting[0].value 
      ? chatIdSetting[0].value 
      : "123456789"; // This should be replaced with a real chat ID
    
    // Forward message to target bot
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML"
      }),
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      return { success: false, error: data.description || "Failed to forward message" };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error forwarding message:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error forwarding message" 
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received webhook message:", body);
    
    // Extract the message content from Telegram update
    const message = body.message?.text || "";
    const messageId = body.message?.message_id?.toString() || "";
    
    if (!message || !messageId) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }
    
    // Ensure access tables exist early
    await ensureAccessTablesExist();
    
    // Check if this message has already been processed
    const existingMessage = await db.select()
      .from(telegramMessages)
      .where(eq(telegramMessages.messageId, messageId));
    
    if (existingMessage.length > 0) {
      return NextResponse.json({ status: "Message already processed" });
    }
    
    // Store the message in database
    const newMessage: NewTelegramMessage = {
      messageId,
      content: message,
      phoneNumber: null,
      customerName: null,
      processed: false
    };
    
    // Check if message should be forwarded
    const { forward, keyword } = await shouldForwardMessage(message);
    const forwardingActive = await isForwardingActive();
    
    // Create log entry
    const newLog: NewTelegramLog = {
      messageId,
      content: message,
      timestamp: new Date(),
      forwarded: false,
      keyword
    };
    
    // Process message
    if (forward) {
      const phoneNumber = extractPhoneNumber(message);
      const customerName = extractCustomerName(message);
      const accessCode = extractAccessCode(message);
      
      if (phoneNumber) {
        newMessage.phoneNumber = phoneNumber;
        newMessage.customerName = customerName;
        
        // Create/update user with category assignments
        const userCreated = await createUserFromMessage(phoneNumber, customerName, accessCode, message);
        newMessage.processed = userCreated; // Only mark as processed if user was successfully created/updated
        
        logDebug(`User creation/update result: ${userCreated ? 'Success' : 'Failed'}`);
        
        // Forward message if forwarding is active
        if (forwardingActive) {
          const forwardResult = await forwardMessageToBot(message);
          
          if (forwardResult.success) {
            newLog.forwarded = true;
          } else {
            newLog.error = forwardResult.error;
          }
        }
      }
    }
    
    // Save the message and log
    await db.insert(telegramMessages).values(newMessage);
    await db.insert(telegramLogs).values(newLog);
  
    // Create access tables if they don't exist yet
    try {
      // Ensure access tables exist (needed for fresh installations)
      await fetch('/api/users/init-access-tables', {
        method: 'POST'
      });
      logDebug('Verified access tables exist');
    } catch (err) {
      console.error('Error ensuring access tables exist:', err);
    }
  
    return NextResponse.json({ 
      status: "success", 
      forwarded: newLog.forwarded,
      keyword,
      processed: newMessage.processed
    });
    
  } catch (error) {
    console.error("Error processing Telegram webhook:", error);
    return NextResponse.json(
      { error: "Failed to process Telegram webhook" },
      { status: 500 }
    );
  }
}
