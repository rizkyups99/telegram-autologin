-- Check if audios table exists first
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'audios'
    ) THEN
        -- Create audios table if it doesn't exist
        CREATE TABLE audios (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          file_url TEXT NOT NULL,
          category_id INTEGER NOT NULL REFERENCES categories(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );

        -- Create index
        CREATE INDEX IF NOT EXISTS audios_category_id_idx ON audios(category_id);
        
        RAISE NOTICE 'Created audios table and index';
    ELSE
        RAISE NOTICE 'Audios table already exists, skipping creation';
    END IF;
END $$;

-- Check if the table now exists (for logging purposes)
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'audios'
) AS table_exists;
