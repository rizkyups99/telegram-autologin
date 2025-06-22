-- Custom SQL migration file, put your code below! ---- Create PDF Cloud Files table
CREATE TABLE IF NOT EXISTS "pdf_cloud_files" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "cover_url" TEXT NOT NULL,
  "file_url" TEXT NOT NULL,
  "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create Audio Cloud Files table
CREATE TABLE IF NOT EXISTS "audio_cloud_files" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "file_url" TEXT NOT NULL,
  "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create File Cloud Files table
CREATE TABLE IF NOT EXISTS "file_cloud_files" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "cover_url" TEXT NOT NULL,
  "file_url" TEXT NOT NULL,
  "file_type" TEXT,
  "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_pdf_cloud_files_category_id" ON "pdf_cloud_files" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_audio_cloud_files_category_id" ON "audio_cloud_files" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_file_cloud_files_category_id" ON "file_cloud_files" ("category_id");
