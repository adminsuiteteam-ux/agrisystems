import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { farmers } from "./farmers";

export const offers = pgTable("offers", {
  id: uuid("id").defaultRandom().primaryKey(),
  farmerId: uuid("farmer_id").notNull().references(() => farmers.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category").notNull(), // Grains, Pantry, Fresh produce, etc.
  unit: text("unit").notNull(), // e.g. 5kg bag, 10 tubers
  price: integer("price").notNull(), // Amount in Naira
  retailPrice: integer("retail_price").notNull(), // Estimated market retail price in Naira
  targetHouseholds: integer("target_households").notNull(),
  daysLeft: integer("days_left").notNull(),
  accentColor: text("accent_color").default("#e8d7ae").notNull(),
  description: text("description"),
  harvestDate: text("harvest_date"),
  qualityDetails: text("quality_details"),
  status: text("status").notNull().default("active"), // active | closed | expired
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOfferSchema = createInsertSchema(offers).omit({ id: true, createdAt: true });
export const selectOfferSchema = createSelectSchema(offers);
export type InsertOffer = typeof offers.$inferInsert;
export type Offer = typeof offers.$inferSelect;

