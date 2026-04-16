import ChatLead from "../models/ChatLead.js";
import nodemailer from "nodemailer";

export const crearChatLead = async (req, res) => {
  try {
    const nuevo = new ChatLead(req.body);
    await nuevo.save();
    res.status(201).json({ message: "Chat lead guardado" });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar chat lead" });
  }
}

export const enviarEmailChatLead = async (req, res) => {
  const { nombre, ubicacion, tema } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DESTINO,
      subject: `💬 Nuevo lead del chat web — ${nombre}`,
      html: `
        <h2 style="color:#0369a1;font-family:sans-serif">Nuevo lead desde el chat flotante</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
          <tr><td style="padding:6px 12px;font-weight:bold">Nombre</td><td style="padding:6px 12px">${nombre}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Ubicación del proyecto</td><td style="padding:6px 12px">${ubicacion}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Consulta</td><td style="padding:6px 12px">${tema}</td></tr>
        </table>
        <hr style="margin-top:20px"/>
        <p style="color:#666;font-size:12px;font-family:sans-serif">Enviado automáticamente desde proenergim.com</p>
      `
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error enviando email del chat:", error);
    res.status(500).json({ success: false });
  }
}

export const obtenerChatLeads = async (req, res) => {
  try {
    const leads = await ChatLead.find().sort({ fecha: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener chat leads" });
  }
}

export const limpiarChatLeads = async (req, res) => {
  try {
    await ChatLead.deleteMany({});
    res.json({ message: "Chat leads eliminados" });
  } catch (error) {
    res.status(500).json({ error: "Error al limpiar" });
  }
}

export const eliminarChatLead = async (req, res) => {
  try {
    await ChatLead.findByIdAndDelete(req.params.id)
    res.json({ message: "Chat lead eliminado" })
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" })
  }
}

export const actualizarEstadoChatLead = async (req, res) => {
  try {
    const { estado } = req.body
    await ChatLead.findByIdAndUpdate(req.params.id, { estado }, { new: true })
    res.json({ message: "Estado actualizado" })
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar estado" })
  }
}

