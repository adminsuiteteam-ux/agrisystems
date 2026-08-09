import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";
import { groups } from "./groups";

export const disputes = pgTable("disputes", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  reportedBy: uuid("reported_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // payment | quantity | quality | missed_pickup | leader | refund
  description: text("description").notNull(),
  status: text("status").notNull().default("open"), // open | reviewing | resolved | refunded
  resolvedBy: uuid("resolved_by").references(() => users.id),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDisputeSchema = createInsertSchema(disputes).omit({ id: true, createdAt: true, updatedAt: true });
export const selectDisputeSchema = createSelectSchema(disputes);
export type InsertDispute = typeof disputes.$inferInsert;
export type Dispute = typeof disputes.$inferSelect;

