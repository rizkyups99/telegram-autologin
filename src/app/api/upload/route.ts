import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/db/supabase";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '350mb', // Increased to 350MB to handle 300MB files plus overhead
  },
};

export async function POST(request: Request) {
  try {
    console.log("API upload route: Initializing storage buckets");
    
    // Get form data to check which bucket is needed
    const formData = await request.formData().catch(() => null);
    const preset = formData?.get('preset') as string;
    
    // Map preset to bucket name
    let bucketName = null;
    if (preset === 'pdf_covers') bucketName = 'pdf-covers';
    else if (preset === 'pdf_files') bucketName = 'pdf-files';
    else if (preset === 'audio_mp3') bucketName = 'audio-mp3';
    
    // Initialize Supabase storage buckets with special attention to the required bucket
    if (bucketName) {
      console.log(`API upload route: Creating specific bucket ${bucketName} for preset ${preset}`);
      
      try {
        // Make three attempts to create the specific bucket
        for (let attempt = 1; attempt <= 3; attempt++) {
          console.log(`API upload route: Attempt ${attempt} to create bucket ${bucketName}`);
          
          const { error } = await supabaseAdmin.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: bucketName === 'audio-mp3' ? 314572800 : 
                          bucketName === 'pdf-files' ? 104857600 : 10485760
          });
          
          if (!error || error.message?.includes('already exists')) {
            console.log(`API upload route: Bucket ${bucketName} created or already exists`);
            break;
          } else {
            console.warn(`API upload route: Error creating bucket ${bucketName} (attempt ${attempt}):`, error);
            if (attempt === 3) {
              console.error(`API upload route: All attempts failed for bucket ${bucketName}`);
            } else {
              // Wait before next attempt
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
        }
      } catch (bucketError) {
        console.error(`API upload route: Exception creating bucket ${bucketName}:`, bucketError);
      }
    } else {
      // If no specific bucket was identified, just check if they exist
      console.log("API upload route: No specific bucket identified, skipping bucket creation");
    }
    
    // Return success regardless of errors to allow client to try upload
    return NextResponse.json({ 
      success: true, 
      message: `Storage bucket ${bucketName || 'initialization'} attempted. Please proceed with upload.`,
      bucket: bucketName
    });
    
  } catch (error) {
    console.error("API upload route: Error initializing storage:", error);
    // Still return success to allow client to try upload
    return NextResponse.json({ 
      success: true, 
      message: "Storage initialization attempted despite errors. Please try upload anyway.",
      warning: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
