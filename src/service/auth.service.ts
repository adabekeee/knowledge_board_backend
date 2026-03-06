import { prisma } from "../config/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import { generateToken, verifyToken } from "../utils/jwt.util.js";

export const registerUser = async (firstName: string, lastName: string, email: string, password: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists");
    }
        
    const password_hash = await hashPassword(password);

    const user = await prisma.user.create({
        data: {firstName, lastName, email, password: password_hash}
    });

    const token = generateToken(user.id);

    return { user, token };  
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new Error ("Invalid User email");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        throw new Error ("Incorrect Password");
    }

    const token = generateToken(user.id)

    return {user, token}
}
