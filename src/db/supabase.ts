import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvcGJmbm1vaWZ6ZHp2eGl0enBhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI5MjUyNSwiZXhwIjoyMDYyODY4NTI1fQ.GrSXb_o8pYOJU02NamsKvGu5N2pekSUB-v3H5vOS5PQ";

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: fetch,
  }
});

// Create an admin client with service role key that bypasses RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
  global: {
    fetch: fetch,
  }
});

// Initialize storage buckets if needed
export async function createStorageBuckets() {
  try {
    console.log("Starting bucket creation/verification process...");
    
    // First, check which buckets already exist (using admin client to bypass RLS)
    const { data: existingBuckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing storage buckets:', listError);
      
      // Don't throw, continue with creation attempt even if listing fails
      console.log("Will attempt to create buckets anyway...");
    }
    
    const existingBucketNames = existingBuckets?.map(b => b.name) || [];
    console.log("Existing buckets:", existingBucketNames);
    
    // Helper function to create bucket if it doesn't exist
    const createBucketIfNeeded = async (bucketName: string, options: { public: boolean, fileSizeLimit: number }) => {
      // Always attempt to create bucket regardless of whether we think it exists
      // This ensures we don't miss any due to errors in listing buckets
      try {
        console.log(`Creating/ensuring bucket exists: ${bucketName}`);
        const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, options);
        
        if (error) {
          // If bucket already exists, this is actually success
          if (error.message?.includes('already exists')) {
            console.log(`Bucket ${bucketName} already exists, continuing...`);
            return { data: null, error: null, created: false };
          }
          
          console.error(`Error creating ${bucketName} bucket:`, error);
          return { data, error, created: false };
        }
        
        console.log(`Successfully created bucket: ${bucketName}`);
        
        // Set bucket to public
        try {
          // Update bucket to be public
          await supabaseAdmin.storage.updateBucket(bucketName, {
            public: true
          });
          console.log(`Made bucket ${bucketName} public`);
        } catch (publicError) {
          console.warn(`Warning: Could not update ${bucketName} bucket to public:`, publicError);
        }
        
        return { data, error: null, created: true };
      } catch (creationError) {
        console.error(`Unexpected error creating bucket ${bucketName}:`, creationError);
        return { data: null, error: creationError, created: false };
      }
    };
    
    console.log("Creating the pdf-covers bucket...");
    const pdfCoversResult = await createBucketIfNeeded(
      'pdf-covers',
      { public: true, fileSizeLimit: 10485760 } // 10MB limit for images
    );
    
    console.log("Creating the pdf-files bucket...");
    const pdfFilesResult = await createBucketIfNeeded(
      'pdf-files',
      { public: true, fileSizeLimit: 104857600 } // 100MB limit for PDFs
    );
    
    console.log("Creating the audio-mp3 bucket...");
    const audioMp3Result = await createBucketIfNeeded(
      'audio-mp3',
      { public: true, fileSizeLimit: 314572800 } // 300MB limit for audio files
    );
    
    console.log("All bucket creation attempts completed");
    
    // Return results
    return { 
      pdfCovers: pdfCoversResult.data, 
      pdfFiles: pdfFilesResult.data, 
      audioMp3: audioMp3Result.data 
    };
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
    
    // Don't throw error - return null instead so calling code can continue
    return {
      pdfCovers: null,
      pdfFiles: null,
      audioMp3: null,
      error
    };
  }
}

// Do not automatically call createStorageBuckets() here
// Only call it explicitly from API routes when needed
