import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { servicios } from "../data/servicios"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false))
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return isMobile
}

function Servicios() {
  const isMobile = useIsMobile()
  const VISIBLE = isMobile ? 1 : 3

  const [startIndex, setStartIndex] = useState(0)
  
  // Guard against empty or missing data
  if (!servicios || servicios.length === 0) {
    return null
  }

  const maxStart = Math.max(0, servicios.length - VISIBLE)
  const visibleServicios = servicios.slice(startIndex, startIndex + VISIBLE)

  useEffect(() => {
    if (startIndex > maxStart) {
      setStartIndex(0)
    }
  }, [maxStart, startIndex])

  const goPrev = () => setStartIndex((i) => Math.max(0, i - 1))
  const goNext = () => setStartIndex((i) => Math.min(maxStart, i + 1))

  return (
    <section id="servicios" className="relative py-20 sm:py-28 bg-[var(--color-bg-soft)]/5 border-y border-gray-100/50 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)] opacity-[0.02] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-primary)] opacity-[0.03] rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Gradient */}
        <div className="text-center mb-16 underline-offset-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] uppercase text-[10px] sm:text-xs mb-4 py-1.5 px-4 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10"
          >
            Nuestra Especialidad
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-primary-dark)] mb-5 tracking-tight"
          >
            Soluciones <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">de energía solar</span>
          </motion.h2>
          <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Impulsamos el futuro con tecnología solar eficiente para transformar su hogar, empresa o campo.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative group/nav">
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-8 z-20">
            <button
              onClick={goPrev}
              disabled={startIndex === 0}
              className="w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-md border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] hover:text-white transition-all disabled:opacity-0"
              aria-label="Anterior"
            >
              <ChevronLeft size={22} />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-8 z-20">
            <button
              onClick={goNext}
              disabled={startIndex >= maxStart}
              className="w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-md border border-gray-100 flex items-center justify-center text-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] hover:text-white transition-all disabled:opacity-0"
              aria-label="Siguiente"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${startIndex}-${VISIBLE}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className={`grid gap-8 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}
              >
                {visibleServicios.map((servicio) => {
                  const IconComponent = servicio.icon;
                  return (
                    <div
                      key={servicio.nombre}
                      className="group relative h-[420px] rounded-[2.5rem] overflow-hidden shadow-lg bg-white border border-gray-100 transition-all duration-500 hover:shadow-2xl"
                    >
                      <img
                        loading="lazy"
                        src={servicio.imagen}
                        alt={servicio.nombre}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity" />

                      {/* Title Bar (Standard State) */}
                      <div className="absolute bottom-6 left-6 right-6 z-10 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-[1.5rem] border border-white/10 shadow-sm">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2"
                            style={{ borderColor: servicio.iconBg, backgroundColor: "transparent" }}
                          >
                            {IconComponent && <IconComponent size={20} style={{ color: servicio.iconBg }} />}
                          </div>
                          <h3 className="text-white font-bold text-base leading-tight tracking-tight shadow-black drop-shadow-lg">
                            {servicio.nombre}
                          </h3>
                        </div>
                      </div>

                      {/* Description Reveal (Hover State) */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                         <div className="bg-slate-900/80 backdrop-blur-md p-7 rounded-[2rem] border border-white/10 shadow-2xl">
                            <div className="flex items-center gap-3 mb-3">
                               <div 
                                 className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                                 style={{ borderColor: servicio.iconBg }}
                               >
                                  {IconComponent && <IconComponent size={16} style={{ color: servicio.iconBg }} />}
                               </div>
                               <h3 className="text-white font-bold text-base">
                                 {servicio.nombre}
                               </h3>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed">
                              {servicio.descripcion}
                            </p>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2.5 mt-14">
          {Array.from({ length: maxStart + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStartIndex(i)}
              className={`h-2.5 transition-all duration-500 rounded-full ${i === startIndex
                  ? "bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] w-12 shadow-sm shadow-green-400/20"
                  : "bg-gray-200 w-2.5 hover:bg-gray-300"
                }`}
              aria-label={`Ir al servicio ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Servicios
