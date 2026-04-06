import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Bell, PartyPopper, MailCheck, AlertCircle } from "lucide-react"

function Novedades() {
  const [email, setEmail] = useState("")
  const [estado, setEstado] = useState("idle") // idle, loading, success, error, exists

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setEstado("loading")

    try {
      const res = await fetch("http://localhost:5000/api/suscriptors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.success) {
        setEstado("success")
      } else if (data.message === "Este correo ya está suscrito") {
        setEstado("exists")
      } else {
        setEstado("error")
      }
    } catch {
      setEstado("error")
    }
  }

  return (
    <div className="bg-white border-y border-[var(--color-primary-light)] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10"
        >
          {/* Texto */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--color-primary-light)" }}>
              <Bell size={22} style={{ color: "white" }} />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-[var(--color-primary-dark)] leading-tight">
                Últimas novedades
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Sé el primero en conocer nuestros proyectos...
              </p>
            </div>
          </div>

          {/* Formulario o mensaje */}
          <AnimatePresence mode="wait">
            {estado === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-3 w-full max-w-2xl lg:ml-auto"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <PartyPopper size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-green-700 text-sm">¡Suscripción exitosa!</p>
                  <p className="text-xs text-green-600">Te avisaremos de las últimas novedades.</p>
                </div>
                <button
                  onClick={() => { setEstado("idle"); setEmail("") }}
                  className="ml-auto text-xs text-green-600 hover:text-green-700 font-bold underline underline-offset-2 whitespace-nowrap"
                >
                  Enviar otro correo
                </button>
              </motion.div>
            ) : estado === "exists" ? (
              <motion.div
                key="exists"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3 w-full max-w-2xl lg:ml-auto"
              >
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                  <MailCheck size={20} className="text-yellow-600" />
                </div>
                <p className="font-bold text-yellow-700 text-sm">¡Este correo ya está suscrito!</p>
                <button
                  onClick={() => { setEstado("idle"); setEmail("") }}
                  className="ml-auto text-xs text-yellow-600 hover:text-yellow-700 font-bold underline underline-offset-2 whitespace-nowrap"
                >
                  Usar otro correo
                </button>
              </motion.div>
            ) : estado === "error" ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3 w-full max-w-2xl lg:ml-auto"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-red-700 text-sm">Ocurrió un error</p>
                  <p className="text-xs text-red-600">Intenta de nuevo más tarde.</p>
                </div>
                <button
                  onClick={() => { setEstado("idle"); setEmail("") }}
                  className="ml-auto text-xs text-red-600 hover:text-red-700 font-bold underline underline-offset-2 whitespace-nowrap"
                >
                  Intentar de nuevo
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl w-full lg:ml-auto"
              >
                <div className="flex-1 relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo electrónico"
                    className="w-full pl-10 pr-5 py-3.5 rounded-full bg-gray-50 text-sm border-0 ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                    required
                  />
                </div>
                <div className="group relative inline-flex items-center justify-center bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] p-[1.75px] rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]">
                  <button
                    type="submit"
                    disabled={estado === "loading"}
                    className="flex items-center justify-center w-full h-full bg-transparent group-hover:bg-white rounded-full px-8 py-3 transition-all duration-300 disabled:opacity-60 whitespace-nowrap"
                  >
                    <span className="text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#0ea5e1] group-hover:to-[#1ed760] font-extrabold text-sm">
                      {estado === "loading" ? "Enviando..." : "Suscribirme"}
                    </span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default Novedades