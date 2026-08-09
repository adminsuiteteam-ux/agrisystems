import { Router } from "express";
import { db, farmers, users } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();

// GET /api/farmers — List farmers
router.get("/", async (req, res) => {
  try {
    const list = await db
      .select({
        id: farmers.id,
        farmName: farmers.farmName,
        farmLocation: farmers.farmLocation,
        description: farmers.description,
        verificationStatus: farmers.verificationStatus,
        farmPhotos: farmers.farmPhotos,
        fulfillmentHistory: farmers.fulfillmentHistory,
        createdAt: farmers.createdAt,
        farmerName: users.fullName,
        farmerPhone: users.phone,
        farmerTrustScore: users.trustScore,
      })
      .from(farmers)
      .innerJoin(users, eq(farmers.userId, users.id));

    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch farmers" });
  }
});

// GET /api/farmers/:id — Single farmer detail
router.get("/:id", async (req, res) => {
  try {
    const farmerId = req.params.id as string;
    const [farmer] = await db
      .select({
        id: farmers.id,
        farmName: farmers.farmName,
        farmLocation: farmers.farmLocation,
        description: farmers.description,
        verificationStatus: farmers.verificationStatus,
        farmPhotos: farmers.farmPhotos,
        fulfillmentHistory: farmers.fulfillmentHistory,
        createdAt: farmers.createdAt,
        farmerName: users.fullName,
        farmerPhone: users.phone,
        farmerTrustScore: users.trustScore,
      })
      .from(farmers)
      .innerJoin(users, eq(farmers.userId, users.id))
      .where(eq(farmers.id, farmerId))
      .limit(1);

    if (!farmer) {
      return res.status(404).json({ error: "Farmer profile not found" });
    }

    return res.json(farmer);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch farmer profile" });
  }
});

// POST /api/farmers — Create farmer profile
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { farmName, farmLocation, description, farmPhotos } = req.body;

    if (!farmName || !farmLocation) {
      return res.status(400).json({ error: "Farm name and farm location are required" });
    }

    const [newFarmer] = await db
      .insert(farmers)
      .values({
        userId: req.user!.id,
        farmName,
        farmLocation,
        description: description || null,
        farmPhotos: farmPhotos || [],
        verificationStatus: "pending",
      })
      .returning();

    return res.status(201).json(newFarmer);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to create farmer profile" });
  }
});

// PATCH /api/farmers/:id/verify — Admin verification
router.patch("/:id/verify", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const farmerId = req.params.id as string;
    const { status } = req.body; // verified | rejected
    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Status must be 'verified' or 'rejected'" });
    }

    const [updated] = await db
      .update(farmers)
      .set({ verificationStatus: status, updatedAt: new Date() })
      .where(eq(farmers.id, farmerId))
      .returning();

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to update farmer verification status" });
  }
});

export default router;
