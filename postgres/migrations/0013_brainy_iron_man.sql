-- Custom SQL migration file, put your code below! ---- Create audio_cloud_files table
CREATE TABLE IF NOT EXISTS "audio_cloud_files" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "file_url" TEXT NOT NULL,
  "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create pdf_cloud_files table
CREATE TABLE IF NOT EXISTS "pdf_cloud_files" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "cover_url" TEXT NOT NULL,
  "file_url" TEXT NOT NULL,
  "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create file_cloud_files table
CREATE TABLE IF NOT EXISTS "file_cloud_files" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "cover_url" TEXT NOT NULL,
  "file_url" TEXT NOT NULL,
  "file_type" TEXT,
  "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
