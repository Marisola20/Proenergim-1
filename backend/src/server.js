import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";
import chatLeadRoutes from "./routes/chatLeadRoutes.js";
import compraRoutes from "./routes/compraRoutes.js";
import suscriptorRoutes from "./routes/suscriptorRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";

dotenv.config();

// ── Validar variables de entorno críticas ───────────────────────────────────
const REQUIRED_ENV = ["MONGO_URI", "EMAIL_USER", "EMAIL_PASS", "EMAIL_DESTINO"];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error(`Variables de entorno faltantes: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();

// ── CORS restringido ─────────────────────────────────────────────────────────
const allowedOrigins = [
  "https://proenergim.com",
  "https://www.proenergim.com",
  // Permitir previews de Vercel (*.vercel.app) automáticamente
  process.env.NODE_ENV !== "production" && "http://localhost:5173",
  process.env.NODE_ENV !== "production" && "http://localhost:5000",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Permitir sin origin (apps móviles, Postman, mismo servidor)
    // También permitir subdominios de vercel.app para previews
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      cb(null, true);
    } else {
      cb(new Error("CORS bloqueado: " + origin));
    }
  }
}));

// conectar a MongoDB
connectDB();
app.use(express.json());

// ── Rutas ────────────────────────────────────────────────────────────────────
app.use("/api/leads", leadRoutes);
app.use("/api/chat-leads", chatLeadRoutes);
app.use("/api/compra", compraRoutes);
app.use("/api/suscriptors", suscriptorRoutes);
app.use("/api/visits", visitRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Proenergim API funcionando" });
});

// ✅ Solo escuchar en local; en Vercel el export es suficiente
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app; // Requerido por Vercel serverless