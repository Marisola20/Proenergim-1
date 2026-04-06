import Suscriptor from "../models/suscriptor.js"

export const suscribir = async (req, res) => {
  const { email } = req.body

  try {
    const existe = await Suscriptor.findOne({ email })
    if (existe) {
      return res.status(400).json({ success: false, message: "Este correo ya está suscrito" })
    }

    await Suscriptor.create({ email })
    res.status(201).json({ success: true, message: "¡Suscripción exitosa!" })

  } catch (error) {
    console.error("Error al suscribir:", error)
    res.status(500).json({ success: false, message: "Error al suscribir" })
  }
}

export const obtenerSuscriptors = async (req, res) => {
  try {
    const suscriptors = await Suscriptor.find().sort({ createdAt: -1 })
    res.json(suscriptors)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener suscriptores" })
  }
}

export const limpiarSuscriptors = async (req, res) => {
  try {
    await Suscriptor.deleteMany({})
    res.json({ success: true, message: "Suscriptores eliminados" })
  } catch (error) {
    res.status(500).json({ message: "Error al limpiar suscriptores" })
  }
}