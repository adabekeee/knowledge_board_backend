import type {Request, Response, NextFunction} from "express";
import { verifyToken } from "../utils/jwt.util.js";
import { globalErrorHandler } from "./error.middleware.js";

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "Unauthorized"});
    }

    const token =  authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const decoded = verifyToken(token); 
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
}
