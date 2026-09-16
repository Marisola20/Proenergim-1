import mongoose from "mongoose"

const envioCorreoSchema = new mongoose.Schema({
  asunto: { type: String, required: true },
  cuerpo: { type: String, required: true },
  // Nombre de la plantilla usada, si el envío salió de una
  plantilla: { type: String, default: null },
  total: { type: Number, default: 0 },
  enviados: { type: Number, default: 0 },
  fallidos: { type: Number, default: 0 },
  destinatarios: [{ type: String }],
  errores: [{
    email: String,
    motivo: String,
    _id: false,
  }],
}, { timestamps: true })

export default mongoose.model("EnvioCorreo", envioCorreoSchema)
