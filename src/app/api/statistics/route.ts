import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, admins } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') ? parseInt(searchParams.get('year') as string) : new Date().getFullYear();
    const month = searchParams.get('month') ? parseInt(searchParams.get('month') as string) : new Date().getMonth() + 1;
    
    // Query actual user data from the database
    const monthlyData = await getMonthlyUserCounts(year);
    const dailyRegistrations = await getDailyRegistrationsPerAdmin(year, month);
    const availableMonths = await getAvailableMonths();

    return NextResponse.json({
      monthlyData,
      dailyRegistrations,
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
 * Get daily registrations per admin for a specific month
 */
async function getDailyRegistrationsPerAdmin(year: number, month: number) {
  try {
    // Get list of admins
    const adminsList = await db.select({
      id: admins.id,
      email: admins.email
    }).from(admins);
    
    // Special case for superadmin who might not be in the database
    const hasSuperAdmin = adminsList.some(admin => admin.email === 'superadmin@admin.com');
    if (!hasSuperAdmin) {
      adminsList.push({ id: 0, email: 'superadmin@admin.com' });
    }
    
    // Get the number of days in the selected month
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Get user registrations for the month grouped by day and adminId
    const registrations = await db.execute(sql`
      SELECT 
        EXTRACT(DAY FROM "created_at") as day,
        COALESCE(admin_id, 0) as admin_id,
        COUNT(*) as count
      FROM 
        users
      WHERE 
        EXTRACT(YEAR FROM "created_at") = ${year}
        AND EXTRACT(MONTH FROM "created_at") = ${month}
      GROUP BY 
        EXTRACT(DAY FROM "created_at"),
        admin_id
      ORDER BY 
        day
    `);
    
    // Process the results into the required format
    const adminRegistrations = adminsList.map(admin => {
      // Initialize admin registration object with zeroes for all days
      const adminReg: Record<string | number, any> = {
        admin: admin.email.split('@')[0], // Just use the part before @ as the display name
        total: 0
      };
      
      // Initialize all days with 0
      for (let day = 1; day <= daysInMonth; day++) {
        adminReg[day] = 0;
      }
      
      // Fill in the actual registration counts
      registrations.forEach(row => {
        if (row && typeof row === 'object' && 
            'day' in row && 
            'admin_id' in row && 
            'count' in row && 
            parseInt(String(row.admin_id)) === admin.id) {
          
          const day = parseInt(String(row.day));
          const count = parseInt(String(row.count));
          adminReg[day] = count;
          adminReg.total += count;
        }
      });
      
      return adminReg;
    });
    
    // Filter out admins with no registrations
    return adminRegistrations.filter(admin => admin.total > 0);
  } catch (error) {
    console.error("Error getting daily registrations per admin:", error);
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
