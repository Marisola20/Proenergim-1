import crypto from "node:crypto"

const TOKEN_DURATION_MS = 8 * 60 * 60 * 1000

// Sin valores de respaldo a propósito: antes había una contraseña escrita en
// este archivo, y como el repositorio es público equivalía a publicar la llave
// del panel. Si falta configuración se deniega el acceso; el arranque del
// servidor ya exige ambas variables (ver REQUIRED_ENV en server.js).
const getAdminPassword = () => process.env.ADMIN_PASSWORD || ""
const getTokenSecret = () => process.env.ADMIN_TOKEN_SECRET || ""

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left))
  const rightBuffer = Buffer.from(String(right))
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

const signPayload = (payload) => {
  const secreto = getTokenSecret()
  if (!secreto) throw new Error("ADMIN_TOKEN_SECRET no está configurado")

  return crypto
    .createHmac("sha256", secreto)
    .update(payload)
    .digest("base64url")
}

export const isValidAdminPassword = (password) => {
  const esperada = getAdminPassword()
  if (!esperada) return false // sin contraseña configurada no entra nadie

  return safeEqual(password, esperada)
}

export const createAdminToken = () => {
  const payload = Buffer.from(JSON.stringify({
    role: "admin",
    expiresAt: Date.now() + TOKEN_DURATION_MS,
  })).toString("base64url")

  return `${payload}.${signPayload(payload)}`
}

export const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "")
  const tokenParts = token?.split(".") || []
  const [payload, signature] = tokenParts

  try {
    if (tokenParts.length !== 2 || !payload || !signature || !safeEqual(signature, signPayload(payload))) {
      return res.status(401).json({ message: "Sesión administrativa inválida" })
    }

    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    if (data.role !== "admin" || !data.expiresAt || data.expiresAt < Date.now()) {
      return res.status(401).json({ message: "La sesión administrativa expiró" })
    }
    next()
  } catch {
    return res.status(401).json({ message: "Sesión administrativa inválida" })
  }
}
