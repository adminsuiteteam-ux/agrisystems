import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";
import { groups } from "./groups";

export const pickupPoints = pgTable("pickup_points", {
  id: uuid("id").defaultRandom().primaryKey(),
  communityName: text("community_name").notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  coordinates: text("coordinates"),
  managedBy: uuid("managed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pickups = pgTable("pickups", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  pickupPointId: uuid("pickup_point_id").references(() => pickupPoints.id),
  pickupCode: text("pickup_code").notNull(),
  status: text("status").notNull().default("pending"), // pending | collected | missed | reported
  collectedAt: timestamp("collected_at"),
  qrCodeData: text("qr_code_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPickupPointSchema = createInsertSchema(pickupPoints).omit({ id: true, createdAt: true });
export const selectPickupPointSchema = createSelectSchema(pickupPoints);

export const insertPickupSchema = createInsertSchema(pickups).omit({ id: true, createdAt: true });
export const selectPickupSchema = createSelectSchema(pickups);
