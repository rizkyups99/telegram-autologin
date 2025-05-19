-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS pg_graphql;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable realtime subscriptions on the pdfs table
ALTER PUBLICATION supabase_realtime ADD TABLE pdfs;

-- Add realtime capabilities to the categories table
ALTER PUBLICATION supabase_realtime ADD TABLE categories;

-- This is needed for Supabase real-time features
COMMENT ON TABLE pdfs IS 'PDF ebooks with real-time subscription capabilities';
COMMENT ON TABLE categories IS 'Categories with real-time subscription capabilities';
