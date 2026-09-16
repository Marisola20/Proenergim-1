import mongoose from "mongoose"

// Una sola dirección, sin comas, puntos y comas ni ángulos: ese valor termina
// como destinatario SMTP, y una lista camuflada convertiría una fila en un
// envío masivo a terceros.
export const EMAIL_UNICO = /^[^\s@,;<>]+@[^\s@,;<>.]+\.[^\s@,;<>]+$/

const suscriptorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 254, // longitud máxima de una dirección según RFC 5321
    match: [EMAIL_UNICO, "El correo no tiene un formato válido"],
  },
  estado: {
    type: String,
    enum: ["Pendiente", "En Proceso", "Completado", "Cancelado"],
    default: "Pendiente"
  },
}, { timestamps: true })

export default mongoose.model("Suscriptor", suscriptorSchema)
