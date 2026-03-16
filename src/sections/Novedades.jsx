import { useState } from "react"
import { motion } from "framer-motion"
import logoMobile from "../assets/logo-movile.webp"

function Novedades() {
  const [emailNovedades, setEmailNovedades] = useState("")
  const [novedadEnviada, setNovedadEnviada] = useState(false)

  return (
    <div className="bg-white border-y border-[var(--color-primary)] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-[var(--color-primary-dark)]">
            <div>
              <h3 className="font-bold text-lg md:text-xl mb-0.5">Sé el primero en conocer nuestros proyectos</h3>
            </div>
          </div>

          {!novedadEnviada ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (emailNovedades.trim()) setNovedadEnviada(true)
              }}
              className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl w-full md:ml-auto"
            >
              <input
                type="email"
                value={emailNovedades}
                onChange={(e) => setEmailNovedades(e.target.value)}
                placeholder="Ingresa tu correo para obtener las últimas novedades"
                className="flex-1 min-w-[280px] rounded-full px-5 py-3.5 bg-gray-50 text-[var(--color-text)] placeholder:text-gray-400 placeholder:text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] hover:bg-none hover:bg-white border-2 border-transparent hover:border-[#1ed760] hover:border-dashed text-white hover:text-[#1ed760] font-bold px-8 py-[12px] rounded-full transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Unirme
              </button>
            </form>
          ) : (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[var(--color-primary)] font-bold text-lg md:ml-auto w-full max-w-2xl text-center md:text-right"
            >
              ¡Gracias, hemos recibido tu solicitud!
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Novedades
