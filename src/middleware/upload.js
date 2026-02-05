import multer from "multer";

// Memory storage - files uploaded to Cloudinary in controller via utils/cloudinaryUpload.js
// (multer-storage-cloudinary may need separate install - using memory storage instead)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(file.mimetype);
    if (ext) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png, gif, webp) are allowed"));
    }
  },
});

export default upload;
