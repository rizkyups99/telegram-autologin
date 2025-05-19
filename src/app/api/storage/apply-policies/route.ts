import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/db/supabase";

// Function to apply proper RLS policies to each bucket
export async function POST(request: Request) {
  try {
    const { buckets } = await request.json();
    const results: Record<string, any> = {};
    
    for (const bucket of buckets) {
      try {
        // Apply a permissive policy to allow all authenticated operations
        const { error } = await supabaseAdmin.rpc('apply_storage_policy', {
          bucket_name: bucket,
          policy_name: 'allow_all_access',
          definition: 'true',
          policy_operations: ['SELECT', 'INSERT', 'UPDATE', 'DELETE']
        });
        
        results[bucket] = {
          success: !error,
          error: error ? error.message : null
        };
        
      } catch (bucketError) {
        console.error(`Error applying policy to ${bucket}:`, bucketError);
        results[bucket] = {
          success: false,
          error: bucketError instanceof Error ? bucketError.message : String(bucketError)
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Error applying storage policies:", error);
    return NextResponse.json(
      { error: "Failed to apply storage policies" },
      { status: 500 }
    );
  }
}
