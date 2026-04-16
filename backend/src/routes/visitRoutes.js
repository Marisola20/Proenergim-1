import express from "express";
import { incrementVisits, getVisits } from "../controllers/visitController.js";

const router = express.Router();

router.get("/", getVisits);
router.post("/increment", incrementVisits);

export default router;
