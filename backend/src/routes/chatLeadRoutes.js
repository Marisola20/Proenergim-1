import express from "express";
import {
  crearChatLead,
  enviarEmailChatLead,
  obtenerChatLeads,
  limpiarChatLeads
} from "../controllers/chatLeadController.js";

const router = express.Router();

router.post("/", crearChatLead);
router.post("/email", enviarEmailChatLead);   // ← lead por email
router.get("/", obtenerChatLeads);
router.delete("/", limpiarChatLeads);

export default router;
