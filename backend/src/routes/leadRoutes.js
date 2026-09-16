import express from "express";
import { crearLead, obtenerLeads, limpiarLeads, eliminarLead, actualizarEstadoLead } from "../controllers/leadController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Público: el formulario de contacto de la web.
router.post("/", crearLead);

// Privado: solo el panel administrativo.
router.get("/", requireAdmin, obtenerLeads);
router.delete("/", requireAdmin, limpiarLeads);
router.delete("/:id", requireAdmin, eliminarLead);
router.patch("/:id/status", requireAdmin, actualizarEstadoLead);

export default router;
