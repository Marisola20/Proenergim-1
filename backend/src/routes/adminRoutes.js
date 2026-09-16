import express from "express"
import { iniciarSesionAdmin, verificarCodigoAdmin } from "../controllers/adminController.js"

const router = express.Router()

// Paso 1: contraseña correcta → se envía un código al correo autorizado.
router.post("/login", iniciarSesionAdmin)

// Paso 2: código correcto → se entrega el token de sesión.
router.post("/verificar", verificarCodigoAdmin)

export default router
