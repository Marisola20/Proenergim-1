import express from "express";
import { crearLead } from "../controllers/leadController.js";

const router = express.Router();

router.post("/", crearLead);

export default router;