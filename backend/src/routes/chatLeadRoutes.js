import express from "express";
import {
  crearChatLead,
  enviarEmailChatLead,
  obtenerChatLeads,
  limpiarChatLeads,
  eliminarChatLead,
  actualizarEstadoChatLead
} from "../controllers/chatLeadController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Público: el chat flotante de la web.
router.post("/", crearChatLead);
router.post("/email", enviarEmailChatLead);

// Privado: solo el panel administrativo.
router.get("/", requireAdmin, obtenerChatLeads);
router.delete("/", requireAdmin, limpiarChatLeads);
router.delete("/:id", requireAdmin, eliminarChatLead);
router.patch("/:id/status", requireAdmin, actualizarEstadoChatLead);

export default router;
