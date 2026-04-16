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

export const eliminarSuscriptor = async (req, res) => {
  try {
    await Suscriptor.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "Suscriptor eliminado correctamente" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar suscriptor" })
  }
}

export const actualizarEstadoSuscriptor = async (req, res) => {
  try {
    const { estado } = req.body
    await Suscriptor.findByIdAndUpdate(req.params.id, { estado }, { new: true })
    res.json({ success: true, message: "Estado actualizado correctamente" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar estado" })
  }
}