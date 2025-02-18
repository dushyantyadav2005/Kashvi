import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import express from "express";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Dresses-Images", // Organize images into a folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // Allowed formats
    transformation: [{ width: 600, height: 600, crop: "limit" }], // Optional: resize images
  },
});

const upload = multer({ storage });

const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Image uploaded successfully",
        image: req.file.path, // Cloudinary URL
      });
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;