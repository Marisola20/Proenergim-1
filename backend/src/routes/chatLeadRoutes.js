import express from "express";
import {
  crearChatLead,
  enviarEmailChatLead,
  obtenerChatLeads,
  limpiarChatLeads,
  eliminarChatLead,
  actualizarEstadoChatLead
} from "../controllers/chatLeadController.js";

const router = express.Router();

router.post("/", crearChatLead);
router.post("/email", enviarEmailChatLead);
router.get("/", obtenerChatLeads);
router.delete("/", limpiarChatLeads);
router.delete("/:id", eliminarChatLead);
router.patch("/:id/status", actualizarEstadoChatLead);

export default router;

