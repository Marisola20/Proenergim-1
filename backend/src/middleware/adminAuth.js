import crypto from "node:crypto"

const LEGACY_ADMIN_PASSWORD = "pro2026-energim"
const TOKEN_DURATION_MS = 8 * 60 * 60 * 1000

const getAdminPassword = () => process.env.ADMIN_PASSWORD || LEGACY_ADMIN_PASSWORD
const getTokenSecret = () => process.env.ADMIN_TOKEN_SECRET || getAdminPassword()

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left))
  const rightBuffer = Buffer.from(String(right))
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

const signPayload = (payload) => crypto
  .createHmac("sha256", getTokenSecret())
  .update(payload)
  .digest("base64url")

export const isValidAdminPassword = (password) => safeEqual(password, getAdminPassword())

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

  if (tokenParts.length !== 2 || !payload || !signature || !safeEqual(signature, signPayload(payload))) {
    return res.status(401).json({ message: "Sesión administrativa inválida" })
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    if (data.role !== "admin" || !data.expiresAt || data.expiresAt < Date.now()) {
      return res.status(401).json({ message: "La sesión administrativa expiró" })
    }
    next()
  } catch {
    return res.status(401).json({ message: "Sesión administrativa inválida" })
  }
}
