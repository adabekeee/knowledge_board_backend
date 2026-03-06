import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as columnController from "../controllers/column.controller.js";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, columnController.createColumn);

router.patch("/:columnId", authMiddleware, columnController.updateColumn);

router.delete("/:columnId", authMiddleware, columnController.deleteColumn);

export default router;