import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/db/supabase";
import { supabase } from "@/db/supabase";

export async function GET() {
  try {
    // Skip bucket creation attempts since buckets already exist manually
    console.log("API route: Checking existing storage buckets");
    
    // Just verify buckets exist and report their status
    const { data: bucketList, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error("API route: Error listing buckets:", listError);
      return NextResponse.json(
        { 
          error: "Failed to list buckets. This could be due to RLS policies.", 
          details: listError.message
        },
        { status: 200 } // Return 200 to not block client upload attempts
      );
    }
    
    // Confirm which buckets are available
    const availableBuckets = bucketList?.map(bucket => ({
      name: bucket.name,
      id: bucket.id,
      public: bucket.public || false
    })) || [];
    
    const requiredBuckets = ['pdf-covers', 'pdf-files', 'audio-mp3'];
    const missingBuckets = requiredBuckets.filter(name => 
      !availableBuckets.some(bucket => bucket.name === name)
    );
    
    console.log(`API route: Bucket status: Available: ${availableBuckets.map(b => b.name).join(', ')}`);
    if (missingBuckets.length > 0) {
      console.log(`API route: Missing buckets: ${missingBuckets.join(', ')}`);
    }
    
    return NextResponse.json({
      success: true,
      message: "Storage buckets verified",
      availableBuckets,
      missingBuckets,
      rls_note: "If uploads fail, ensure proper RLS policies are set in Supabase"
    });
  } catch (error) {
    console.error("API route: Error verifying storage buckets:", error);
    return NextResponse.json(
      { 
        error: "Failed to verify storage buckets, but uploads may still work", 
        details: error instanceof Error ? error.message : String(error),
        suggestion: "Ensure RLS policies are properly configured in the Supabase dashboard"
      },
      { status: 200 } // Return 200 to not block client upload attempts
    );
  }
}

// Also support POST requests with optional bucket parameter
export async function POST(request: Request) {
  try {
    // Just return bucket verification info regardless of POST body
    return GET();
  } catch (error) {
    console.error("API route POST: Error handling request:", error);
    return NextResponse.json({
      success: false,
      message: "Error handling storage verification request",
      error: error instanceof Error ? error.message : String(error),
      suggestion: "Ensure RLS policies are properly configured in the Supabase dashboard"
    }, { status: 200 });
  }
}
