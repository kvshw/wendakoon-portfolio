#!/usr/bin/env node
import { readFileSync } from "fs";
import { execSync } from "child_process";
import { randomBytes } from "crypto";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const prodUrl = process.env.PROD_URL ?? "https://wendakoon.vercel.app";
const cronSecret = process.env.CRON_SECRET ?? randomBytes(32).toString("hex");

const raw = readFileSync(join(root, ".env.local"), "utf8");
const values = {};

for (const line of raw.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  values[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1);
}

values.NEXT_PUBLIC_APP_URL = prodUrl;
values.SUPABASE_URL = (values.SUPABASE_URL ?? "").replace(/\/$/, "");
values.CRON_SECRET = cronSecret;

const vars = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL",
  "ADMIN_EMAILS",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "ANTHROPIC_API_KEY",
  "CRON_SECRET",
  "RESEND_API_KEY",
  "NOTIFY_TO_EMAIL",
  "NOTIFY_FROM_EMAIL",
  "NEXT_PUBLIC_APP_URL",
];

const targets = (process.env.VERCEL_ENV_TARGETS ?? "production")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

for (const name of vars) {
  const value = values[name];
  if (!value) continue;
  console.log(`==> ${name}`);
  for (const target of targets) {
    execSync(
      `npx vercel env add ${JSON.stringify(name)} ${target} --value ${JSON.stringify(value)} --yes --sensitive --force`,
      { cwd: root, stdio: "inherit" }
    );
  }
}

execSync("npx vercel env ls", { cwd: root, stdio: "inherit" });
