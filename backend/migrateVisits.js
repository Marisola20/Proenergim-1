import mongoose from "mongoose";
import dotenv from "dotenv";
import Visit from "./src/models/Visit.js";
import VisitLog from "./src/models/VisitLog.js";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Conectado a DB");

  const visitData = await Visit.findOne();
  if (!visitData || visitData.count === 0) {
    console.log("No hay visitas para migrar");
    process.exit(0);
  }

  const existingLogs = await VisitLog.countDocuments();
  if (existingLogs > 0) {
    console.log("Ya existen visit logs, borrando para sincronizar...");
    await VisitLog.deleteMany({});
  }

  const totalToCreate = visitData.count;
  console.log(`Creando ${totalToCreate} logs históricos de visitas...`);

  const logs = [];
  const now = new Date();
  
  // Distribuir en los últimos 30 días con mayor peso reciente
  for (let i = 0; i < totalToCreate; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    logs.push({ createdAt: d });
  }

  await VisitLog.insertMany(logs);
  console.log("Migración completada exitosamente.");
  process.exit(0);
}

run().catch(console.error);
