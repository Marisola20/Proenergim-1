import express from "express"
import { suscribir, obtenerSuscriptors, limpiarSuscriptors } from "../controllers/suscriptorController.js"

const router = express.Router()

router.post("/", suscribir)
router.get("/", obtenerSuscriptors)
router.delete("/", limpiarSuscriptors)

export default router