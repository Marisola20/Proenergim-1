import mongoose from "mongoose"

const productoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  categoria: {
    type: String,
    enum: ["variadores", "accesorios"],
    required: true,
  },
  titulo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 180,
  },
  marca: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  imagen: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  garantiaAnos: {
    type: Number,
    required: true,
    min: 0,
    max: 20,
    default: 2,
  },
  orden: {
    type: Number,
    required: true,
    min: 1,
  },
}, { timestamps: true })

export default mongoose.model("Producto", productoSchema)
