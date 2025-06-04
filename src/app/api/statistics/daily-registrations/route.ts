import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
    
    console.log(`Getting daily user registrations for ${year}-${month}`);
    
    // Get daily user registration counts for the specified month/year
    const dailyRegistrations = await db.execute(sql`
      WITH date_series AS (
        SELECT generate_series(
          DATE_TRUNC('month', DATE(${year} || '-' || ${month} || '-01')),
          DATE_TRUNC('month', DATE(${year} || '-' || ${month} || '-01')) + INTERVAL '1 month' - INTERVAL '1 day',
          '1 day'::interval
        )::date as day
      )
      SELECT 
        TO_CHAR(ds.day, 'DD') as day,
        TO_CHAR(ds.day, 'YYYY-MM-DD') as full_date,
        COALESCE(user_counts.count, 0) as registrations
      FROM date_series ds
      LEFT JOIN (
        SELECT 
          DATE(created_at) as registration_date,
          COUNT(*) as count
        FROM users
        WHERE EXTRACT(YEAR FROM created_at) = ${year}
        AND EXTRACT(MONTH FROM created_at) = ${month}
        GROUP BY DATE(created_at)
      ) user_counts ON ds.day = user_counts.registration_date
      ORDER BY ds.day
    `);
    
    console.log('Raw daily registration data:', dailyRegistrations);
    
    // Transform the data for better frontend consumption
    const dailyData = (dailyRegistrations as any[]).map(row => ({
      day: String(row.day),
      fullDate: String(row.full_date),
      registrations: parseInt(String(row.registrations))
    }));
    
    console.log('Transformed daily registration data:', dailyData);
    
    return NextResponse.json(dailyData);
  } catch (error) {
    console.error("Error fetching daily user registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily user registrations" },
      { status: 500 }
    );
  }
}
