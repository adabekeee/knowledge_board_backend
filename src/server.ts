import "dotenv/config";
import express from "express";
import type { Request, Response } from 'express';
import authRoutes from "./routes/auth.route.js";
import boardRoutes from "./routes/board.route.js";
import columnRoutes from "./routes/column.route.js";
import cardRoutes from "./routes/card.route.js";
import tagRoutes from "./routes/tag.route.js";
import userRoutes from "./routes/user.route.js"
import commentRoutes from "./routes/comment.route.js"
import { globalErrorHandler } from "./middlewares/error.middleware.js"

const app = express();

app.use(express.json());

app.get("/", (req: Request,res: Response) => {
    res.json({
        message: "Welcome to the Knowledge Board API"
    });
});


app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/boards/:boardId/columns", columnRoutes);
app.use("/api/boards/:boardId/columns/:columnId/cards", cardRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cards/:cardId/comments", commentRoutes);


app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

export default app;