import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase, supabaseAdmin } from "@/db/supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to check if a bucket exists
export async function checkStorageBucket(bucket: 'pdf-covers' | 'pdf-files' | 'audio-mp3') {
  try {
    console.log(`Checking if ${bucket} bucket exists and is accessible...`);
    
    // Use admin client to bypass RLS when checking bucket
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .list('', { limit: 1 });
    
    if (error) {
      console.warn(`Warning: Cannot access bucket ${bucket}:`, error);
      return false;
    }
    
    console.log(`Successfully verified access to ${bucket} bucket`);
    return true;
  } catch (error) {
    console.error(`Error checking bucket ${bucket}:`, error);
    return false;
  }
}

// Function to get helpful instructions for RLS policies
export function getSupabaseRLSInstructions() {
  return `
To manually fix Storage Row Level Security (RLS) policy issues in Supabase:

1. Login to Supabase Dashboard (https://supabase.com/dashboard)
2. Go to "Storage" section
3. Select the bucket (pdf-covers, pdf-files, audio-mp3, or mediaijl)
4. Click "Policies" tab
5. Create a new policy with these settings:
   - Name: "Allow authenticated uploads"
   - Allowed operations: SELECT, INSERT, UPDATE, DELETE
   - Policy definition: true
   - Policy check: true

Alternatively, run this SQL in the SQL Editor:

-- For pdf-covers bucket
CREATE POLICY "allow_all_access_pdf_covers" ON "storage"."objects"
FOR ALL 
TO authenticated
USING (bucket_id = 'pdf-covers')
WITH CHECK (bucket_id = 'pdf-covers');

-- For pdf-files bucket
CREATE POLICY "allow_all_access_pdf_files" ON "storage"."objects"
FOR ALL 
TO authenticated
USING (bucket_id = 'pdf-files')
WITH CHECK (bucket_id = 'pdf-files');

-- For audio-mp3 bucket
CREATE POLICY "allow_all_access_audio_mp3" ON "storage"."objects"
FOR ALL 
TO authenticated
USING (bucket_id = 'audio-mp3')
WITH CHECK (bucket_id = 'audio-mp3');

-- For mediaijl bucket
CREATE POLICY "allow_all_access_mediaijl" ON "storage"."objects"
FOR ALL 
TO authenticated
USING (bucket_id = 'mediaijl')
WITH CHECK (bucket_id = 'mediaijl');

-- If nothing works, disable RLS completely (use with caution):
ALTER TABLE "storage"."objects" DISABLE ROW LEVEL SECURITY;
  `.trim();
}
