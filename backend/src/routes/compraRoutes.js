import express from "express"
import { enviarSolicitudCompra, getCompras, eliminarCompras, eliminarCompra, actualizarEstadoCompra } from "../controllers/compraController.js"

const router = express.Router()

router.post("/", enviarSolicitudCompra)
router.get("/", getCompras)
router.delete("/", eliminarCompras)
router.delete("/:id", eliminarCompra)
router.patch("/:id/status", actualizarEstadoCompra)

export default router