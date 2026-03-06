// src/service/user.service.ts
import { prisma } from "../config/prisma.js";
import { hashPassword } from "../utils/password.util.js";

export const updateUser = async (userId: string, data: { firstName?: string; lastName?: string; email?: string; password?: string }) => {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteUser = async (userId: string) => {
  return await prisma.user.delete({ where: { id: userId } });
};

export const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};