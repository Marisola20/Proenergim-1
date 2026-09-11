import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Configurar Cloudinary con las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar Multer para usar Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "proenergim_productos", // Carpeta en Cloudinary
    allowed_formats: ["jpg", "png", "webp", "jpeg"],
  },
});

const upload = multer({ storage: storage });

// Endpoint para subir imagen
router.post("/", requireAdmin, upload.single("imagen"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ninguna imagen" });
    }
    
    // Retornamos la URL pública segura que nos da Cloudinary
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error);
    res.status(500).json({ message: "Error al subir la imagen" });
  }
});

export default router;
