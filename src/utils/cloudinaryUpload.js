import { v2 as cloudinary } from "cloudinary";

/**
 * Upload a buffer (from multer) to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from req.file.buffer
 * @param {string} folder - Cloudinary folder (e.g. "portfolio/projects")
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinary = async (fileBuffer, folder = "portfolio/projects") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete an image from Cloudinary by public_id
 */
export const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
