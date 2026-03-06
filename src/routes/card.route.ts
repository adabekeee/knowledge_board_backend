import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as cardController from "../controllers/card.controller.js";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, cardController.createCard);

router.patch("/:cardId", authMiddleware, cardController.updateCard);

router.delete("/:cardId", authMiddleware, cardController.deleteCard);

router.get("/", authMiddleware, cardController.getCardsByColumn);

router.patch("/:cardId/tags", authMiddleware, cardController.assignTag);

router.patch("/:cardId/due-date", authMiddleware, cardController.setDueDate);

export default router;  