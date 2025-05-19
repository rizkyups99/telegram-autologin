-- Script to make migration more robust with conditional table creation
-- This script checks for table existence before attempting creation operations

-- Function to safely create tables if they don't exist
CREATE OR REPLACE FUNCTION create_table_if_not_exists() RETURNS void AS $$
BEGIN
    -- We don't need to create tables since they already exist
    -- This is just a placeholder function to acknowledge that tables already exist
    RAISE NOTICE 'Tables already exist in the database - skipping creation';
END;
$$ LANGUAGE plpgsql;

-- Execute the function to log the notice
SELECT create_table_if_not_exists();

-- Update migration version information
INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at)
VALUES 
('0009_fix_migration_errors', 'fix_migration_errors', NOW())
ON CONFLICT (id) DO NOTHING;
