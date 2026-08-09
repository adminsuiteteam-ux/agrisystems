import { Router } from "express";
import { db, disputes, users, groups } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();

// GET /api/disputes — List all disputes (Admin or Leader)
router.get("/", authenticateToken, requireRole("admin", "leader"), async (req, res) => {
  try {
    const list = await db
      .select({
        id: disputes.id,
        type: disputes.type,
        description: disputes.description,
        status: disputes.status,
        resolution: disputes.resolution,
        createdAt: disputes.createdAt,
        updatedAt: disputes.updatedAt,
        groupName: groups.name,
        groupId: groups.id,
        reporterName: users.fullName,
        reporterPhone: users.phone,
      })
      .from(disputes)
      .innerJoin(groups, eq(disputes.groupId, groups.id))
      .innerJoin(users, eq(disputes.reportedBy, users.id));

    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch disputes" });
  }
});

// POST /api/disputes — File a dispute
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { groupId, type, description } = req.body;

    if (!groupId || !type || !description) {
      return res.status(400).json({ error: "Group ID, dispute type, and description are required" });
    }

    const [dispute] = await db
      .insert(disputes)
      .values({
        groupId,
        reportedBy: req.user!.id,
        type,
        description,
        status: "open",
      })
      .returning();

    return res.status(201).json(dispute);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to file dispute" });
  }
});

// PATCH /api/disputes/:id — Resolve dispute (Admin only)
router.patch("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const disputeId = req.params.id as string;
    const { status, resolution } = req.body; // reviewing | resolved | refunded

    const [updated] = await db
      .update(disputes)
      .set({
        status,
        resolution,
        resolvedBy: req.user!.id,
        updatedAt: new Date(),
      })
      .where(eq(disputes.id, disputeId))
      .returning();

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to update dispute" });
  }
});

export default router;
