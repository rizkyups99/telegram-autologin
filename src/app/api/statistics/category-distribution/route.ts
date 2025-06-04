import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
    
    console.log(`Getting category distribution for ${year}-${month}`);
    
    // Get user category distribution for the specified month/year
    const categoryDistribution = await db.execute(sql`
      WITH user_category_counts AS (
        SELECT 
          u.id as user_id,
          COALESCE(audio_count, 0) + COALESCE(pdf_count, 0) + COALESCE(video_count, 0) as total_categories
        FROM users u
        LEFT JOIN (
          SELECT user_id, COUNT(*) as audio_count
          FROM user_audio_access
          GROUP BY user_id
        ) audio ON u.id = audio.user_id
        LEFT JOIN (
          SELECT user_id, COUNT(*) as pdf_count
          FROM user_pdf_access
          GROUP BY user_id
        ) pdf ON u.id = pdf.user_id
        LEFT JOIN (
          SELECT user_id, COUNT(*) as video_count
          FROM user_video_access
          GROUP BY user_id
        ) video ON u.id = video.user_id
        WHERE EXTRACT(YEAR FROM u.created_at) = ${year}
        AND EXTRACT(MONTH FROM u.created_at) = ${month}
      )
      SELECT 
        total_categories,
        COUNT(*) as user_count
      FROM user_category_counts
      GROUP BY total_categories
      ORDER BY total_categories
    `);
    
    console.log('Raw distribution data:', categoryDistribution);
    
    // Transform the data for better frontend consumption
    const distributionData = (categoryDistribution as any[]).map(row => ({
      categories: parseInt(String(row.total_categories)),
      users: parseInt(String(row.user_count))
    }));
    
    console.log('Transformed distribution data:', distributionData);
    
    return NextResponse.json(distributionData);
  } catch (error) {
    console.error("Error fetching category distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch category distribution" },
      { status: 500 }
    );
  }
}
