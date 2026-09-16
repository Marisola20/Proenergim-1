import Suscriptor, { EMAIL_UNICO } from "../models/suscriptor.js"
import PlantillaCorreo from "../models/PlantillaCorreo.js"
import EnvioCorreo from "../models/EnvioCorreo.js"
import { getTransporter, escaparHtml, maquetarCorreo } from "../config/mailer.js"

// Tandas pequeñas con pausa corta: evita el throttling de Gmail sin agotar
// el tiempo máximo de ejecución de la función serverless.
const LOTE = 8
const PAUSA_MS = 400

const formatearFecha = (fecha) => fecha
  ? new Date(fecha).toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" })
  : ""

// Sustituye {{variable}} por el dato del suscriptor. Deja intacto lo que no reconoce.
const renderizar = (texto, datos, escapar) => String(texto).replace(
  /\{\{\s*(\w+)\s*\}\}/g,
  (original, clave) => {
    if (!(clave in datos)) return original
    return escapar ? escaparHtml(datos[clave]) : String(datos[clave] ?? "")
  }
)

// El panel escribe texto plano. Se escapa primero (los {{}} sobreviven al
// escapado) y luego se arma el HTML de párrafos.
const textoAHtml = (texto) => escaparHtml(texto)
  .split(/\n{2,}/)
  .map(parrafo => `<p style="margin:0 0 14px;">${parrafo.replace(/\n/g, "<br>")}</p>`)
  .join("")

// Cabecera y pie propios del boletín: estos correos sí van a suscriptores, así
// que el pie explica por qué lo reciben (y no el genérico de sistema interno).
const MARCA_BOLETIN = {
  titulo: "Proenergim E.I.R.L.",
  subtitulo: "Energía solar que transforma tu mundo",
  pie: `Recibes este correo porque te suscribiste en <a href="https://proenergim.com" style="color:#0f4c81;text-decoration:none;">proenergim.com</a>.`,
}

// ── Envío ────────────────────────────────────────────────────────────────────
export const enviarCorreo = async (req, res) => {
  const { asunto, cuerpo, emails, plantilla = null } = req.body

  if (!asunto?.trim() || !cuerpo?.trim()) {
    return res.status(400).json({ success: false, message: "El asunto y el mensaje son obligatorios" })
  }
  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ success: false, message: "Selecciona al menos un destinatario" })
  }

  const mail = getTransporter()
  if (!mail) {
    return res.status(503).json({
      success: false,
      message: "El servidor de correo no está configurado (falta EMAIL_USER o EMAIL_PASS)",
    })
  }

  try {
    // Solo se envía a correos que sigan en la lista de suscriptores:
    // así un email suelto o ya eliminado nunca recibe nada.
    const normalizados = emails.map(e => String(e).toLowerCase().trim())
    const suscriptores = await Suscriptor.find({ email: { $in: normalizados } })

    if (suscriptores.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Ninguno de los correos seleccionados sigue en la lista de suscriptores",
      })
    }

    // Defensa en profundidad: aunque el modelo ya valida el formato, cualquier
    // fila guardada antes de esa validación podría esconder una lista de
    // direcciones ("a@b.com, victima@x.com"), y nodemailer la expandiría en
    // varios destinatarios reales. Aquí no pasa nada que no sea una dirección.
    const validos = []
    const errores = []

    for (const suscriptor of suscriptores) {
      if (EMAIL_UNICO.test(suscriptor.email)) {
        validos.push(suscriptor)
      } else {
        errores.push({ email: suscriptor.email, motivo: "Dirección con formato inválido: no se envió" })
      }
    }

    const cuerpoHtmlBase = textoAHtml(cuerpo)
    const enviados = []

    for (let i = 0; i < validos.length; i += LOTE) {
      const tanda = validos.slice(i, i + LOTE)

      await Promise.all(tanda.map(async (suscriptor) => {
        const datos = {
          email: suscriptor.email,
          estado: suscriptor.estado,
          fecha: formatearFecha(suscriptor.createdAt),
        }
        try {
          await mail.sendMail({
            from: `"Proenergim E.I.R.L." <${process.env.EMAIL_USER}>`,
            // Objeto explícito: nodemailer lo trata como UNA dirección literal
            // en vez de reparsear la cadena como lista de destinatarios.
            to: { name: "", address: suscriptor.email },
            subject: renderizar(asunto, datos, false),
            html: maquetarCorreo({
              ...MARCA_BOLETIN,
              asunto,
              cuerpoHtml: renderizar(cuerpoHtmlBase, datos, true),
            }),
          })
          enviados.push(suscriptor.email)
        } catch (error) {
          errores.push({ email: suscriptor.email, motivo: error.message || "Error desconocido" })
        }
      }))

      if (i + LOTE < validos.length) {
        await new Promise(resolve => setTimeout(resolve, PAUSA_MS))
      }
    }

    const envio = await EnvioCorreo.create({
      asunto,
      cuerpo,
      plantilla,
      total: suscriptores.length,
      enviados: enviados.length,
      fallidos: errores.length,
      destinatarios: enviados,
      errores,
    })

    res.json({
      success: errores.length === 0,
      message: errores.length === 0
        ? `Correo enviado a ${enviados.length} suscriptor(es)`
        : `Se enviaron ${enviados.length} de ${suscriptores.length}. Fallaron ${errores.length}.`,
      envio,
    })
  } catch (error) {
    console.error("Error al enviar correos:", error)
    res.status(500).json({ success: false, message: "Error al enviar los correos" })
  }
}

