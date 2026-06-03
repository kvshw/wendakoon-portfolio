-- Admin CMS: extend posts, add site_content and site_metadata

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS excerpt text,
  ADD COLUMN IF NOT EXISTS cover_image text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS site_content_section_key_idx
  ON site_content (section, key);

CREATE INDEX IF NOT EXISTS site_content_section_idx ON site_content (section);

CREATE TABLE IF NOT EXISTS site_metadata (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_metadata ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS site_content_deny_all ON site_content;
CREATE POLICY site_content_deny_all ON site_content FOR ALL USING (false);

DROP POLICY IF EXISTS site_metadata_deny_all ON site_metadata;
CREATE POLICY site_metadata_deny_all ON site_metadata FOR ALL USING (false);
