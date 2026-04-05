import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { uploadToCloudinary } from "../config/cloudinary";

const storage = multer.memoryStorage();
const uploader = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

export const uploadSingle = (field: string) => uploader.single(field);
export const uploadMultiple = (field: string, max: number) => uploader.array(field, max);

export interface UploadedFileResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

type UploadRequest = Request & { uploadedFile?: UploadedFileResult };

export const handleCloudinaryUpload = (folder: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: "No file uploaded" });
        return;
      }

      const result = await uploadToCloudinary(req.file.buffer, folder);
      (req as UploadRequest).uploadedFile = {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
