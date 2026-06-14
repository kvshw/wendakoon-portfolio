# Content & Social Engine, Setup

## 1. Environment variables

Copy `.env.example` to `.env.local` and fill in all values.

## 2. Database migration

Run the SQL migration in Supabase SQL Editor:

`supabase/migrations/001_content_engine.sql`

Or with Drizzle (requires `DATABASE_URL`):

```bash
npm run db:push
```

## 3. Clerk

1. Create a Clerk application at https://dashboard.clerk.com
2. Add keys to `.env.local`
3. Set `ADMIN_EMAILS` to your sign-in email (comma-separated for multiple admins)

## 4. Cron (Vercel)

`vercel.json` schedules generation Mon/Thu 09:00 UTC. Vercel automatically sends `Authorization: Bearer <CRON_SECRET>` when `CRON_SECRET` is set in project env.

Manual trigger from the admin UI (**Generate now** on `/admin/content-engine`) or via curl:

```bash
curl -X POST https://your-domain.com/api/cron/generate \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 5. Admin dashboard

Visit `/admin/content-engine` after signing in with an allowlisted email.

The content engine:
- Synthesizes recent AI news (Google News RSS) with your research profile when generating drafts
- Mixes work-related topics (~65%) with broader AI industry themes (~35%)
- Provides SEO scoring, search preview, slug/tags editing, and markdown editor with live preview
- Lets you copy, save, and track LinkedIn post variations (draft → ready → posted)
- Auto-generates a high-resolution cover per post (1200×630 PNG; DALL-E 3 HD if `OPENAI_API_KEY` is set)
