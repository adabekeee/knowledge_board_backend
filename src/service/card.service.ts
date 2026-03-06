import { prisma } from "../config/prisma.js";

export const createCard = async (data: { title: string, columnId: string }) => {
    return await prisma.card.create({ 
        data,
        include: {tags: true} 
    });
};

export const updateCard = async (cardId: string, data: { title?: string}) => {
    return await prisma.card.update({
        where: {id: cardId},
        data,
        include: {tags: true} 
    });
};

export const deleteCard = async (cardId: string) => {
    return await prisma.card.delete({
        where: {id: cardId}
    });
};

export const getCardsByColumn = async (columnId: string) => {
    return await prisma.card.findMany({
        where: {columnId},
        include: {tags: true} 
    });
};

export const assignTag = async (cardId: string, tagId: string[]) => {
    return await prisma.card.update({
        where: {id: cardId},
        data: {
            tags: {
                connect: tagId.map((id) => ({ id }))
            }
        },
        include: {tags: true} 
    });
};

export const setDueDate = async (cardId: string, dueDate: string) => {
    return await prisma.card.update({
        where: {id: cardId},
        data: { dueDate: new Date(dueDate) },
        include: {tags: true} 
    });
};