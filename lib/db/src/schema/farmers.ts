import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";

export const farmers = pgTable("farmers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  farmName: text("farm_name").notNull(),
  farmLocation: text("farm_location").notNull(),
  description: text("description"),
  verificationStatus: text("verification_status").notNull().default("pending"), // pending | verified | rejected
  farmPhotos: jsonb("farm_photos").$type<string[]>().default([]),
  fulfillmentHistory: jsonb("fulfillment_history").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFarmerSchema = createInsertSchema(farmers).omit({ id: true, createdAt: true, updatedAt: true });
export const selectFarmerSchema = createSelectSchema(farmers);
export type InsertFarmer = typeof farmers.$inferInsert;
export type Farmer = typeof farmers.$inferSelect;

