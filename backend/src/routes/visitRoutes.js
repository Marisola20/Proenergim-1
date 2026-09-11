import express from "express";
import { incrementVisits, getVisits, getVisitLogs } from "../controllers/visitController.js";

const router = express.Router();

router.get("/", getVisits);
router.get("/logs", getVisitLogs);
router.post("/increment", incrementVisits);

export default router;
