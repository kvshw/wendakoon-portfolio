/**
 * Creates the contact_messages table (and its enum + index) if they don't
 * already exist. Additive and idempotent — safe to run multiple times.
 *
 * Run from the project root:
 *   npx tsx --env-file=.env.local scripts/migrate-messages.ts
 */

import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set.");
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { prepare: false });

async function main() {
  console.log("Applying contact_messages migration…");

  await sql`
    DO $$ BEGIN
      CREATE TYPE message_status AS ENUM ('new', 'read', 'archived');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL,
      context text,
      message text NOT NULL,
      consent boolean NOT NULL DEFAULT false,
      status message_status NOT NULL DEFAULT 'new',
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS contact_messages_status_created_at_idx
      ON contact_messages (status, created_at);
  `;

  console.log("✅  contact_messages table is ready.");
}

main()
  .then(() => sql.end())
  .catch(async (err) => {
    console.error("❌  Migration failed:", err);
    await sql.end();
    process.exit(1);
  });
