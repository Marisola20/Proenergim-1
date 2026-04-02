import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true
  },

  telefono: {
    type: String,
    default: ""
  },

  ciudad: String,

  empresa: String,

  mensaje: String,

  origen: {
    type: String,
    default: "web"
  },

  fecha: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Lead", leadSchema);