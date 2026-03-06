import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import * as columnService from "../service/column.service.js";
import { createColumnSchema, updateColumnSchema } from "../validators/column.validator.js";
import { ca } from "zod/locales";

export const createColumn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params?.boardId as string || null;

        if (!boardId) {
            return res.status(400).json({
                message: "Board ID is required"
            });
        }

        const validatedData = createColumnSchema.parse(req.body);

        const column = await columnService.createColumn({
            title: validatedData.title,
            boardId
        })

        return res.status(201).json({
            message: "Column created successfully",
            data: column
        })
    } catch (error) {
        next(error);
    }
};

export const updateColumn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const columnId = req.params?.columnId as string || null;

        if (!columnId) {
            return res.status(400).json({
                message: "Column ID is required"
            });
        }

        const validatedData = updateColumnSchema.parse(req.body);

        const updatedColumn = await columnService.updateColumn(columnId, validatedData);

        return res.status(200).json({
            message: "Column updated successfully",
            data: updatedColumn
        });
    } catch (error) {
        next(error);
    }
};

export const deleteColumn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const columnId = req.params?.columnId as string || null;

        if (!columnId) {
            return res.status(400).json({
                message: "Column ID is required"
            });
        }

        await columnService.deleteColumn(columnId);

        return res.status(200).json({
            message: "Column deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};