import { prisma } from "../config/prisma.js";

export const createBoard = async (data: { title: string; userId: string}) => {
    return await prisma.board.create({data});
};

export const getBoardByUser = async (userId: string) => {
    return await prisma.board.findMany({ where: {userId} });
};

export const getBoardById = async (boardId: string) => {
    return await prisma.board.findUnique({ 
        where: {id: boardId},
        include: {
            columns: {
                include: {
                    cards: {
                        include: {tags: true}
                    }
                }
            }
        }
    });
};

export const updateBoard = async (boardId: string, data: {title?: string}) => {
    return await prisma.board.update({
        where: {id: boardId},
        data
    });
};

export const deleteBoard = async (boardId: string) => {
    return await prisma.board.delete({where: {id: boardId}});
};