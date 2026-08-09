import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";
import { groups } from "./groups";

export const contributions = pgTable("contributions", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  amount: integer("amount").notNull(), // Total Naira amount
  paymentMethod: text("payment_method").notNull().default("paystack"), // paystack | cash
  paystackRef: text("paystack_ref"),
  status: text("status").notNull().default("pending"), // pending | confirmed | refunded
  cashProofUrl: text("cash_proof_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContributionSchema = createInsertSchema(contributions).omit({ id: true, createdAt: true });
export const selectContributionSchema = createSelectSchema(contributions);
export type InsertContribution = typeof contributions.$inferInsert;
export type Contribution = typeof contributions.$inferSelect;

