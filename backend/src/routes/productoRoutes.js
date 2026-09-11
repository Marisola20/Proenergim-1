import express from "express"
import {
  actualizarProducto,
  crearProducto,
  getProductosAdmin,
  getProductosPublicos,
} from "../controllers/productoController.js"
import { requireAdmin } from "../middleware/adminAuth.js"

const router = express.Router()

router.get("/", getProductosPublicos)
router.get("/admin", requireAdmin, getProductosAdmin)
router.post("/", requireAdmin, crearProducto)
router.put("/:id", requireAdmin, actualizarProducto)

export default router
