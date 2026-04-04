import ChatLead from "../models/ChatLead.js";

export const crearChatLead = async (req, res) => {
  try {
    const nuevo = new ChatLead(req.body);
    await nuevo.save();
    res.status(201).json({ message: "Chat lead guardado" });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar chat lead" });
  }
}

export const obtenerChatLeads = async (req, res) => {
  try {
    const leads = await ChatLead.find().sort({ fecha: -1 })
    res.json(leads)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener chat leads" })
  }
}

export const limpiarChatLeads = async (req, res) => {
  try {
    await ChatLead.deleteMany({})
    res.json({ message: "Chat leads eliminados" })
  } catch (error) {
    res.status(500).json({ error: "Error al limpiar" })
  }
}
