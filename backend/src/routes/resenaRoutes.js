import express from "express";
import { getResenas, crearResena } from "../controllers/resenaController.js";

const router = express.Router();

router.get("/",  getResenas);
router.post("/", crearResena);

export default router;
