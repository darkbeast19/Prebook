-- Run this in your Supabase SQL Editor
-- Prebook Holidays – Full Schema + Migration

-- ================================================================
-- 1. Create Enquiries Table
-- ================================================================
CREATE TABLE IF NOT EXISTS public.enquiries (
    id SERIAL PRIMARY KEY,
    name TEXT,
    phone TEXT,
    email TEXT,
    package TEXT,
    travellers TEXT,
    type TEXT,
    message TEXT,
    status TEXT DEFAULT 'New',
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ================================================================
-- 2. Create Packages Table (includes discount columns)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.packages (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    nights INTEGER,
    days INTEGER,
    price INTEGER,
    badge TEXT,
    rating NUMERIC,
    reviews INTEGER,
    places TEXT,
    img TEXT,
    discount_price INTEGER,
    discount_label TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ================================================================
-- 3. Create Settings Table
-- ================================================================
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY,
    content JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ================================================================
-- 4. Enable Row Level Security (RLS) on all tables
-- ================================================================
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings  ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- 5. RLS Policies – Enquiries
-- NOTE: For production, restrict INSERT/UPDATE/DELETE to auth users.
-- ================================================================
CREATE POLICY "Allow public read access on enquiries"
  ON public.enquiries FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert access on enquiries"
  ON public.enquiries FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update access on enquiries"
  ON public.enquiries FOR UPDATE TO public USING (true);

CREATE POLICY "Allow public delete access on enquiries"
  ON public.enquiries FOR DELETE TO public USING (true);

-- ================================================================
-- 6. RLS Policies – Packages
-- ================================================================
CREATE POLICY "Allow public read access on packages"
  ON public.packages FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert access on packages"
  ON public.packages FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update access on packages"
  ON public.packages FOR UPDATE TO public USING (true);

CREATE POLICY "Allow public delete access on packages"
  ON public.packages FOR DELETE TO public USING (true);

-- ================================================================
-- 7. RLS Policies – Settings
-- ================================================================
CREATE POLICY "Allow public read on settings"
  ON public.settings FOR SELECT TO public USING (true);

CREATE POLICY "Allow public write on settings"
  ON public.settings FOR ALL TO public USING (true) WITH CHECK (true);

-- ================================================================
-- MIGRATION (safe to re-run):
-- If your packages table existed BEFORE the discount feature,
-- run these two lines to add the missing columns.
-- ================================================================
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS discount_price INTEGER;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS discount_label TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS map_embed TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS inclusions TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS exclusions TEXT;
