import express from "express"
import { suscribir, obtenerSuscriptors, limpiarSuscriptors, eliminarSuscriptor, actualizarEstadoSuscriptor } from "../controllers/suscriptorController.js"
import { requireAdmin } from "../middleware/adminAuth.js"

const router = express.Router()

// Público: el formulario de suscripción de la web.
router.post("/", suscribir)

// Privado: solo el panel administrativo.
router.get("/", requireAdmin, obtenerSuscriptors)
router.delete("/", requireAdmin, limpiarSuscriptors)
router.delete("/:id", requireAdmin, eliminarSuscriptor)
router.patch("/:id/status", requireAdmin, actualizarEstadoSuscriptor)

export default router
