import mongoose from "mongoose"

// Código de un solo uso para el segundo factor del panel. Nunca se guarda el
// código en claro: solo su HMAC, igual que una contraseña.
const codigoAdminSchema = new mongoose.Schema({
  codigoHash: { type: String, required: true },
  expiraEn: { type: Date, required: true },
  intentos: { type: Number, default: 0 },
}, { timestamps: true })

// MongoDB elimina solo los códigos vencidos, sin necesidad de limpieza manual.
codigoAdminSchema.index({ expiraEn: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model("CodigoAdmin", codigoAdminSchema)
