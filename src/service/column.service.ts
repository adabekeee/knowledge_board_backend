import { prisma } from "../config/prisma.js";

export const createColumn = async (data: {title: string; boardId: string}) => {
    return await prisma.column.create({data});
};

export const updateColumn = async (columnId: string, data: {title?: string}) => {
    return await prisma.column.update({
        where: {id: columnId},
        data
    });
};

export const deleteColumn = async (columnId: string) => {
    return await prisma.column.delete({
        where: {id: columnId}
    });
}