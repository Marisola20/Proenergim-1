import express from "express";
import { incrementVisits, getVisits, getVisitLogs } from "../controllers/visitController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Público: el contador de visitas que se muestra en la web.
router.get("/", getVisits);
router.post("/increment", incrementVisits);

// Privado: el detalle de visitas del panel (IP, navegador, procedencia).
router.get("/logs", requireAdmin, getVisitLogs);

export default router;
