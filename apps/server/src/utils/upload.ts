import multer from "multer";
import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../config/cloudinary.js";

export const upload = multer({ storage: multer.memoryStorage() });

export const uploadBufferToCloudinary = (buffer: Buffer, folder: string): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error("Cloudinary upload failed"));
        return;
      }
      resolve(result);
    });

    stream.end(buffer);
  });
