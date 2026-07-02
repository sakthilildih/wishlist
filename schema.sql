-- SQL to create the waitlist table in Supabase
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ngcqgvqfvqfnkdvwrppu/sql/new

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  topic TEXT NOT NULL,
  source TEXT DEFAULT 'waitlist_page',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
