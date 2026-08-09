import { Router } from "express";
import { db, users, farmers, groups, contributions, disputes } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();

// GET /api/admin/dashboard — Summary metrics for platform admin
router.get("/dashboard", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const totalUsersCount = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalFarmersCount = await db.select({ count: sql<number>`count(*)` }).from(farmers);
    const pendingFarmersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(farmers)
      .where(eq(farmers.verificationStatus, "pending"));

    const totalGroupsCount = await db.select({ count: sql<number>`count(*)` }).from(groups);
    const activeGroupsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(groups)
      .where(sql`${groups.status} IN ('open', 'partially_funded', 'funded', 'authorized')`);

    const openDisputesCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(disputes)
      .where(eq(disputes.status, "open"));

    const totalFundedAmount = await db
      .select({ sum: sql<number>`COALESCE(sum(${groups.fundedAmount}), 0)` })
      .from(groups);

    return res.json({
      users: Number(totalUsersCount[0]?.count || 0),
      farmers: Number(totalFarmersCount[0]?.count || 0),
      pendingFarmers: Number(pendingFarmersCount[0]?.count || 0),
      groups: Number(totalGroupsCount[0]?.count || 0),
      activeGroups: Number(activeGroupsCount[0]?.count || 0),
      openDisputes: Number(openDisputesCount[0]?.count || 0),
      totalSavings: Number(totalFundedAmount[0]?.sum || 0) * 0.2, // ~20% community savings
      totalFunded: Number(totalFundedAmount[0]?.sum || 0),
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to load admin stats" });
  }
});

// GET /api/admin/users — List all registered users
router.get("/users", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const list = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        phone: users.phone,
        role: users.role,
        trustScore: users.trustScore,
        createdAt: users.createdAt,
      })
      .from(users);

    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
