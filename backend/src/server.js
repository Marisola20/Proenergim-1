import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";

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

// test
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Proenergim API funcionando 🚀" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});