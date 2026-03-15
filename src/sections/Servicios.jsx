import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { servicios } from "../data/servicios"

const VISIBLE = 3

function Servicios() {
  const [startIndex, setStartIndex] = useState(0)
  const maxStart = Math.max(0, servicios.length - VISIBLE)
  const visibleServicios = servicios.slice(startIndex, startIndex + VISIBLE)

  const goPrev = () => setStartIndex((i) => Math.max(0, i - 1))
  const goNext = () => setStartIndex((i) => Math.min(maxStart, i + 1))

  return (
    <section id="servicios" className="py-20 bg-[var(--color-bg-soft)]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-dark)] mb-3">
            ¿Qué ofrecemos?
          </h2>
          <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl mx-auto">
            Soluciones integrales de energía solar y eficiencia energética para el hogar, la industria y el agro.
          </p>
        </motion.div>

        {/* Carrusel */}
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={startIndex === 0}
            aria-label="Anterior"
            className="shrink-0 z-10 w-10 h-10 rounded-full bg-white border border-[var(--color-primary)]/20 shadow-md flex items-center justify-center text-[var(--color-primary-dark)] hover:bg-[var(--color-green)] hover:text-white hover:border-transparent disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="flex-1 overflow-hidden min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={startIndex}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {visibleServicios.map((servicio, i) => (
                  <motion.div
                    key={servicio.nombre}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-white/60 transition-all duration-300 cursor-pointer h-64"
                  >
                    {/* Imagen de fondo — siempre visible completa */}
                    <img
                      src={servicio.imagen}
                      alt={servicio.nombre}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay oscuro base para legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

                    {/* Icono + título — estado normal (abajo de la tarjeta) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 bg-transparent"
                        style={{ borderColor: servicio.iconBg }}
                      >
                        <servicio.icon size={20} style={{ color: servicio.iconBg }} />
                      </div>
                      <h3 className="text-white font-bold text-base leading-snug drop-shadow">
                        {servicio.nombre}
                      </h3>
                    </div>

                    {/* Overlay hover — sube desde abajo con descripción */}
                    <div className="absolute inset-0 flex flex-col justify-end translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-in-out">
                      <div className="bg-[var(--color-primary-dark)]/75 backdrop-blur-sm p-5 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 bg-transparent"
                            style={{ borderColor: servicio.iconBg }}
                          >
                            <servicio.icon size={20} style={{ color: servicio.iconBg }} />
                          </div>
                          <h3 className="text-white font-bold text-base leading-snug">
                            {servicio.nombre}
                          </h3>
                        </div>
                        <p className="text-white/85 text-sm leading-relaxed">
                          {servicio.descripcion}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={startIndex >= maxStart}
            aria-label="Siguiente"
            className="shrink-0 z-10 w-10 h-10 rounded-full bg-white border border-[var(--color-primary)]/20 shadow-md flex items-center justify-center text-[var(--color-primary-dark)] hover:bg-[var(--color-green)] hover:text-white hover:border-transparent disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxStart + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStartIndex(i)}
              aria-label={`Ir a slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === startIndex
                  ? "bg-[var(--color-green)] w-6 h-2.5"
                  : "bg-[var(--color-primary)]/30 hover:bg-[var(--color-green)]/50 w-2.5 h-2.5"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Servicios
