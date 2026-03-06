import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Server Error:", error);

    if (error instanceof ZodError) {
        return res.status(400).json({
            message: error.issues?.[0]?.message || "Validation error"
        });
    }

    if (error.statusCode) {
        return res.status(error.statusCode).json({
            message: error.message
        });
    }

    return res.status(500).json({
        message: "Internal server error"
    });
}