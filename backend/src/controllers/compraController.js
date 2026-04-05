import nodemailer from "nodemailer"
import Compra from "../models/compra.js"


export const enviarSolicitudCompra = async (req, res) => {
  const { nombre, celular, correo, descripcion, producto, precio } = req.body

  const mensaje = `🛒 *Nueva Solicitud de Compra - Proenergim*
  
*Producto:* ${producto}
*Precio:* S/. ${precio}
*Nombre:* ${nombre}
*Celular:* ${celular}
*Correo:* ${correo || "No proporcionado"}
*Descripción:* ${descripcion || "Sin descripción"}`
  try {
    // ── 1. Guardar en MongoDB ──
    // dentro del try, antes de enviar WhatsApp y correo:
    await Compra.create({ producto, precio, nombre, celular, correo, descripcion })
    
    // ── 2. Correo via Nodemailer ──
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DESTINO,
      subject: `🛒 Nueva solicitud de compra: ${producto}`,
      html: `
        <h2>Nueva Solicitud de Compra</h2>
        <p><b>Producto:</b> ${producto}</p>
        <p><b>Precio:</b> S/. ${precio}</p>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Celular:</b> ${celular}</p>
        <p><b>Correo:</b> ${correo || "No proporcionado"}</p>
        <p><b>Descripción:</b> ${descripcion || "Sin descripción"}</p>
      `,
    })

    res.json({ success: true, message: "Solicitud enviada correctamente" })

  } catch (error) {
    console.error("Error al enviar solicitud:", error)
    res.status(500).json({ success: false, message: "Error al enviar solicitud" })
  }
}

export const getCompras = async (req, res) => {
  try {
    const compras = await Compra.find().sort({ createdAt: -1 })
    res.json(compras)
  } catch (error) {
    console.error("Error al obtener compras:", error)
    res.status(500).json({ success: false, message: "Error al obtener compras" })
  }
}

export const eliminarCompras = async (req, res) => {
  try {
    await Compra.deleteMany({})
    res.json({ success: true, message: "Todas las compras han sido eliminadas" })
  } catch (error) {
    console.error("Error al eliminar compras:", error)
    res.status(500).json({ success: false, message: "Error al eliminar compras" })
  }
}