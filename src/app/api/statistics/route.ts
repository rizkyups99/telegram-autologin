import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, admins, categories, userAudioAccess, userPdfAccess, userVideoAccess } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') ? parseInt(searchParams.get('year') as string) : new Date().getFullYear();
    const month = searchParams.get('month') ? parseInt(searchParams.get('month') as string) : new Date().getMonth() + 1;
    
    // Query actual user data from the database
    const monthlyData = await getMonthlyUserCounts(year);
    const categorySummary = await getCategoryStatistics(year, month);
    const availableMonths = await getAvailableMonths();

    return NextResponse.json({
      monthlyData,
      categorySummary,
      availableMonths,
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
    // Get all categories first
    const categoriesList = await db.select().from(categories);
    
    // Create a map to store category counts
    const categoryCountMap: Record<number, { name: string; count: number }> = {};
    
    // Initialize counts for all categories
    categoriesList.forEach(category => {
      categoryCountMap[category.id] = {
        name: category.name,
        count: 0
      };
    });
    
    // Function to safely execute a query and process results
    const getCategoryCounts = async (query: string) => {
      try {
        const results = await db.execute(sql.raw(query));
        results.forEach((row: any) => {
          if (row && typeof row === 'object' && 'category_id' in row && 'count' in row) {
            const categoryId = parseInt(String(row.category_id));
            const count = parseInt(String(row.count));
            
            // Only add counts for categories that exist in our map
            if (categoryCountMap[categoryId]) {
              categoryCountMap[categoryId].count += count;
            }
          }
        });
      } catch (error) {
        console.error("Error executing category count query:", error);
      }
    };
    
    // Get audio category registrations for the month
    await getCategoryCounts(`
      SELECT 
        uaa.category_id, 
        COUNT(DISTINCT uaa.user_id) as count
      FROM 
        user_audio_access uaa
      JOIN 
        users u ON uaa.user_id = u.id
      WHERE 
        EXTRACT(YEAR FROM u.created_at) = ${year} 
        AND EXTRACT(MONTH FROM u.created_at) = ${month}
      GROUP BY 
        uaa.category_id
    `);
    
    // Get PDF category registrations for the month
    await getCategoryCounts(`
      SELECT 
        upa.category_id, 
        COUNT(DISTINCT upa.user_id) as count
      FROM 
        user_pdf_access upa
      JOIN 
        users u ON upa.user_id = u.id
      WHERE 
        EXTRACT(YEAR FROM u.created_at) = ${year} 
        AND EXTRACT(MONTH FROM u.created_at) = ${month}
      GROUP BY 
        upa.category_id
    `);
    
    // Get video category registrations for the month
    await getCategoryCounts(`
      SELECT 
        uva.category_id, 
        COUNT(DISTINCT uva.user_id) as count
      FROM 
        user_video_access uva
      JOIN 
        users u ON uva.user_id = u.id
      WHERE 
        EXTRACT(YEAR FROM u.created_at) = ${year} 
        AND EXTRACT(MONTH FROM u.created_at) = ${month}
      GROUP BY 
        uva.category_id
    `);
    
    // Convert the map to an array and filter out categories with 0 count
    const categoryStats = Object.values(categoryCountMap)
      .filter(category => category.count > 0)
      .sort((a, b) => b.count - a.count); // Sort by count in descending order
    
    return categoryStats;
  } catch (error) {
    console.error("Error getting category statistics:", error);
    // Return empty array in case of error
    return [];
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
