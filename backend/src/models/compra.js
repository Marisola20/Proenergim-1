import mongoose from "mongoose"

const compraSchema = new mongoose.Schema({
  producto: { type: String, required: true },
  precio: { type: String, required: true },
  nombre: { type: String, required: true },
  celular: { type: String, required: true },
  correo: { type: String, default: "" },
  descripcion: { type: String, default: "" },
  estado: {
    type: String,
    enum: ["Pendiente", "En Proceso", "Completado", "Cancelado"],
    default: "Pendiente"
  },
}, { timestamps: true })

export default mongoose.model("Compra", compraSchema)