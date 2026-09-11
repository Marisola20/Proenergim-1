import Visit from "../models/Visit.js";
import VisitLog from "../models/VisitLog.js";

export const incrementVisits = async (req, res) => {
  try {
    let visit = await Visit.findOne();
    if (!visit) {
      visit = new Visit({ count: 1 });
    } else {
      visit.count += 1;
    }
    await Promise.all([
      visit.save(),
      VisitLog.create({}),
    ]);
    res.json({ success: true, count: visit.count });
  } catch (error) {
    console.error("Error al incrementar visitas:", error);
    res.status(500).json({ error: "Error al registrar visita" });
  }
};

export const getVisits = async (req, res) => {
  try {
    const visit = await Visit.findOne();
    res.json({ count: visit ? visit.count : 0 });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener visitas" });
  }
};

export const getVisitLogs = async (req, res) => {
  try {
    // Devuelve solo las fechas de los últimos 6 meses para el gráfico
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const logs = await VisitLog.find(
      { createdAt: { $gte: sixMonthsAgo } },
      { createdAt: 1, _id: 0 }
    ).lean();

    res.json(logs);
  } catch (error) {
    console.error("Error al obtener logs de visitas:", error);
    res.status(500).json({ error: "Error al obtener historial de visitas" });
  }
};
