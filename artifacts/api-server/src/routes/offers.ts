import { Router } from "express";
import { db, offers, farmers } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();

// GET /api/offers — List all active offers
router.get("/", async (req, res) => {
  try {
    const list = await db
      .select({
        id: offers.id,
        name: offers.name,
        category: offers.category,
        unit: offers.unit,
        price: offers.price,
        retailPrice: offers.retailPrice,
        targetHouseholds: offers.targetHouseholds,
        daysLeft: offers.daysLeft,
        accentColor: offers.accentColor,
        description: offers.description,
        harvestDate: offers.harvestDate,
        qualityDetails: offers.qualityDetails,
        status: offers.status,
        createdAt: offers.createdAt,
        farmerId: farmers.id,
        farmName: farmers.farmName,
        farmLocation: farmers.farmLocation,
        verificationStatus: farmers.verificationStatus,
      })
      .from(offers)
      .innerJoin(farmers, eq(offers.farmerId, farmers.id));

    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch offers" });
  }
});

// GET /api/offers/:id — Single offer detail
router.get("/:id", async (req, res) => {
  try {
    const offerId = req.params.id as string;
    const [offer] = await db
      .select({
        id: offers.id,
        name: offers.name,
        category: offers.category,
        unit: offers.unit,
        price: offers.price,
        retailPrice: offers.retailPrice,
        targetHouseholds: offers.targetHouseholds,
        daysLeft: offers.daysLeft,
        accentColor: offers.accentColor,
        description: offers.description,
        harvestDate: offers.harvestDate,
        qualityDetails: offers.qualityDetails,
        status: offers.status,
        createdAt: offers.createdAt,
        farmerId: farmers.id,
        farmName: farmers.farmName,
        farmLocation: farmers.farmLocation,
        verificationStatus: farmers.verificationStatus,
      })
      .from(offers)
      .innerJoin(farmers, eq(offers.farmerId, farmers.id))
      .where(eq(offers.id, offerId))
      .limit(1);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    return res.json(offer);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch offer detail" });
  }
});

// POST /api/offers — Create offer (Farmer or Admin)
router.post("/", authenticateToken, requireRole("farmer", "admin"), async (req, res) => {
  try {
    const { farmerId, name, category, unit, price, retailPrice, targetHouseholds, daysLeft, accentColor, description, harvestDate, qualityDetails } = req.body;

    if (!name || !category || !unit || !price || !targetHouseholds) {
      return res.status(400).json({ error: "Name, category, unit, price, and targetHouseholds are required" });
    }

    // Find farmer record for user
    let targetFarmerId = farmerId;
    if (!targetFarmerId) {
      const [f] = await db.select().from(farmers).where(eq(farmers.userId, req.user!.id)).limit(1);
      if (!f) {
        return res.status(400).json({ error: "No farmer profile found for this user" });
      }
      targetFarmerId = f.id;
    }

    const [newOffer] = await db
      .insert(offers)
      .values({
        farmerId: targetFarmerId,
        name,
        category,
        unit,
        price: Number(price),
        retailPrice: Number(retailPrice || price * 1.2),
        targetHouseholds: Number(targetHouseholds),
        daysLeft: Number(daysLeft || 7),
        accentColor: accentColor || "#e8d7ae",
        description,
        harvestDate,
        qualityDetails,
        status: "active",
      })
      .returning();

    return res.status(201).json(newOffer);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to create offer" });
  }
});

export default router;
