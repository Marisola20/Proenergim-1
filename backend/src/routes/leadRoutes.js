import express from "express";
import { crearLead, obtenerLeads, limpiarLeads } from "../controllers/leadController.js";

const router = express.Router();

router.post("/", crearLead);
router.get("/", obtenerLeads)        // ← Obtener leads
router.delete("/", limpiarLeads)     // ← limpiar leads

export default router;