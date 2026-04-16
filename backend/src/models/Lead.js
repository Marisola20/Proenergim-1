import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({

  ciudad: String,
  empresa: String,
  mensaje: String,

  nombre: {
    type: String,
    required: true
  },

  telefono: {
    type: String,
    default: ""
  },

  origen: {
    type: String,
    default: "web"
  },

  estado: {
    type: String,
    enum: ["Pendiente", "En Proceso", "Completado", "Cancelado"],
    default: "Pendiente"
  },

  fecha: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Lead", leadSchema);