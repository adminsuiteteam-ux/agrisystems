import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import farmersRouter from "./farmers";
import offersRouter from "./offers";
import groupsRouter from "./groups";
import contributionsRouter from "./contributions";
import pickupRouter from "./pickup";
import disputesRouter from "./disputes";
import notificationsRouter from "./notifications";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/farmers", farmersRouter);
router.use("/offers", offersRouter);
router.use("/groups", groupsRouter);
router.use("/contributions", contributionsRouter);
router.use("/pickup", pickupRouter);
router.use("/disputes", disputesRouter);
router.use("/notifications", notificationsRouter);
router.use("/admin", adminRouter);

export default router;
