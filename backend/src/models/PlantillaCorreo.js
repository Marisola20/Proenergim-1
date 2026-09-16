import mongoose from "mongoose"

const plantillaCorreoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  asunto: {
    type: String,
    required: true,
    trim: true,
  },
  cuerpo: {
    type: String,
    required: true,
  },
}, { timestamps: true })

export default mongoose.model("PlantillaCorreo", plantillaCorreoSchema)
