import multer from "multer";
import cloudinary from "../../config/cloudinary";
import AppError from "../errorhelpers/AppError";
import status from "http-status";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max
  },
});

export interface ICloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string = "surahsphere",
  resourceType: "image" | "video" | "raw" | "auto" = "auto"
): Promise<ICloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          const isConfigError =
            error?.message?.includes("cloud_name") ||
            error?.http_code === 401 ||
            error?.message?.includes("Must supply api_key");
          const errorMsg = isConfigError
            ? `Cloudinary Configuration Error: ${error?.message || "Invalid credentials"}. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your backend .env file.`
            : (error?.message || "Failed to upload file to Cloudinary");

          return reject(
            new AppError(status.BAD_REQUEST, errorMsg)
          );
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};
