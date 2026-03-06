import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import * as tagService from "../service/tag.service.js";
import { createTagSchema, updateTagSchema } from "../validators/tag.validator.js";

export const createTag = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const validatedData = createTagSchema.parse(req.body);

        const tag = await tagService.createTag({
            name: validatedData.name,
            color: validatedData.color ?? "#000000"
        })

        return res.status(201).json({
            message: "Tag created successfully",
            data: tag
        })
    } catch (error) {
        next(error);
    }
};

export const updateTag = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tagId = req.params?.tagId as string | null;
    if (!tagId) return res.status(400).json({ message: "Tag ID is required" });

    const validatedData = updateTagSchema.parse(req.body);
    const tag = await tagService.updateTag(tagId, {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.color && { color: validatedData.color }),
    });

    return res.status(200).json({ message: "Tag updated successfully", data: tag });
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tagId = req.params?.tagId as string | null;
    if (!tagId) return res.status(400).json({ message: "Tag ID is required" });

    await tagService.deleteTag(tagId);

    return res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllTags = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tags = await tagService.getAllTags();

    return res.status(200).json({
      message: "Tags retrieved successfully",
      data: tags,
    });
  } catch (error) {
    next(error);
  }
};