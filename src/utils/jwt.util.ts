import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1h";

export const generateToken = (userId: string) => {
    return jwt.sign({userId}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as {userId: string};
};