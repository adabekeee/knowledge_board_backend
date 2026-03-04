import express from "express";
import type { Request, Response } from 'express';
import dotenv from "dotenv";

dotenv.config()

const app = express();
const port: number = 3000;

app.get("/", (req: Request,res: Response) => {
    res.send("Hello World with TypeScript");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});