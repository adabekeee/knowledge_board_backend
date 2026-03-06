import type { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import * as authService from "../service/auth.service.js";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const validatedData = registerSchema.parse(req.body);

        const result = await authService.registerUser(validatedData.firstName, validatedData.lastName, validatedData.email, validatedData.password);

        return res.status(201).json({
            message: "User registered successfully",
            data: result
        });
    }catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const validatedData = loginSchema.parse(req.body);

        const result = await authService.loginUser(validatedData.email, validatedData.password);

        return res.status(200).json({
            message: "Login successful",
            data: result
        });
    }catch (error) {
        next(error);
    }
}