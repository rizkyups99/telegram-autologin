-- Custom SQL migration file, put your code below! ---- Migration file created manually to address drizzle-kit issues
-- This migration focuses on adding any missing indexes to our tables

-- Add indexes to user_audio_access table if not already created by previous migrations
CREATE INDEX IF NOT EXISTS "idx_user_audio_access_user_id" ON "user_audio_access" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_audio_access_category_id" ON "user_audio_access" ("category_id");

-- Add indexes to user_pdf_access table if not already created
CREATE INDEX IF NOT EXISTS "idx_user_pdf_access_user_id" ON "user_pdf_access" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_pdf_access_category_id" ON "user_pdf_access" ("category_id");

-- Add indexes to user_video_access table if not already created
CREATE INDEX IF NOT EXISTS "idx_user_video_access_user_id" ON "user_video_access" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_video_access_category_id" ON "user_video_access" ("category_id");

-- Add any other optimizations as needed
CREATE INDEX IF NOT EXISTS "idx_audio_cloud_files_category_id" ON "audio_cloud_files" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_pdf_cloud_files_category_id" ON "pdf_cloud_files" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_file_cloud_files_category_id" ON "file_cloud_files" ("category_id");
