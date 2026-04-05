import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from "cloudinary";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
  options: UploadApiOptions = {}
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        ...options
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
