import Visit from "../models/Visit.js";

export const incrementVisits = async (req, res) => {
  try {
    let visit = await Visit.findOne();
    if (!visit) {
      visit = new Visit({ count: 1 });
    } else {
      visit.count += 1;
    }
    await visit.save();
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
