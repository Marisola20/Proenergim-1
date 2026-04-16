import mongoose from "mongoose"

const suscriptorSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  estado: {
    type: String,
    enum: ["Pendiente", "En Proceso", "Completado", "Cancelado"],
    default: "Pendiente"
  },
}, { timestamps: true })

export default mongoose.model("Suscriptor", suscriptorSchema)