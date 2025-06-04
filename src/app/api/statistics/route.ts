import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, admins, categories, userAudioAccess, userPdfAccess, userVideoAccess } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') ? parseInt(searchParams.get('year') as string) : new Date().getFullYear();
    const month = searchParams.get('month') ? parseInt(searchParams.get('month') as string) : new Date().getMonth() + 1;
    
    console.log(`Statistics request for year: ${year}, month: ${month}`);
    
    // Query actual user data from the database
    const monthlyData = await getMonthlyUserCounts(year);
    const categorySummary = await getCategoryStatistics(year, month);
    const availableMonths = await getAvailableMonths();
    const categoryDistribution = await getUserCategoryDistribution(year, month);

    return NextResponse.json({
      monthlyData,
      categorySummary,
      availableMonths,
      categoryDistribution,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics data" },
      { status: 500 }
    );
  }
}

/**
 * Get user counts by month for a specific year
 */
async function getMonthlyUserCounts(year: number) {
  // Define month names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  try {
    // Query to get user count by month
    const result = await db.execute(sql`
      SELECT 
        EXTRACT(MONTH FROM "created_at") as month,
        COUNT(*) as count
      FROM 
        users
      WHERE 
        EXTRACT(YEAR FROM "created_at") = ${year}
      GROUP BY 
        EXTRACT(MONTH FROM "created_at")
      ORDER BY 
        month
    `);
    
    // Create a map of month -> count
    const countByMonth: Record<number, number> = {};
    result.forEach(row => {
      if (row && typeof row === 'object' && 'month' in row && 'count' in row) {
        countByMonth[parseInt(String(row.month))] = parseInt(String(row.count));
      }
    });
    
    // Generate the final array with all months (with 0 for months with no users)
    return monthNames.map((name, index) => {
      const monthNumber = index + 1;
      return {
        month: name,
        count: countByMonth[monthNumber] || 0
      };
    });
  } catch (error) {
    console.error("Error getting monthly user counts:", error);
    // Return empty data in case of error
    return monthNames.map(name => ({ month: name, count: 0 }));
  }
}

/**
 * Get category statistics (which categories are most popular)
 * Combines data from audio, pdf, and video access tables
 */
async function getCategoryStatistics(year: number, month: number) {
  try {
    // Get category statistics using a more efficient single query
    const categoryStats = await db.execute(sql`
      WITH user_categories AS (
        SELECT DISTINCT 
          u.id as user_id,
          c.id as category_id,
          c.name as category_name
        FROM users u
        LEFT JOIN user_audio_access uaa ON u.id = uaa.user_id
        LEFT JOIN user_pdf_access upa ON u.id = upa.user_id  
        LEFT JOIN user_video_access uva ON u.id = uva.user_id
        LEFT JOIN categories c ON (c.id = uaa.category_id OR c.id = upa.category_id OR c.id = uva.category_id)
        WHERE c.id IS NOT NULL
        AND EXTRACT(YEAR FROM u.created_at) = ${year}
        AND EXTRACT(MONTH FROM u.created_at) = ${month}
      )
      SELECT 
        category_name as name,
        COUNT(DISTINCT user_id) as count
      FROM user_categories
      GROUP BY category_id, category_name
      ORDER BY count DESC
      LIMIT 10
    `);
    
    // Transform the results
    return categoryStats.map((row: any) => ({
      name: row.name,
      count: parseInt(String(row.count))
    }));
  } catch (error) {
    console.error("Error getting category statistics:", error);
    // Return empty array in case of error
    return [];
  }
}

/**
 * Get user category distribution statistics
 * Shows how many users have 1, 2, 3+ categories
 */
async function getUserCategoryDistribution(year: number, month: number) {
  try {
    console.log(`Getting category distribution for ${year}-${month}`);
    
    // Get all users from the specified year for complete analysis
    const allUsers = await db.execute(sql`
      SELECT id FROM users 
      WHERE EXTRACT(YEAR FROM created_at) = ${year}
    `);
    
    console.log(`Found ${allUsers.length} users for year ${year}`);
    
    if (!allUsers.length) {
      return [{ categories: 0, users: 0 }];
    }
    
    const userIds = allUsers.map((row: any) => row.id);
    
    // Initialize user category count map
    const userCategoryCount: Record<number, Set<number>> = {};
    userIds.forEach(userId => {
      userCategoryCount[userId] = new Set();
    });
    
    // Function to safely get category access
    const getCategoryAccess = async (tableName: string) => {
      try {
        const result = await db.execute(sql.raw(`
          SELECT user_id, category_id FROM ${tableName} 
          WHERE user_id = ANY(ARRAY[${userIds.join(',')}])
        `));
        
        result.forEach((row: any) => {
          const userId = parseInt(String(row.user_id));
          const categoryId = parseInt(String(row.category_id));
          if (userCategoryCount[userId]) {
            userCategoryCount[userId].add(categoryId);
          }
        });
        
        console.log(`${tableName}: Found ${result.length} access records`);
      } catch (error) {
        console.warn(`Error getting ${tableName}:`, error);
      }
    };
    
    // Get access from all tables
    await getCategoryAccess('user_audio_access');
    await getCategoryAccess('user_pdf_access');  
    await getCategoryAccess('user_video_access');
    
    // Count distribution of categories per user
    const distributionCount: Record<number, number> = {};
    
    Object.values(userCategoryCount).forEach(categorySet => {
      const count = categorySet.size;
      distributionCount[count] = (distributionCount[count] || 0) + 1;
    });
    
    console.log('Distribution count:', distributionCount);
    
    // Format for display
    const distribution = Object.entries(distributionCount)
      .map(([categoryCount, userCount]) => ({
        categories: parseInt(categoryCount),
        users: userCount
      }))
      .sort((a, b) => a.categories - b.categories);
    
    console.log('Final distribution:', distribution);
    
    return distribution.length > 0 ? distribution : [{ categories: 0, users: userIds.length }];
  } catch (error) {
    console.error("Error getting user category distribution:", error);
    return [{ categories: 0, users: 0 }];
  }
}

/**
 * Get available months that have user data
 */
async function getAvailableMonths() {
  try {
    // Get all distinct year-month combinations where users were registered
    const result = await db.execute(sql`
      SELECT DISTINCT 
        EXTRACT(YEAR FROM "created_at") as year,
        EXTRACT(MONTH FROM "created_at") as month
      FROM 
        users
      ORDER BY 
        year DESC, month DESC
    `);
    
    // Format months as "May 2025"
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // If there's no data, return current month
    if (!result.length) {
      const now = new Date();
      return [`${monthNames[now.getMonth()]} ${now.getFullYear()}`];
    }
    
    return result.map(row => {
      if (row && typeof row === 'object' && 'year' in row && 'month' in row) {
        const year = parseInt(String(row.year));
        const month = parseInt(String(row.month));
        return `${monthNames[month-1]} ${year}`;
      }
      return null;
    }).filter(Boolean);
  } catch (error) {
    console.error("Error getting available months:", error);
    // Return current month in case of error
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return [`${monthNames[now.getMonth()]} ${now.getFullYear()}`];
  }
}
