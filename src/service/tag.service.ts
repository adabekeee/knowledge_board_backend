import { prisma } from "../config/prisma.js";

export const createTag = async (data: { name: string, color?: string }) => {
    return await prisma.tag.create({ data });
};

export const updateTag = async (tagId: string, data: { name?: string, color?: string }) => {
    return await prisma.tag.update({
        where: {id: tagId},
        data
    });
};

export const deleteTag = async (tagId: string) => {
    return await prisma.tag.delete({
        where: {id: tagId}
    });
};

export const getAllTags = async () => {
    return await prisma.tag.findMany();
};
