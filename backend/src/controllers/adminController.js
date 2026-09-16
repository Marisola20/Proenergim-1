import crypto from "node:crypto"
import { createAdminToken, isValidAdminPassword } from "../middleware/adminAuth.js"
import CodigoAdmin from "../models/CodigoAdmin.js"
import { getTransporter, maquetarCorreo, escaparHtml } from "../config/mailer.js"

const VIGENCIA_MS = 10 * 60 * 1000 // el código caduca a los 10 minutos
const MAX_INTENTOS = 5             // 6 dígitos son un millón de combinaciones:
                                   // sin este tope se podrían probar a fuerza bruta

// Quién recibe el código. Configurable por entorno para cambiar de destinatarios
// (pruebas vs. producción) sin tocar el código.
const destinatarios2FA = () => String(process.env.ADMIN_2FA_EMAILS || "")
  .split(",")
  .map(correo => correo.trim().toLowerCase())
  .filter(Boolean)

const hashCodigo = (codigo) => crypto
  .createHmac("sha256", process.env.ADMIN_TOKEN_SECRET || "")
  .update(String(codigo))
  .digest("hex")

const comparacionSegura = (izquierda, derecha) => {
  const a = Buffer.from(String(izquierda))
  const b = Buffer.from(String(derecha))
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

// j***y@gmail.com — confirma a dónde fue el código sin exponer la dirección
const enmascarar = (correo) => {
  const [usuario, dominio] = correo.split("@")
  if (!dominio) return "***"
  const visible = usuario.length <= 2
    ? usuario[0] + "*"
    : usuario[0] + "*".repeat(Math.min(usuario.length - 2, 4)) + usuario.at(-1)
  return `${visible}@${dominio}`
}

// ── Paso 1: contraseña → se envía el código ──────────────────────────────────
export const iniciarSesionAdmin = async (req, res) => {
  if (!isValidAdminPassword(req.body?.password)) {
    return res.status(401).json({ message: "Contraseña incorrecta" })
  }

  const destinatarios = destinatarios2FA()
  if (destinatarios.length === 0) {
    return res.status(503).json({
      message: "La verificación en dos pasos no está configurada (falta ADMIN_2FA_EMAILS)",
    })
  }

  const mail = getTransporter()
  if (!mail) {
    return res.status(503).json({ message: "El servidor de correo no está configurado" })
  }

  // randomInt usa el generador criptográfico del sistema, no Math.random
  const codigo = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0")

  try {
    // Un solo código vivo a la vez: pedir uno nuevo anula el anterior.
    await CodigoAdmin.deleteMany({})
    await CodigoAdmin.create({
      codigoHash: hashCodigo(codigo),
      expiraEn: new Date(Date.now() + VIGENCIA_MS),
    })

    await mail.sendMail({
      from: `"Proenergim E.I.R.L." <${process.env.EMAIL_USER}>`,
      to: destinatarios,
      subject: `Código de acceso al panel: ${codigo}`,
      html: maquetarCorreo({
        asunto: "Código de acceso al panel administrativo",
        cuerpoHtml: `
          <p style="margin:0 0 14px;">Alguien acaba de introducir la contraseña del panel administrativo de Proenergim.</p>
          <p style="margin:0 0 8px;">Tu código de acceso es:</p>
          <p style="margin:0 0 18px;font-size:34px;font-weight:bold;letter-spacing:8px;color:#0369a1;">${escaparHtml(codigo)}</p>
          <p style="margin:0 0 14px;color:#64748b;font-size:13px;">Caduca en 10 minutos y solo sirve una vez.</p>
          <p style="margin:0;color:#b91c1c;font-size:13px;"><strong>Si no fuiste tú, alguien conoce la contraseña: cámbiala cuanto antes.</strong></p>
        `,
      }),
    })

    res.json({
      requiere2FA: true,
      enviadoA: destinatarios.map(enmascarar),
      message: "Te enviamos un código de 6 dígitos al correo",
    })
  } catch (error) {
    console.error("Error al enviar el código de acceso:", error)
    res.status(500).json({ message: "No se pudo enviar el código de acceso" })
  }
}

// ── Paso 2: código → se entrega el token ─────────────────────────────────────
export const verificarCodigoAdmin = async (req, res) => {
  const codigo = String(req.body?.codigo ?? "").trim()

  if (!/^\d{6}$/.test(codigo)) {
    return res.status(400).json({ message: "El código son 6 dígitos" })
  }

  try {
    const registro = await CodigoAdmin.findOne().sort({ createdAt: -1 })

    if (!registro || registro.expiraEn < new Date()) {
      await CodigoAdmin.deleteMany({})
      return res.status(401).json({ message: "El código caducó. Vuelve a iniciar sesión." })
    }

    if (registro.intentos >= MAX_INTENTOS) {
      await CodigoAdmin.deleteMany({})
      return res.status(429).json({ message: "Demasiados intentos. Vuelve a iniciar sesión." })
    }

    if (!comparacionSegura(registro.codigoHash, hashCodigo(codigo))) {
      registro.intentos += 1
      await registro.save()
      const restantes = MAX_INTENTOS - registro.intentos
      return res.status(401).json({
        message: restantes > 0
          ? `Código incorrecto. Te quedan ${restantes} intento(s).`
          : "Código incorrecto. Vuelve a iniciar sesión.",
      })
    }

    // Correcto: el código se quema inmediatamente.
    await CodigoAdmin.deleteMany({})
    res.json({ token: createAdminToken() })
  } catch (error) {
    console.error("Error al verificar el código:", error)
    res.status(500).json({ message: "Error al verificar el código" })
  }
}
