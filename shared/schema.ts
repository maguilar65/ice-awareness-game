import { pgTable, text, serial, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Content for the game - stories, facts, and scenarios
export const gameContent = pgTable("game_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(), 
  type: text("type").notNull(), // 'fact', 'story', 'scenario'
  category: text("category").notNull(), // 'rights', 'history', 'community'
  order: integer("order").default(0),
});

export const insertGameContentSchema = createInsertSchema(gameContent);
export type InsertGameContent = z.infer<typeof insertGameContentSchema>;
export type GameContent = typeof gameContent.$inferSelect;

// Simple progress tracking (optional for MVP, but good structure)
export const playerProgress = pgTable("player_progress", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  contentId: integer("content_id").notNull(),
  completed: boolean("completed").default(false),
});

export const insertPlayerProgressSchema = createInsertSchema(playerProgress);
export type InsertPlayerProgress = z.infer<typeof insertPlayerProgressSchema>;
export type PlayerProgress = typeof playerProgress.$inferSelect;
