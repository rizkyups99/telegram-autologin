-- Create user_audio_access table if it doesn't exist
CREATE TABLE IF NOT EXISTS "user_audio_access" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
  UNIQUE("user_id", "category_id")
);

-- Create user_pdf_access table if it doesn't exist
CREATE TABLE IF NOT EXISTS "user_pdf_access" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
  UNIQUE("user_id", "category_id")
);

-- Create user_video_access table if it doesn't exist
CREATE TABLE IF NOT EXISTS "user_video_access" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "category_id" INTEGER NOT NULL REFERENCES "categories"("id"),
  UNIQUE("user_id", "category_id")
);
