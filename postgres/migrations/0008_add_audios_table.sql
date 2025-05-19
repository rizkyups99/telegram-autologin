-- Create audios table if not exists
CREATE TABLE IF NOT EXISTS audios (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index on category_id for faster joins
CREATE INDEX IF NOT EXISTS audios_category_id_idx ON audios(category_id);

-- Check if the table exists by selecting one record - used for debugging
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'audios'
) AS table_exists;
