import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  profilePic: text("profile_pic"),
  verified: boolean("verified").default(false),
  communityPoints: real("community_points").default(0),
  role: text("role").default("user"), // 'user', 'authority', 'volunteer'
  organizationId: text("organization_id"), // For authorities and volunteers
  jurisdiction: text("jurisdiction"), // Geographic area for authorities
});

export const hazardReports = pgTable("hazard_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  username: text("username").notNull(),
  description: text("description").notNull(),
  media: text("media"), // URL or path to uploaded media
  mediaType: text("media_type"), // 'image' or 'video'
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  location: text("location"), // Human readable location
  geoTagged: boolean("geo_tagged").default(true), // Auto geo-tagged or manual
  verified: boolean("verified").default(false),
  riskLevel: text("risk_level").default("medium"), // 'low', 'medium', 'high', 'critical'
  urgencyScore: real("urgency_score").default(5), // 1-10 scale
  trustScore: real("trust_score").default(5), // 1-10 scale based on user history and verification
  likes: real("likes").default(0),
  comments: real("comments").default(0),
  assignedVolunteers: text("assigned_volunteers").array(), // Array of volunteer user IDs
  authorityReviewed: boolean("authority_reviewed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialPosts = pgTable("social_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(), // 'twitter', 'youtube', 'reddit'
  username: text("username").notNull(),
  description: text("description").notNull(),
  media: text("media"),
  sentiment: text("sentiment").notNull(), // 'positive', 'neutral', 'negative', 'alert'
  latitude: real("latitude"), // Optional geo-tagging for social posts
  longitude: real("longitude"),
  location: text("location"),
  geoTagged: boolean("geo_tagged").default(false),
  trustScore: real("trust_score").default(5), // Trust score based on source credibility
  urgencyScore: real("urgency_score").default(3), // Urgency based on content analysis
  likes: real("likes").default(0),
  shares: real("shares").default(0),
  comments: real("comments").default(0),
  views: real("views"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertHazardReportSchema = createInsertSchema(hazardReports).omit({
  id: true,
  createdAt: true,
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertHazardReport = z.infer<typeof insertHazardReportSchema>;
export type HazardReport = typeof hazardReports.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type SocialPost = typeof socialPosts.$inferSelect;
