import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";
import chatLeadRoutes from "./routes/chatLeadRoutes.js";
import compraRoutes from "./routes/compraRoutes.js"
import suscriptorRoutes from "./routes/suscriptorRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// conectar a MongoDB
connectDB();

// middlewares
app.use(cors());
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});