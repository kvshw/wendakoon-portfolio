-- Content & Social Engine schema
-- Run via Supabase SQL editor or: supabase db push

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE post_status AS ENUM ('draft', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE linkedin_status AS ENUM ('draft', 'ready', 'posted');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  status post_status NOT NULL DEFAULT 'draft',
  author_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS linkedin_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  status linkedin_status NOT NULL DEFAULT 'draft',
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS posts_status_created_at_idx
  ON posts (status, created_at DESC);

CREATE INDEX IF NOT EXISTS linkedin_posts_status_created_at_idx
  ON linkedin_posts (status, created_at DESC);

CREATE INDEX IF NOT EXISTS linkedin_posts_post_id_idx
  ON linkedin_posts (post_id);

-- RLS: deny all by default; server uses service role key
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_posts ENABLE ROW LEVEL SECURITY;

-- Public read for approved blog posts (optional feed)
DROP POLICY IF EXISTS posts_public_read_approved ON posts;
CREATE POLICY posts_public_read_approved ON posts
  FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS linkedin_posts_deny_all ON linkedin_posts;
CREATE POLICY linkedin_posts_deny_all ON linkedin_posts
  FOR ALL
  USING (false);
