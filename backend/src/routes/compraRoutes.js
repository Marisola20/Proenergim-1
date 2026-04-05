import express from "express"
import { enviarSolicitudCompra } from "../controllers/compraController.js"

const router = express.Router()

router.post("/", enviarSolicitudCompra)

export default router