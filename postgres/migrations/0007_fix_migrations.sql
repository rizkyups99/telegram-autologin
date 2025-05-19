-- Consolidated migration to fix table order and dependencies

-- First, create the schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS drizzle;

-- Create migrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
  id VARCHAR(255) PRIMARY KEY,
  hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the extensions
CREATE EXTENSION IF NOT EXISTS pg_graphql;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop tables in reverse dependency order to avoid constraint violations
DROP TABLE IF EXISTS telegram_logs CASCADE;
DROP TABLE IF EXISTS telegram_messages CASCADE;
DROP TABLE IF EXISTS telegram_settings CASCADE;
DROP TABLE IF EXISTS pdfs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table first (since pdfs references it)
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  access_code TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create PDFs table with reference to categories
CREATE TABLE pdfs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  file_url TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add index on category_id for faster joins
CREATE INDEX pdfs_category_id_idx ON pdfs(category_id);

-- Create Telegram messages table
CREATE TABLE telegram_messages (
  id SERIAL PRIMARY KEY,
  message_id TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  phone_number TEXT,
  customer_name TEXT,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create Telegram logs table
CREATE TABLE telegram_logs (
  id SERIAL PRIMARY KEY,
  message_id TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  forwarded BOOLEAN DEFAULT FALSE,
  keyword TEXT,
  error TEXT
);

-- Create Telegram settings table
CREATE TABLE telegram_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add this migration to the tracking table
INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at)
VALUES ('0007_fix_migrations', 'consolidated-migration-fix-hash', NOW())
ON CONFLICT (id) DO NOTHING;
