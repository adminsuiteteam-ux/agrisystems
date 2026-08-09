import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";
import { offers } from "./offers";

export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  offerId: uuid("offer_id").notNull().references(() => offers.id, { onDelete: "cascade" }),
  leaderId: uuid("leader_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  // status journey: open → partially_funded → fully_funded → payment_authorized → farmer_paid → in_transit → ready_pickup → distributing → completed
  // exception statuses: cancelled, refunded
  status: text("status").notNull().default("open"),
  pickupPointId: uuid("pickup_point_id"),
  deadline: timestamp("deadline"),
  targetHouseholds: integer("target_households").notNull(),
  fundedAmount: integer("funded_amount").default(0).notNull(),
  platformFee: integer("platform_fee").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const groupStatusHistory = pgTable("group_status_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  changedBy: uuid("changed_by").references(() => users.id),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGroupSchema = createInsertSchema(groups).omit({ id: true, createdAt: true, updatedAt: true });
export const selectGroupSchema = createSelectSchema(groups);
export type InsertGroup = typeof groups.$inferInsert;
export type Group = typeof groups.$inferSelect;

