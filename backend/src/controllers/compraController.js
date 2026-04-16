import nodemailer from "nodemailer"
import Compra from "../models/compra.js"

// ── Transporter (lazy init — dotenv ya cargó cuando se llama por primera vez) ──
let transporter = null
function getTransporter() {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("EMAIL_USER o EMAIL_PASS no configurados — el correo no se enviará")
      return null
    }
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }
  return transporter
}

// ─────────────────────────────────────────────────────────────────────────────
export const enviarSolicitudCompra = async (req, res) => {
  const { nombre, celular, correo, descripcion, producto, precio } = req.body

  const mensajeWA = encodeURIComponent(
    `🛒 *Nueva Solicitud de Compra - Proenergim*\n\n*Producto:* ${producto}\n*Precio:* S/. ${precio}\n*Nombre:* ${nombre}\n*Celular:* ${celular}\n*Correo:* ${correo || "No proporcionado"}\n*Descripción:* ${descripcion || "Sin descripción"}`
  )

  // Normaliza el número para wa.me: quita espacios/guiones/+ y agrega código Perú (51) si falta
  const celularLimpio = celular.replace(/[\s\-+]/g, "")
  const celularWA = celularLimpio.startsWith("51") ? celularLimpio : `51${celularLimpio}`

  try {
    // ── 0. Calcular correlativo ──
    const total = await Compra.countDocuments()
    const correlativo = (total + 1).toString().padStart(2, '0')

    // ── 1. Guardar en MongoDB ──
    await Compra.create({ producto, precio, nombre, celular, correo, descripcion })

    // ── 2. Correo via Nodemailer (no bloquea si falla) ──
    try {
      const mail = getTransporter()
      if (mail) {
        await mail.sendMail({
          from: `"Proenergim-App" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_DESTINO,
          subject: `Solicitud #${correlativo} — ${nombre}`,
          html: 
          `<!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1.0">
            <title>Solicitud de Compra</title>
          </head>
          <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 15px;">
            <tr><td align="center">

            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;">

              <!-- HEADER -->
              <tr>
                <td align="center" style="background:#fff; border-bottom: 1px solid var(--color-text-gradient-2);padding:20px 30px;">
                  <h2 style="margin:0;color:#0f4c81;font-size:22px;font-weight:700;">Nueva Solicitud de Compra</h2>
                  <p style="margin:8px 0 0;color:#0f4c81;font-size:13px;">Notificación automática</p>
                </td>
              </tr>

              <!-- INTRO -->
              <tr>
                <td style="padding:10px 34px;">
                  <p style="margin:0;font-size:14px;color:#475569;">
                    Un cliente registró una nueva solicitud. Aquí tienes todos los detalles:
                  </p>
                </td>
              </tr>

              <!-- PRODUCTO DESTACADO -->
              <tr>
                <td style="padding:18px 35px 0;">
                  <table width="100%" cellpadding="16" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;">
                    <tr>
                      <td style="padding-bottom:4px;">
                        <img src="https://img.icons8.com/ios/48/0284c7/box.png" width="18" style="vertical-align:middle;">
                        <span style="font-size:11px;font-weight:bold;color:#0284c7;letter-spacing:1.5px;margin-left:6px;vertical-align:middle;">PRODUCTO SOLICITADO</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 14px;font-size:20px;font-weight:bold;color:#0f172a;">${producto}</td>
                    </tr>
                    <tr>
                      <td style="padding-top:4px;">
                        <span style="display:inline-block;background:#16a34a;color:#fff;font-size:16px;font-weight:700;padding:4px 14px; margin-top: 10px; border-radius:20px;">S/. ${precio}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- DATOS DEL CLIENTE -->
              <tr>
                <td style="padding:22px 35px 0;">
                  <p style="margin:0 0 14px;font-size:11px;font-weight:bold;color:#64748b;letter-spacing:2px;">Datos del cliente</p>

                  <!-- Fila 1: Nombre + Celular -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="49%" valign="top" style="padding-right:8px;padding-bottom:12px;">
                        <table width="100%" cellpadding="12" cellspacing="0" style="background:#f8fafc;border:1px solid #dbeafe;border-radius:10px;">
                          <tr><td style="font-size:11px;color:#0284c7;font-weight:bold;padding-bottom:4px;">
                            <img src="https://img.icons8.com/ios/48/0284c7/user.png" width="14" style="vertical-align:middle;margin-right:5px;">NOMBRE
                          </td></tr>
                          <tr><td style="font-size:14px;color:#0f172a;padding-top:0;font-weight:bold;">${nombre}</td></tr>
                        </table>
                      </td>
                      <td width="49%" valign="top" style="padding-left:8px;padding-bottom:12px;">
                        <table width="100%" cellpadding="12" cellspacing="0" style="background:#f8fafc;border:1px solid #dbeafe;border-radius:10px;">
                          <tr><td style="font-size:11px;color:#0284c7;font-weight:bold;padding-bottom:4px;">
                            <img src="https://img.icons8.com/ios/48/0284c7/phone.png" width="14" style="vertical-align:middle;margin-right:5px;">CELULAR
                          </td></tr>
                          <tr><td style="font-size:14px;color:#0f172a;padding-top:0;">
                            <a href="tel:${celular}" style="color:#0f172a;text-decoration:none;font-weight:bold;">${celular}</a>
                          </td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Fila 2: Correo -->
                  <table width="100%" cellpadding="12" cellspacing="0" style="background:#f8fafc;border:1px solid #dbeafe;border-radius:10px;margin-bottom:12px;">
                    <tr><td style="font-size:11px;color:#0284c7;font-weight:bold;padding-bottom:4px;">
                      <img src="https://img.icons8.com/ios/48/0284c7/mail.png" width="14" style="vertical-align:middle;margin-right:5px;">CORREO ELECTRÓNICO
                    </td></tr>
                    <tr><td style="font-size:14px;color:#0f172a;padding-top:0;font-weight:bold;">${correo || "No proporcionado"}</td></tr>
                  </table>

                  <!-- Fila 3: Descripción -->
                  <table width="100%" cellpadding="12" cellspacing="0" style="background:#f8fafc;border:1px solid #dbeafe;border-radius:10px;">
                    <tr><td style="font-size:11px;color:#0284c7;font-weight:bold;padding-bottom:4px;">
                      <img src="https://img.icons8.com/ios/48/0284c7/chat.png" width="14" style="vertical-align:middle;margin-right:5px;">DESCRIPCIÓN
                    </td></tr>
                    <tr><td style="font-size:14px;color:#0f172a;padding-top:0;font-weight:bold;">${descripcion || "Sin descripción"}</td></tr>
                  </table>
                </td>
              </tr>

              <!-- BOTÓN WHATSAPP -->
              <tr>
                <td style="padding:28px 35px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="https://wa.me/${celularWA}?text=Hola%20${encodeURIComponent(nombre)}%2C%20nos%20comunicamos%20contigo%20sobre%20tu%20solicitud%20sobre%20la%20compra%20del%20producto%20${encodeURIComponent(producto)}"
                          style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:30px;font-weight:bold;font-size:15px;">
                          <img src="https://img.icons8.com/ios/48/ffffff/whatsapp.png" width="20" style="vertical-align:middle;margin-right:8px;">
                          Contactar por WhatsApp
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td align="center" style="background:#f8fafc;padding:18px 35px;border-top:1px solid #e2e8f0;">
                  <p style="margin:0;font-size:12px;color:#64748b;">
                    © ${new Date().getFullYear()} Proenergim &nbsp;·&nbsp; proenergim.com &nbsp;·&nbsp; Sistema automático
                  </p>
                </td>
              </tr>

            </table>

          </td></tr>
          </table>

          </body>
          </html>`,
        })
        console.log("Email enviado correctamente")
      }
    } catch (emailErr) {
      console.error("Error email (no bloquea):", emailErr.message)
    }

    // ── 3. WhatsApp via CallMeBot ──
    if (process.env.WA_PHONE && process.env.WA_APIKEY) {
      const waUrl = `https://api.callmebot.com/whatsapp.php?phone=${process.env.WA_PHONE}&apikey=${process.env.WA_APIKEY}&text=${mensajeWA}`
      await fetch(waUrl)
        .then(r => console.log("WhatsApp enviado, status:", r.status))
        .catch(err => console.error("Error WhatsApp:", err.message))
    } else {
      console.warn("WA_PHONE o WA_APIKEY no configurados")
    }

    res.json({ success: true, message: "Solicitud enviada correctamente" })

  } catch (error) {
    console.error("Error al guardar solicitud:", error)
    res.status(500).json({ success: false, message: "Error al guardar solicitud" })
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

export const eliminarCompra = async (req, res) => {
  try {
    await Compra.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "Compra eliminada correctamente" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar compra" })
  }
}

export const actualizarEstadoCompra = async (req, res) => {
  try {
    const { estado } = req.body
    await Compra.findByIdAndUpdate(req.params.id, { estado }, { new: true })
    res.json({ success: true, message: "Estado actualizado correctamente" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar estado" })
  }
}