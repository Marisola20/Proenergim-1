import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  comentario: {
    type: String,
    required: true,
    trim: true,
    maxlength: 400,
  },
  estrellas: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  aprobada: {
    type: Boolean,
    default: true, // puedes cambiar a false si quieres moderación manual
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Resena", resenaSchema);
