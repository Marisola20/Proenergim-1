import express from "express";
import { incrementVisits, getVisits, getVisitLogs } from "../controllers/visitController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Público: el contador de visitas que se muestra en la web.
router.get("/", getVisits);
router.post("/increment", incrementVisits);

// Privado: el historial de visitas del panel. El modelo VisitLog solo guarda
// la marca de tiempo de cada visita — no registra IP ni navegador.
router.get("/logs", requireAdmin, getVisitLogs);

export default router;
