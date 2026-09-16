import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";
import chatLeadRoutes from "./routes/chatLeadRoutes.js";
import compraRoutes from "./routes/compraRoutes.js";
import suscriptorRoutes from "./routes/suscriptorRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import resenaRoutes from "./routes/resenaRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import correoRoutes from "./routes/correoRoutes.js";

dotenv.config();

// ── Validar variables de entorno críticas ───────────────────────────────────
const REQUIRED_ENV = [
  "MONGO_URI", "EMAIL_USER", "EMAIL_PASS", "EMAIL_DESTINO",
  // Sin estas dos el panel administrativo no tiene llave propia: se exigen
  // explícitamente para que nunca vuelva a existir una contraseña de respaldo.
  "ADMIN_PASSWORD", "ADMIN_TOKEN_SECRET",
  // Destinatarios del código de verificación en dos pasos (separados por comas)
  "ADMIN_2FA_EMAILS",
];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error(`Variables de entorno faltantes: ${missing.join(", ")}`);
  // En local conviene parar en seco para darse cuenta enseguida. En serverless
  // no: matar el proceso deja la función sin logs y devolviendo 500 en todo,
  // que es justo lo que impide diagnosticar el problema.
  if (!process.env.VERCEL) process.exit(1);
}

const app = express();

// ── CORS restringido ─────────────────────────────────────────────────────────
const allowedOrigins = [
  "https://proenergim.com",
  "https://www.proenergim.com",
];

const isLocalDevelopmentOrigin = (origin) =>
  process.env.NODE_ENV !== "production" &&
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(cors({
  origin: (origin, cb) => {
    // Permitir sin origin (apps móviles, Postman, mismo servidor)
    // También permitir subdominios de vercel.app para previews
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      isLocalDevelopmentOrigin(origin) ||
      /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)
    ) {
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
app.use("/api/resenas", resenaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/correos", correoRoutes);

// Raíz: para que entrar a la URL del API no devuelva un "Cannot GET /" que
// parece un error. No expone versiones ni nada del entorno.
app.get("/", (req, res) => {
  res.json({
    api: "Proenergim",
    estado: "ok",
    web: "https://proenergim.com",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Proenergim API funcionando" });
});

// Solo escuchar en local; en Vercel basta con exportar la app.
// Se comprueba VERCEL, que la propia plataforma define, en vez de NODE_ENV:
// si alguien borra o escribe mal NODE_ENV, la función intentaría abrir un
// puerto y moriría sin dejar rastro.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app; // Requerido por Vercel serverless
