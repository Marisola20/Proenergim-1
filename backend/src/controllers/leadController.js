import Lead from "../models/Lead.js";

export const crearLead = async (req, res) => {

  try {

    const nuevoLead = new Lead(req.body);

    await nuevoLead.save();

    res.status(201).json({
      message: "Lead guardado correctamente"
    });

  } catch (error) {

    res.status(500).json({
      error: "Error al guardar el lead"
    });

  }

}

export const obtenerLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ fecha: -1 })
    res.json(leads)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener leads" })
  }
}

export const limpiarLeads = async (req, res) => {
  try {
    await Lead.deleteMany({})
    res.json({ message: "Leads eliminados correctamente" })
  } catch (error) {
    res.status(500).json({ error: "Error al limpiar leads" })
  }
}