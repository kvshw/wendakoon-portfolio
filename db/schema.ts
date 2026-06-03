import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  pgEnum,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "approved",
  "rejected",
]);

export const linkedinStatusEnum = pgEnum("linkedin_status", [
  "draft",
  "ready",
  "posted",
]);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    summary: text("summary").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    coverImage: text("cover_image"),
    tags: text("tags").array(),
    status: postStatusEnum("status").notNull().default("draft"),
    authorId: text("author_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (table) => [
    index("posts_status_created_at_idx").on(table.status, table.createdAt),
  ]
);

export const linkedinPosts = pgTable(
  "linkedin_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id").references(() => posts.id, {
      onDelete: "set null",
    }),
    content: text("content").notNull(),
    status: linkedinStatusEnum("status").notNull().default("draft"),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("linkedin_posts_status_created_at_idx").on(
      table.status,
      table.createdAt
    ),
    index("linkedin_posts_post_id_idx").on(table.postId),
  ]
);

export const siteContent = pgTable(
  "site_content",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    section: text("section").notNull(),
    key: text("key").notNull(),
    value: jsonb("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("site_content_section_key_idx").on(table.section, table.key),
    index("site_content_section_idx").on(table.section),
  ]
);

export const siteMetadata = pgTable("site_metadata", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type LinkedinPost = typeof linkedinPosts.$inferSelect;
export type NewLinkedinPost = typeof linkedinPosts.$inferInsert;
export type SiteContent = typeof siteContent.$inferSelect;
export type SiteMetadata = typeof siteMetadata.$inferSelect;
