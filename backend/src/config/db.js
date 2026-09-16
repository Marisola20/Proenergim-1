import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB conectado");
  } catch (error) {
    // No se mata el proceso a propósito. En una función serverless, process.exit()
    // la deja muerta y sin logs: cualquier ruta responde un 500 opaco y no hay
    // forma de saber qué pasó. Mejor registrar el motivo y que las peticiones
    // que necesiten la base de datos fallen con un error legible.
    console.error("Error de conexión a MongoDB:", error.message);
  }
};

export default connectDB;