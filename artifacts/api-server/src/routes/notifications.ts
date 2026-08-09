import { Router } from "express";
import { db, notifications } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// GET /api/notifications — User's notifications
router.get("/", authenticateToken, async (req, res) => {
  try {
    const list = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, req.user!.id))
      .orderBy(desc(notifications.createdAt));

    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// PATCH /api/notifications/:id/read — Mark notification as read
router.patch("/:id/read", authenticateToken, async (req, res) => {
  try {
    const notifId = req.params.id as string;
    const [updated] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, notifId))
      .returning();

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

export default router;
