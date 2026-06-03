-- Allow Supabase service-role clients full CMS access.
-- Direct `postgres` connections bypass RLS; public read stays on posts_public_read_approved.

DROP POLICY IF EXISTS posts_service_role_all ON posts;
CREATE POLICY posts_service_role_all ON posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
