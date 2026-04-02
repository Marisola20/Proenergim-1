import mongoose from "mongoose";

const chatLeadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    default: "Visitante"
  },
  ciudad: String,
  tema: String,
  origen: {
    type: String,
    default: "chat_flotante"
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("ChatLead", chatLeadSchema);
