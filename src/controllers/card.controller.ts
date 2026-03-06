import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import * as cardService from "../service/card.service.js";
import { createCardSchema, updateCardSchema, assignTagSchema, setDueDateSchema } from "../validators/card.validator.js";

export const createCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const columnId = req.params?.columnId as string || null;

        if (!columnId) {
            return res.status(400).json({
                message: "Column ID is required"
            });
        }

        const validatedData = createCardSchema.parse(req.body);

        const card = await cardService.createCard({
            title: validatedData.title,
            columnId
        })

        return res.status(201).json({
            message: "Card created successfully",
            data: card
        })
    } catch (error) {
        next(error);
    }
};

export const updateCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const cardId = req.params?.cardId as string || null;

        if (!cardId) {
            return res.status(400).json({
                message: "Card ID is required"
            });
        }

        const validatedData = updateCardSchema.parse(req.body);

        const updatedCard = await cardService.updateCard(cardId, validatedData);

        return res.status(200).json({
            message: "Card updated successfully",
            data: updatedCard
        });
    } catch (error) {
        next(error);
    }

};

export const deleteCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const cardId = req.params?.cardId as string || null;

        if (!cardId) {
            return res.status(400).json({
                message: "Card ID is required"
            });
        }

        await cardService.deleteCard(cardId);

        return res.status(200).json({
            message: "Card deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getCardsByColumn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const columnId = req.params?.columnId as string || null;

        if (!columnId) {
            return res.status(400).json({
                message: "Column ID is required"
            });
        }

        const cards = await cardService.getCardsByColumn(columnId);

        return res.status(200).json({
            message: "Cards retrieved successfully",
            data: cards
        });
    } catch (error) {
        next(error);
    }
};

export const assignTag = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const cardId = req.params?.cardId as string || null;

        if (!cardId) {
            return res.status(400).json({
                message: "Card ID is required"
            });
        }

        const { tagIds } = assignTagSchema.parse(req.body);

        const updatedCard = await cardService.assignTag(cardId, tagIds);

        return res.status(200).json({
            message: "Tags assigned successfully",
            data: updatedCard
        });
    } catch (error) {
        next(error);
    }
};

export const setDueDate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const cardId = req.params?.cardId as string || null;

        if (!cardId) {
            return res.status(400).json({
                message: "Card ID is required"
            });
        }

        const { dueDate } = setDueDateSchema.parse(req.body);

        const updatedCard = await cardService.setDueDate(cardId, dueDate);

        return res.status(200).json({
            message: "Due date set successfully",
            data: updatedCard
        });
    } catch (error) {
        next(error);
    }
};