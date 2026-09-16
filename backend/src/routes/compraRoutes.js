import express from "express"
import { enviarSolicitudCompra, getCompras, eliminarCompras, eliminarCompra, actualizarEstadoCompra } from "../controllers/compraController.js"
import { requireAdmin } from "../middleware/adminAuth.js"

const router = express.Router()

// Público: la solicitud de compra desde la página de productos.
router.post("/", enviarSolicitudCompra)

// Privado: solo el panel administrativo.
router.get("/", requireAdmin, getCompras)
router.delete("/", requireAdmin, eliminarCompras)
router.delete("/:id", requireAdmin, eliminarCompra)
router.patch("/:id/status", requireAdmin, actualizarEstadoCompra)

export default router
