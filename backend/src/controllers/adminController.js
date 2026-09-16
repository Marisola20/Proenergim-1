import crypto from "node:crypto"
import { createAdminToken, isValidAdminPassword } from "../middleware/adminAuth.js"
import CodigoAdmin from "../models/CodigoAdmin.js"
import { getTransporter, maquetarCorreo, escaparHtml } from "../config/mailer.js"

const VIGENCIA_MS = 10 * 60 * 1000 // el código caduca a los 10 minutos
// El correo lo deriva de la constante: si cambias VIGENCIA_MS, el texto se ajusta solo
const MINUTOS_VIGENCIA = Math.round(VIGENCIA_MS / 60_000)
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

// Exportado aparte para poder previsualizar el correo sin enviarlo.
export const construirCorreoCodigo = (codigo) => maquetarCorreo({
  asunto: "Código de acceso al admin",
  titulo: "Código de acceso al admin",
  subtitulo: "Verificación en dos pasos",
  cuerpoHtml: `
          <!-- INTRO -->
          <p style="margin:0 0 18px;font-size:14px;color:#475569;line-height:1.65;">
            Se registró un intento de ingreso al panel administrativo de Proenergim. Usa el siguiente código para completar el acceso:
          </p>

          <!-- CÓDIGO DESTACADO: misma jerarquía visual que el producto solicitado -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;">
            <tr>
              <td align="center" style="padding:22px 18px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:7px;vertical-align:middle;">
                      <img src="https://img.icons8.com/ios/48/0284c7/lock-2.png" width="18" height="18" alt="" style="display:block;border:0;">
                    </td>
                    <td style="font-size:11px;font-weight:bold;color:#0284c7;letter-spacing:1.7px;vertical-align:middle;">
                      CÓDIGO DE VERIFICACIÓN
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:5px 16px 8px;">
                <p style="margin:0;font-size:40px;line-height:1.2;font-weight:bold;color:#0f172a;letter-spacing:12px;text-indent:12px;">${escaparHtml(codigo)}</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:4px 16px 22px;">
                <span style="display:inline-block;background:#ffffff;border:1px solid #bfdbfe;color:#0f4c81;font-size:12px;font-weight:bold;padding:7px 14px;border-radius:20px;">
                  Válido ${MINUTOS_VIGENCIA} minutos &nbsp;·&nbsp; un solo uso
                </span>
              </td>
            </tr>
          </table>

          <!-- AVISO DE SEGURIDAD -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;margin-top:20px;">
            <tr>
              <td width="42" valign="top" style="padding:15px 0 15px 15px;">
                <img src="https://img.icons8.com/ios/48/c2410c/error--v1.png" width="20" height="20" alt="" style="display:block;border:0;">
              </td>
              <td style="padding:14px 15px 14px 10px;">
                <p style="margin:0 0 3px;color:#9a3412;font-size:13px;font-weight:bold;">¿No intentaste ingresar?</p>
                <p style="margin:0;color:#9a3412;font-size:12px;line-height:1.55;">No compartas este código. Alguien podría conocer la contraseña del panel; cámbiala cuanto antes.</p>
              </td>
            </tr>
          </table>
        `,
})

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
      subject: `Código de acceso al admin: ${codigo}`,
      html: construirCorreoCodigo(codigo),
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
