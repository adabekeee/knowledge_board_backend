import jwt from "jsonwebtoken";
import { env } from "../config/env.js";


const JWT_EXPIRES_IN = "1h";

export const generateToken = (userId: string) => {
    return jwt.sign({userId}, env.jwtSecret, {expiresIn: JWT_EXPIRES_IN});
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, env.jwtSecret) as {userId: string};
};