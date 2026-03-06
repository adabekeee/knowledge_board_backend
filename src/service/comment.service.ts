import { prisma } from "../config/prisma.js";

export const createComment = async (data: { content: string; cardId: string; userId: string }) => {
  return await prisma.comment.create({
    data,
    include: { user: { select: { id: true, firstName: true, lastName: true } } },
  });
};

export const getCommentsByCard = async (cardId: string) => {
  return await prisma.comment.findMany({
    where: { cardId },
    include: { user: { select: { id: true, firstName: true, lastName: true } } },
  });
};

export const updateComment = async (commentId: string, content: string) => {
  return await prisma.comment.update({
    where: { id: commentId },
    data: { content },
    include: { user: { select: { id: true, firstName: true, lastName: true } } },
  });
};

export const deleteComment = async (commentId: string) => {
  return await prisma.comment.delete({ where: { id: commentId } });
};