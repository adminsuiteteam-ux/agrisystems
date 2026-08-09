import { Router } from "express";
import { db, groups, groupStatusHistory, offers, users, contributions, farmers } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();

// GET /api/groups — List all groups
router.get("/", async (req, res) => {
  try {
    const list = await db
      .select({
        id: groups.id,
        name: groups.name,
        status: groups.status,
        deadline: groups.deadline,
        targetHouseholds: groups.targetHouseholds,
        fundedAmount: groups.fundedAmount,
        createdAt: groups.createdAt,
        leaderName: users.fullName,
        leaderPhone: users.phone,
        offerName: offers.name,
        offerCategory: offers.category,
        offerUnit: offers.unit,
        offerPrice: offers.price,
        offerRetailPrice: offers.retailPrice,
        farmName: farmers.farmName,
        farmLocation: farmers.farmLocation,
      })
      .from(groups)
      .innerJoin(users, eq(groups.leaderId, users.id))
      .innerJoin(offers, eq(groups.offerId, offers.id))
      .innerJoin(farmers, eq(offers.farmerId, farmers.id));

    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch groups" });
  }
});

// GET /api/groups/:id — Single group detail with members/contributions & status history
router.get("/:id", async (req, res) => {
  try {
    const groupId = req.params.id as string;
    const [group] = await db
      .select({
        id: groups.id,
        name: groups.name,
        status: groups.status,
        deadline: groups.deadline,
        targetHouseholds: groups.targetHouseholds,
        fundedAmount: groups.fundedAmount,
        platformFee: groups.platformFee,
        createdAt: groups.createdAt,
        leaderId: groups.leaderId,
        leaderName: users.fullName,
        leaderPhone: users.phone,
        offerId: offers.id,
        offerName: offers.name,
        offerCategory: offers.category,
        offerUnit: offers.unit,
        offerPrice: offers.price,
        offerRetailPrice: offers.retailPrice,
        offerAccentColor: offers.accentColor,
        farmName: farmers.farmName,
        farmLocation: farmers.farmLocation,
      })
      .from(groups)
      .innerJoin(users, eq(groups.leaderId, users.id))
      .innerJoin(offers, eq(groups.offerId, offers.id))
      .innerJoin(farmers, eq(offers.farmerId, farmers.id))
      .where(eq(groups.id, groupId))
      .limit(1);

    if (!group) {
      return res.status(404).json({ error: "Group purchase not found" });
    }

    // Get group contributions
    const contribs = await db
      .select({
        id: contributions.id,
        quantity: contributions.quantity,
        amount: contributions.amount,
        paymentMethod: contributions.paymentMethod,
        status: contributions.status,
        createdAt: contributions.createdAt,
        userFullName: users.fullName,
        userAvatarUrl: users.avatarUrl,
      })
      .from(contributions)
      .innerJoin(users, eq(contributions.userId, users.id))
      .where(eq(contributions.groupId, groupId));

    // Get status history
    const history = await db
      .select()
      .from(groupStatusHistory)
      .where(eq(groupStatusHistory.groupId, groupId));

    return res.json({ ...group, contributions: contribs, history });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch group detail" });
  }
});

// POST /api/groups — Create group (Role: leader, admin)
router.post("/", authenticateToken, requireRole("leader", "admin"), async (req, res) => {
  try {
    const { offerId, name, targetHouseholds, deadlineDays } = req.body;

    if (!offerId || !name) {
      return res.status(400).json({ error: "Offer ID and group name are required" });
    }

    const [offer] = await db.select().from(offers).where(eq(offers.id, offerId)).limit(1);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + (deadlineDays || offer.daysLeft || 7));

    const [newGroup] = await db
      .insert(groups)
      .values({
        offerId,
        leaderId: req.user!.id,
        name,
        targetHouseholds: targetHouseholds || offer.targetHouseholds,
        deadline,
        status: "open",
      })
      .returning();

    // Insert history record
    await db.insert(groupStatusHistory).values({
      groupId: newGroup.id,
      status: "open",
      changedBy: req.user!.id,
      note: "Group buy created",
    });

    return res.status(201).json(newGroup);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to create group" });
  }
});

// POST /api/groups/:id/authorize — Leader authorizes payment
router.post("/:id/authorize", authenticateToken, requireRole("leader", "admin"), async (req, res) => {
  try {
    const groupId = req.params.id as string;
    const [group] = await db.select().from(groups).where(eq(groups.id, groupId)).limit(1);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const [updated] = await db
      .update(groups)
      .set({ status: "authorized", updatedAt: new Date() })
      .where(eq(groups.id, groupId))
      .returning();

    await db.insert(groupStatusHistory).values({
      groupId: group.id,
      status: "authorized",
      changedBy: req.user!.id,
      note: "Payment authorized by group leader",
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to authorize payment" });
  }
});

// PATCH /api/groups/:id/status — Admin or leader updates group lifecycle status
router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    const groupId = req.params.id as string;
    const { status, note } = req.body;
    const validStatuses = [
      "open",
      "partially_funded",
      "funded",
      "authorized",
      "farmer_paid",
      "in_transit",
      "ready_pickup",
      "distributing",
      "completed",
      "cancelled",
      "refunded",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const [updated] = await db
      .update(groups)
      .set({ status, updatedAt: new Date() })
      .where(eq(groups.id, groupId))
      .returning();

    await db.insert(groupStatusHistory).values({
      groupId,
      status,
      changedBy: req.user!.id,
      note: note || `Status updated to ${status}`,
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to update group status" });
  }
});

export default router;
