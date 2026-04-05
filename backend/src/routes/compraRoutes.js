import express from "express"
import { enviarSolicitudCompra, getCompras, eliminarCompras } from "../controllers/compraController.js"

const router = express.Router()

router.post("/", enviarSolicitudCompra)
router.get("/", getCompras)
router.delete("/", eliminarCompras)

export default router