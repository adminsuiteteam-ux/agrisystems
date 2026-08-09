import { Router } from "express";
import { db, pickupPoints, pickups, users, groups } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();

// GET /api/pickup-points — List all pickup points
router.get("/points", async (req, res) => {
  try {
    const list = await db.select().from(pickupPoints);
    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch pickup points" });
  }
});

// GET /api/pickups/group/:groupId — Get member pickup statuses for a group
router.get("/group/:groupId", authenticateToken, async (req, res) => {
  try {
    const groupId = req.params.groupId as string;
    const list = await db
      .select({
        id: pickups.id,
        pickupCode: pickups.pickupCode,
        status: pickups.status,
        collectedAt: pickups.collectedAt,
        qrCodeData: pickups.qrCodeData,
        createdAt: pickups.createdAt,
        userFullName: users.fullName,
        userPhone: users.phone,
        userId: users.id,
      })
      .from(pickups)
      .innerJoin(users, eq(pickups.userId, users.id))
      .where(eq(pickups.groupId, groupId));

    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch pickup records" });
  }
});

// POST /api/pickups/generate — Generate pickup code for user in group
router.post("/generate", authenticateToken, async (req, res) => {
  try {
    const { groupId } = req.body;
    if (!groupId) {
      return res.status(400).json({ error: "Group ID is required" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const [existing] = await db
      .select()
      .from(pickups)
      .where(and(eq(pickups.groupId, groupId), eq(pickups.userId, req.user!.id)))
      .limit(1);

    if (existing) {
      return res.json(existing);
    }

    const [newPickup] = await db
      .insert(pickups)
      .values({
        groupId,
        userId: req.user!.id,
        pickupCode: code,
        status: "pending",
        qrCodeData: `AGRO-PICKUP:${groupId}:${req.user!.id}:${code}`,
      })
      .returning();

    return res.status(201).json(newPickup);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to generate pickup code" });
  }
});

// POST /api/pickups/:id/collect — Confirm item collection
router.post("/:id/collect", authenticateToken, async (req, res) => {
  try {
    const pickupId = req.params.id as string;
    const [pickup] = await db.select().from(pickups).where(eq(pickups.id, pickupId)).limit(1);
    if (!pickup) {
      return res.status(404).json({ error: "Pickup record not found" });
    }

    const [updated] = await db
      .update(pickups)
      .set({ status: "collected", collectedAt: new Date() })
      .where(eq(pickups.id, pickupId))
      .returning();

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to mark as collected" });
  }
});

export default router;
