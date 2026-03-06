import { Router } from "express";
import * as boardController from "../controllers/board.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, boardController.createBoard);

router.get("/", authMiddleware, boardController.getBoards);

router.get("/:id", authMiddleware, boardController.getBoardById);

router.patch("/:id", authMiddleware, boardController.updateBoard);

router.delete("/:id", authMiddleware, boardController.deleteBoard);

export default router;