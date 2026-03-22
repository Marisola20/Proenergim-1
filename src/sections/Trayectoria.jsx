import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ChevronDown } from "lucide-react"

const hitos = [
  {
    año: "2008",
    titulo: "Fundación de PROENERGIM",
    descripcion: "Inicio de operaciones en Lima como empresa de ingeniería eléctrica y energías renovables.",
    imagen: "/images/Trayectoria/prueba1.webp",
    color: "#0ea5e9",
  },
  {
    año: "2010",
    titulo: "Primeros proyectos solares",
    descripcion: "Instalación de los primeros sistemas de bombeo solar para agricultura en La Libertad.",
    imagen: "/images/Trayectoria/prueba2.webp",
    color: "#f59e0b",
  },
  {
    año: "2014",
    titulo: "Expansión nacional",
    descripcion: "Apertura de unidades operativas en Trujillo y Piura para atender el norte del Perú.",
    imagen: "/images/Trayectoria/prueba3.webp",
    color: "#10b981",
  },
  {
    año: "2018",
    titulo: "+100 proyectos",
    descripcion: "Superamos los 100 proyectos instalados en todo el Perú, desde Tumbes hasta Madre de Dios.",
    imagen: "/images/Trayectoria/prueba4.webp",
    color: "#8b5cf6",
  },
  {
    año: "2022",
    titulo: "Sistema solar más grande del Perú",
    descripcion: "Instalación del sistema de riego tecnificado más grande del país con bomba de 150 HP.",
    imagen: "/images/Trayectoria/prueba5.webp",
    color: "#f97316",
  },
  {
    año: "2025",
    titulo: "+200 proyectos y 4 sedes",
    descripcion: "Consolidados como referentes nacionales con sedes en Lima, Trujillo, Piura y Selva Sur.",
    imagen: "/images/Trayectoria/prueba6.webp",
    color: "#22c55e",
  },
]

function HitoItem({ hito, index }) {
  const [abierto, setAbierto] = useState(false)
  const esIzquierda = index % 2 === 0

  return (
    <>
      {/* ── DESKTOP: alternado izquierda/derecha ── */}
      <div className={`relative hidden md:flex items-start gap-0 ${esIzquierda ? "flex-row" : "flex-row-reverse"}`}>
        {/* Dot central */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 z-10">
          <div
            className="w-5 h-5 rounded-full border-4 border-white shadow-md"
            style={{ backgroundColor: hito.color }}
          />
        </div>

        {/* Tarjeta */}
        <motion.div
          initial={{ opacity: 0, x: esIzquierda ? -32 : 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.07 }}
          className={`w-[calc(50%-28px)] ${esIzquierda ? "mr-auto pr-4" : "ml-auto pl-4"}`}
        >
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="w-full text-left group"
            aria-expanded={abierto}
          >
            <div className="flex items-center justify-between gap-3 rounded-2xl px-5 py-4 shadow-sm border-2 border-[var(--color-primary)]/15 hover:border-[var(--color-primary)]/35 hover:shadow-md transition-all duration-200 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${hito.color}20` }}
                >
                  <Calendar size={18} style={{ color: hito.color }} />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wider" style={{ color: hito.color }}>
                    {hito.año}
                  </span>
                  <span className="block text-[var(--color-primary-dark)] font-semibold text-sm leading-snug truncate">
                    {hito.titulo}
                  </span>
                </div>
              </div>
              <ChevronDown
                size={18}
                className="shrink-0 text-gray-400 transition-transform duration-300"
                style={{ transform: abierto ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </div>
          </button>

          <AnimatePresence initial={false}>
            {abierto && (
              <motion.div
                key="panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-2xl border-2 border-[var(--color-primary)]/20 bg-white shadow-sm overflow-hidden">
                  <div
                    className="w-full h-36 flex items-center justify-center text-white/70 text-sm font-medium select-none"
                    style={{
                      background: hito.imagen
                        ? undefined
                        : `linear-gradient(135deg, ${hito.color}cc, ${hito.color}66)`,
                    }}
                  >
                    {hito.imagen ? (
                      <img src={hito.imagen} alt={hito.titulo} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <span className="opacity-80">Aquí se agregarán las imágenes</span>
                    )}
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[var(--color-text)] text-sm leading-relaxed">{hito.descripcion}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── MÓVIL: layout lineal con línea a la izquierda ── */}
      <div className="flex md:hidden items-start gap-4 relative pl-8">
        {/* Línea + dot a la izquierda */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
          <div
            className="w-5 h-5 rounded-full border-4 border-white shadow-md shrink-0 mt-3.5"
            style={{ backgroundColor: hito.color }}
          />
        </div>

        {/* Tarjeta full-width */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.06 }}
          className="flex-1 min-w-0 pb-2"
        >
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="w-full text-left group"
            aria-expanded={abierto}
          >
            <div className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 shadow-sm border-2 border-[var(--color-primary)]/15 hover:border-[var(--color-primary)]/35 hover:shadow-md transition-all duration-200 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${hito.color}20` }}
                >
                  <Calendar size={16} style={{ color: hito.color }} />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wider" style={{ color: hito.color }}>
                    {hito.año}
                  </span>
                  <span className="block text-[var(--color-primary-dark)] font-semibold text-base leading-snug">
                    {hito.titulo}
                  </span>
                </div>
              </div>
              <ChevronDown
                size={18}
                className="shrink-0 text-gray-400 transition-transform duration-300"
                style={{ transform: abierto ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </div>
          </button>

          <AnimatePresence initial={false}>
            {abierto && (
              <motion.div
                key="panel-mobile"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-2xl border-2 border-[var(--color-primary)]/20 bg-white shadow-sm overflow-hidden">
                  <div
                    className="w-full h-32 flex items-center justify-center text-white/70 text-sm font-medium select-none"
                    style={{
                      background: hito.imagen
                        ? undefined
                        : `linear-gradient(135deg, ${hito.color}cc, ${hito.color}66)`,
                    }}
                  >
                    {hito.imagen ? (
                      <img src={hito.imagen} alt={hito.titulo} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <span className="opacity-80">Aquí se agregarán las imágenes</span>
                    )}
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[var(--color-text)] text-base leading-relaxed">{hito.descripcion}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}

function Trayectoria() {
  return (
    <section id="trayectoria" className="py-16 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Encabezado */}
        <div className="text-center mb-12 sm:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] uppercase text-[10px] sm:text-xs mb-4 py-1.5 px-4 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10"
          >
            Nuestra Historia
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-primary-dark)] mb-5 tracking-tight"
          >
            Más de 15 años{" "}<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">creciendo juntos</span>
          </motion.h2>
          <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Hitos que marcan nuestro camino desde Lima hasta convertirse en referentes nacionales de energía solar.
          </p>
        </div>

        {/* Línea de tiempo */}
        <div className="relative">
          {/* Línea vertical central — solo desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-primary)]/20 via-[var(--color-primary)]/40 to-[var(--color-primary)]/20" />

          {/* Línea vertical izquierda — solo móvil */}
          <div className="block md:hidden absolute left-[10px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-primary)]/20 via-[var(--color-primary)]/40 to-[var(--color-primary)]/20" />

          <div className="flex flex-col gap-6">
            {hitos.map((hito, i) => (
              <HitoItem key={hito.año} hito={hito} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Trayectoria
