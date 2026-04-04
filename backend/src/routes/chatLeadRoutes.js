import express from "express";
import { crearChatLead, obtenerChatLeads, limpiarChatLeads } from "../controllers/chatLeadController.js";

const router = express.Router();

router.post("/", crearChatLead);
router.get("/", obtenerChatLeads)      
router.delete("/", limpiarChatLeads)   

export default router;
