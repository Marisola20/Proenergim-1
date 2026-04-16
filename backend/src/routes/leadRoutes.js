import express from "express";
import { crearLead, obtenerLeads, limpiarLeads, eliminarLead, actualizarEstadoLead } from "../controllers/leadController.js";

const router = express.Router();

router.post("/", crearLead);
router.get("/", obtenerLeads);
router.delete("/", limpiarLeads);
router.delete("/:id", eliminarLead);
router.patch("/:id/status", actualizarEstadoLead);

export default router;