import { createAdminToken, isValidAdminPassword } from "../middleware/adminAuth.js"

export const iniciarSesionAdmin = (req, res) => {
  if (!isValidAdminPassword(req.body?.password)) {
    return res.status(401).json({ message: "Contraseña incorrecta" })
  }

  res.json({ token: createAdminToken() })
}
