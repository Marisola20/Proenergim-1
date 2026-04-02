import express from "express";
import { crearChatLead } from "../controllers/chatLeadController.js";

const router = express.Router();

router.post("/", crearChatLead);

export default router;
