-- Drop table if exists to avoid errors on recreation
DROP TABLE IF EXISTS pdfs;

-- Create PDFs table
CREATE TABLE pdfs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  file_url TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index on category_id for faster joins
CREATE INDEX pdfs_category_id_idx ON pdfs(category_id);

-- Add the table to the migration tracking
INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at)
VALUES ('0006_create_pdfs_table', 'e47d508f-6e4d-5c92-a5c9-6e7f3424dfd9', NOW());
