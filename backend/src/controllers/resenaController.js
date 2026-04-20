import Resena from "../models/Resena.js";

// GET /api/resenas — obtener todas las aprobadas (últimas 20)
export const getResenas = async (req, res) => {
  try {
    const resenas = await Resena.find({ aprobada: true })
      .sort({ fecha: -1 })
      .limit(20)
      .select("nombre comentario estrellas fecha");
    res.json(resenas);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
};

// POST /api/resenas — crear nueva reseña
export const crearResena = async (req, res) => {
  try {
    const { nombre, comentario, estrellas } = req.body;
    if (!nombre || !comentario) {
      return res.status(400).json({ message: "Nombre y comentario son requeridos" });
    }
    const resena = await Resena.create({
      nombre: nombre.trim().slice(0, 80),
      comentario: comentario.trim().slice(0, 400),
      estrellas: Math.min(5, Math.max(1, Number(estrellas) || 5)),
    });
    res.status(201).json(resena);
  } catch (err) {
    res.status(500).json({ message: "Error al guardar reseña" });
  }
};
