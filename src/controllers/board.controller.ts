import type {NextFunction, Response} from "express";
import * as boardService from "../service/board.service.js";
import { createBoardSchema, updateBoardSchema } from "../validators/board.validator.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";


export const createBoard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const validatedData =  createBoardSchema.parse(req.body);

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const board = await boardService.createBoard({
            title: validatedData.title,
            userId: userId
        });

        return res.status(201).json({
            message: "Board created successfully",
            data: board
        });

    }catch (error){
        next(error);
    }
};

// get all boards for a user
export const getBoards = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const boards = await boardService.getBoardByUser(req.user!.userId);

        return res.status(200).json({
            message: "Boards retrieved successfully",
            data: boards
        });
    }catch (error){
        next(error);
    }
};

// get a single board by id
export const getBoardById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const id= req.params?.id as string | null

        if (!id) {
            return res.status(400).json({
                message: "Board ID is required"
            });
        }
        
        const board = await boardService.getBoardById(id);

        if (!board) {
            return res.status(404).json({
                message: "Board not found"
            })
        }

        return res.status(200).json({
            message: "Board retrieved successfully",
            data: board
        })

    }catch (error){
        next(error);
    }
};

//Update a board
export const updateBoard = async (req: AuthRequest, res:Response, next: NextFunction) => {
    try{
        const id = req.params?.id as string | null

        if (!id) {
            return res.status(400).json({
                message: "Board ID is required"
            });
        }

        const validatedData = updateBoardSchema.parse(req.body);

        const updatedBoard = await boardService.updateBoard(id, validatedData);

        return res.status(200).json({
            message: "Board updated successfully",
            data: updatedBoard
        });
    }catch (error){
        next(error);
    }
};

// Delete a board
export const deleteBoard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const id = req.params?.id as string | null

        if (!id) {
            return res.status(400).json({
                message: "Board ID is required"
            });
        }

        await boardService.deleteBoard(id);

        return res.status(200).json({
            message: "Board deleted successfully"
        });
    }catch (error){
        next(error);
    }
};