import express from "express"
import { suscribir, obtenerSuscriptors, limpiarSuscriptors, eliminarSuscriptor, actualizarEstadoSuscriptor } from "../controllers/suscriptorController.js"

const router = express.Router()

router.post("/", suscribir)
router.get("/", obtenerSuscriptors)
router.delete("/", limpiarSuscriptors)
router.delete("/:id", eliminarSuscriptor)
router.patch("/:id/status", actualizarEstadoSuscriptor)

export default router