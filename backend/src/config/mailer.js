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

// ── Envoltura de marca para los correos del panel ────────────────────────────
export function maquetarCorreo({ asunto, cuerpoHtml }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${escaparHtml(asunto)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(15,23,42,.08);">
          <tr>
            <td style="background:#0369a1;padding:20px 28px;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">Proenergim E.I.R.L.</h1>
              <p style="margin:4px 0 0;color:#bae6fd;font-size:13px;">Energía solar que transforma tu mundo</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;color:#1e293b;font-size:15px;line-height:1.65;">
              ${cuerpoHtml}
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:18px 28px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.5;">
              Recibes este correo porque te suscribiste en
              <a href="https://proenergim.com" style="color:#0369a1;text-decoration:none;">proenergim.com</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
