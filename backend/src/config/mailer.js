import nodemailer from "nodemailer"

// ── Transporter compartido (lazy init — dotenv ya cargó al primer uso) ────────
let transporter = null

export function getTransporter() {
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

// ── Escapa texto que entra a una plantilla HTML ──────────────────────────────
export const escaparHtml = (valor) => String(valor ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;")

// El logo vive en frontend/public/, así que se sirve desde la raíz del dominio.
// Un correo necesita una URL pública y fija: no sirve el import de Vite, que
// genera nombres con hash en cada build.
const LOGO_URL = process.env.EMAIL_LOGO_URL || "https://proenergim.com/logo-proenergim.png"

// ── Envoltura de marca para los correos del panel ────────────────────────────
// Sigue el mismo estilo que el correo de solicitud de compra: cabecera blanca
// con título azul oscuro, cuerpo sobre fondo claro y pie gris.
export function maquetarCorreo({ asunto, titulo, subtitulo, cuerpoHtml, pie }) {
  const pieFinal = pie
    || `© ${new Date().getFullYear()} Proenergim &nbsp;·&nbsp; proenergim.com &nbsp;·&nbsp; Sistema automático`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${escaparHtml(asunto)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td align="center" style="background:#ffffff;border-bottom:1px solid #e2e8f0;padding:26px 30px 20px;">
              <img src="${LOGO_URL}" width="210" alt="Proenergim E.I.R.L."
                   style="display:block;margin:0 auto 16px;border:0;outline:none;text-decoration:none;width:210px;max-width:100%;height:auto;">
              <h2 style="margin:0;color:#0f4c81;font-size:22px;font-weight:700;">${escaparHtml(titulo || "Proenergim E.I.R.L.")}</h2>
              <p style="margin:8px 0 0;color:#0f4c81;font-size:13px;">${escaparHtml(subtitulo || "Notificación automática")}</p>
            </td>
          </tr>

          <!-- CUERPO -->
          <tr>
            <td style="padding:24px 35px;color:#475569;font-size:14px;line-height:1.7;">
              ${cuerpoHtml}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="background:#f8fafc;padding:18px 35px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">${pieFinal}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
