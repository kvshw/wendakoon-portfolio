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

Manual trigger:

```bash
curl -X POST https://your-domain.com/api/cron/generate \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 5. Admin dashboard

Visit `/admin/content-engine` after signing in with an allowlisted email.
