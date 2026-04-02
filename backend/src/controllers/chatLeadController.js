import ChatLead from "../models/ChatLead.js";

export const crearChatLead = async (req, res) => {
  try {
    const nuevo = new ChatLead(req.body);
    await nuevo.save();
    res.status(201).json({ message: "Chat lead guardado" });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar chat lead" });
  }
};
