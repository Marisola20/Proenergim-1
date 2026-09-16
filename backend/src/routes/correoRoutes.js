import express from "express"
import {
  enviarCorreo,
  previsualizarCorreo,
  listarPlantillas,
  crearPlantilla,
  actualizarPlantilla,
  eliminarPlantilla,
  listarHistorial,
} from "../controllers/correoController.js"
import { requireAdmin } from "../middleware/adminAuth.js"

const router = express.Router()

// Todo este módulo es de uso exclusivo del panel administrativo.
router.post("/enviar", requireAdmin, enviarCorreo)
router.post("/previsualizar", requireAdmin, previsualizarCorreo)
router.get("/historial", requireAdmin, listarHistorial)

router.get("/plantillas", requireAdmin, listarPlantillas)
router.post("/plantillas", requireAdmin, crearPlantilla)
router.put("/plantillas/:id", requireAdmin, actualizarPlantilla)
router.delete("/plantillas/:id", requireAdmin, eliminarPlantilla)

export default router
