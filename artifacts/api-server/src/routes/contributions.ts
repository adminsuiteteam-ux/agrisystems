import { Router } from "express";
import { db, contributions, groups, groupStatusHistory, notifications } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();

// POST /api/contributions/initiate — Initiate digital contribution
router.post("/initiate", authenticateToken, async (req, res) => {
  try {
    const { groupId, quantity, amount } = req.body;

    if (!groupId || !quantity || !amount) {
      return res.status(400).json({ error: "Group ID, quantity, and amount are required" });
    }

    const [group] = await db.select().from(groups).where(eq(groups.id, groupId)).limit(1);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const paystackRef = `AGRO_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const [contrib] = await db
      .insert(contributions)
      .values({
        groupId,
        userId: req.user!.id,
        quantity: Number(quantity),
        amount: Number(amount),
        paymentMethod: "paystack",
        paystackRef,
        status: "pending",
      })
      .returning();

    return res.status(201).json({
      contribution: contrib,
      paystackRef,
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || "pk_test_demo_agrosystem_key_2026",
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to initiate contribution" });
  }
});

// POST /api/contributions/webhook — Confirm Paystack payment
router.post("/webhook", async (req, res) => {
  try {
    const { reference, status: paymentStatus } = req.body;
    const ref = reference || req.body.data?.reference;

    if (!ref) {
      return res.status(400).json({ error: "Payment reference required" });
    }

    const [contrib] = await db.select().from(contributions).where(eq(contributions.paystackRef, ref)).limit(1);
    if (!contrib) {
      return res.status(404).json({ error: "Contribution record not found" });
    }

    if (contrib.status === "confirmed") {
      return res.json({ message: "Contribution already confirmed" });
    }

    // Confirm contribution
    const [updated] = await db
      .update(contributions)
      .set({ status: "confirmed" })
      .where(eq(contributions.id, contrib.id))
      .returning();

    // Update group funded amount & check status
    const [group] = await db.select().from(groups).where(eq(groups.id, contrib.groupId)).limit(1);
    if (group) {
      const newFunded = group.fundedAmount + contrib.amount;
      // Count total confirmed contributions to see if households target is met
      const confirmedContribs = await db
        .select()
        .from(contributions)
        .where(sql`${contributions.groupId} = ${group.id} AND ${contributions.status} = 'confirmed'`);

      let newGroupStatus = group.status;
      if (confirmedContribs.length >= group.targetHouseholds && group.status === "open") {
        newGroupStatus = "funded";
      } else if (confirmedContribs.length > 0 && group.status === "open") {
        newGroupStatus = "partially_funded";
      }

      await db
        .update(groups)
        .set({ fundedAmount: newFunded, status: newGroupStatus, updatedAt: new Date() })
        .where(eq(groups.id, group.id));

      if (newGroupStatus !== group.status) {
        await db.insert(groupStatusHistory).values({
          groupId: group.id,
          status: newGroupStatus,
          note: `Auto status update: ${newGroupStatus}`,
        });
      }

      // Add notification for user
      await db.insert(notifications).values({
        userId: contrib.userId,
        type: "payment_received",
        title: "Payment Received",
        body: `Your payment of ₦${contrib.amount.toLocaleString()} for ${group.name} was confirmed!`,
      });
    }

    return res.json({ message: "Payment confirmed successfully", contribution: updated });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
});

// POST /api/contributions/cash — Leader records offline cash payment
router.post("/cash", authenticateToken, requireRole("leader", "admin"), async (req, res) => {
  try {
    const { groupId, userId, quantity, amount, cashProofUrl } = req.body;

    if (!groupId || !userId || !quantity || !amount) {
      return res.status(400).json({ error: "groupId, userId, quantity, and amount are required" });
    }

    const [contrib] = await db
      .insert(contributions)
      .values({
        groupId,
        userId,
        quantity: Number(quantity),
        amount: Number(amount),
        paymentMethod: "cash",
        status: "confirmed",
        cashProofUrl: cashProofUrl || null,
      })
      .returning();

    // Update group funded amount
    const [group] = await db.select().from(groups).where(eq(groups.id, groupId)).limit(1);
    if (group) {
      await db
        .update(groups)
        .set({ fundedAmount: group.fundedAmount + Number(amount), updatedAt: new Date() })
        .where(eq(groups.id, groupId));
    }

    return res.status(201).json(contrib);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to record cash contribution" });
  }
});

export default router;
