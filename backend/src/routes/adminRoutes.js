import express from "express"
import { iniciarSesionAdmin } from "../controllers/adminController.js"

const router = express.Router()

router.post("/login", iniciarSesionAdmin)

export default router
