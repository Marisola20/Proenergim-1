import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";
import chatLeadRoutes from "./routes/chatLeadRoutes.js";
import compraRoutes from "./routes/compraRoutes.js"
import suscriptorRoutes from "./routes/suscriptorRoutes.js"

dotenv.config();

// ── Validar variables de entorno críticas ───────────────────────────────────
const REQUIRED_ENV = ["MONGO_URI", "EMAIL_USER", "EMAIL_PASS", "EMAIL_DESTINO"];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error(`❌ Variables de entorno faltantes: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS restringido ─────────────────────────────────────────────────────────
const allowedOrigins = [
  "https://proenergim.com",
  "https://www.proenergim.com",
  process.env.NODE_ENV !== "production" && "http://localhost:5173",
  process.env.NODE_ENV !== "production" && "http://localhost:5000",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Permitir sin origin (apps móviles, Postman, mismo servidor)
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error("CORS bloqueado: " + origin));
  }
}));

// conectar a MongoDB
connectDB();
app.use(express.json());

// rutas
app.use("/api/leads", leadRoutes);
app.use("/api/chat-leads", chatLeadRoutes);
app.use("/api/compra", compraRoutes)
app.use("/api/suscriptors", suscriptorRoutes)

// test
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Proenergim API funcionando 🚀" });
});

// Sirve los archivos del build de Vite
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// Para que React Router funcione en todas las rutas
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});