// ── Vista previa (no envía nada) ─────────────────────────────────────────────
export const previsualizarCorreo = async (req, res) => {
  const { asunto, cuerpo, email } = req.body

  if (!asunto?.trim() || !cuerpo?.trim()) {
    return res.status(400).json({ success: false, message: "El asunto y el mensaje son obligatorios" })
  }

  try {
    const suscriptor = email
      ? await Suscriptor.findOne({ email: String(email).toLowerCase().trim() })
      : await Suscriptor.findOne().sort({ createdAt: -1 })

    const datos = {
      email: suscriptor?.email || "ejemplo@correo.com",
      estado: suscriptor?.estado || "Pendiente",
      fecha: formatearFecha(suscriptor?.createdAt) || formatearFecha(new Date()),
    }

    res.json({
      success: true,
      asunto: renderizar(asunto, datos, false),
      html: maquetarCorreo({
        ...MARCA_BOLETIN,
        asunto,
        cuerpoHtml: renderizar(textoAHtml(cuerpo), datos, true),
      }),
      datos,
    })
  } catch (error) {
    console.error("Error al previsualizar:", error)
    res.status(500).json({ success: false, message: "Error al generar la vista previa" })
  }
}

// ── Plantillas ───────────────────────────────────────────────────────────────
export const listarPlantillas = async (_req, res) => {
  try {
    const plantillas = await PlantillaCorreo.find().sort({ updatedAt: -1 })
    res.json(plantillas)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las plantillas" })
  }
}

export const crearPlantilla = async (req, res) => {
  const { nombre, asunto, cuerpo } = req.body

  if (!nombre?.trim() || !asunto?.trim() || !cuerpo?.trim()) {
    return res.status(400).json({ success: false, message: "Nombre, asunto y mensaje son obligatorios" })
  }

  try {
    const plantilla = await PlantillaCorreo.create({
      nombre: nombre.trim(),
      asunto: asunto.trim(),
      cuerpo,
    })
    res.status(201).json({ success: true, message: "Plantilla guardada", plantilla })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Ya existe una plantilla con ese nombre" })
    }
    res.status(500).json({ success: false, message: "Error al guardar la plantilla" })
  }
}

export const actualizarPlantilla = async (req, res) => {
  const { nombre, asunto, cuerpo } = req.body

  try {
    const plantilla = await PlantillaCorreo.findByIdAndUpdate(
      req.params.id,
      {
        ...(nombre && { nombre: nombre.trim() }),
        ...(asunto && { asunto: asunto.trim() }),
        ...(cuerpo && { cuerpo }),
      },
      { new: true, runValidators: true }
    )
    if (!plantilla) {
      return res.status(404).json({ success: false, message: "Plantilla no encontrada" })
    }
    res.json({ success: true, message: "Plantilla actualizada", plantilla })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Ya existe una plantilla con ese nombre" })
    }
    res.status(500).json({ success: false, message: "Error al actualizar la plantilla" })
  }
}

export const eliminarPlantilla = async (req, res) => {
  try {
    const plantilla = await PlantillaCorreo.findByIdAndDelete(req.params.id)
    if (!plantilla) {
      return res.status(404).json({ success: false, message: "Plantilla no encontrada" })
    }
    res.json({ success: true, message: "Plantilla eliminada" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar la plantilla" })
  }
}

// ── Historial ────────────────────────────────────────────────────────────────
export const listarHistorial = async (_req, res) => {
  try {
    const historial = await EnvioCorreo.find().sort({ createdAt: -1 }).limit(100)
    res.json(historial)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el historial" })
  }
}
