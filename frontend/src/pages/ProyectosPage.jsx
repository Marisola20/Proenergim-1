import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView, animate } from "framer-motion"
import { MapPin, ArrowRight, User, FolderOpen, Award, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { proyectos } from "../data/proyectos"
import HeroBanner from "../components/HeroBanner"
import ActionSection from "../components/ActionSection"

const WHATSAPP = "51936954890"

/* Color por categoría */
const colorCat = {
  "Bombeo Solar":       { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  "Electrificación Solar": { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" },
  "Riego Tecnificado":  { bg: "#cffafe", text: "#0e7490", dot: "#06b6d4" },
  "Industrial":         { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" },
}

const estadisticas = [
  { valor: "200+", label: "Proyectos instalados", Icon: FolderOpen },
  { valor: "4",    label: "Sedes en el Perú",    Icon: MapPin },
  { valor: "15+",  label: "Años de experiencia",  Icon: Award },
]

function StatCard({ s, i }) {
  const ref = useRef(null)
  const [displayValue, setDisplayValue] = useState(0)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(s.valor.replace("+", ""))
      const controls = animate(0, numericValue, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (val) => setDisplayValue(Math.round(val)),
      })
      return () => controls.stop()
    }
  }, [isInView, s.valor])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } } : {}}
      className="bg-white rounded-3xl p-10 flex items-center gap-7 border border-[var(--color-primary-light)] hover:border-[var(--color-primary)] hover:translate-y-2 transition-all duration-400 relative overflow-hidden flex-1 min-w-[280px]"
    >
      {/* Fondo sutil acentuado */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#0ea5e1]/5 to-[#1ed760]/5 rounded-full -translate-y-2/2 translate-x-1/2 pointer-events-none" />

      <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0 border border-white">
        <s.Icon size={32} className="text-[var(--color-primary)]" />
      </div>

      <div className="flex flex-col text-left">
        <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] tracking-tighter leading-none mb-1 font-sans">
          {displayValue}{s.valor.includes("+") ? "+" : ""}
        </span>
        <span className="pt-[10px] text-slate-500 text-[11px] sm:text-[13px] font-semibold tracking-[0.2em] leading-tight">
          {s.label}
        </span>
      </div>
    </motion.div>
  )
}

function ProyectoCard({ proyecto }) {
  const cat = colorCat[proyecto.categoria] || { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] border border-slate-200 hover:border-slate-300 hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all duration-400 flex flex-col"
    >
      {/* Video miniatura */}
      <div className="h-52 w-full relative bg-slate-100 overflow-hidden">
        <img
          src={proyecto.images[0]}
          alt={proyecto.nombre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ loading: "lazy" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badge categoría */}
        <div className="absolute top-4 left-4">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm"
            style={{ backgroundColor: cat.bg + "ee", color: cat.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.dot }} />
            {proyecto.categoria}
          </span>
        </div>


      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-black text-[var(--color-primary-dark)] mb-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors tracking-tight">
          {proyecto.nombre}
        </h3>

        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-5 line-clamp-3">
          {proyecto.descripcion}
        </p>

        <div className="mt-auto space-y-2 mb-5">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-xs font-medium">
            <MapPin size={13} className="text-[var(--color-primary)] shrink-0" />
            <span className="truncate">{proyecto.ubicacion}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-xs font-medium">
            <User size={13} className="text-[var(--color-primary)] opacity-70 shrink-0" />
            <span className="truncate">{proyecto.cliente}</span>
          </div>
        </div>

        <Link
          to={`/proyecto/${proyecto.id}`}
          className="w-full flex items-center justify-center gap-2 border-2 border-[var(--color-primary-dark)]/20 text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-white hover:border-[var(--color-primary-dark)] text-sm font-bold px-4 py-3 rounded-full transition-all duration-300"
        >
          Ver proyecto completo <ArrowRight size={15} />
        </Link>
      </div>
    </motion.article>
  )
}

function ProyectosPage() {
  const [filtro, setFiltro] = useState("Todos")
  const categorias = ["Todos", ...new Set(proyectos.map((p) => p.categoria))]
  const proyectosFiltrados = filtro === "Todos" ? proyectos : proyectos.filter((p) => p.categoria === filtro)

  return (
    <div className="bg-slate-50/40 min-h-screen pb-24">
      <HeroBanner
        subtitle="Experiencia y ejecución"
        title="Proyectos"
        highlight="desarrollados"
        description="Resultados que reflejan experiencia en cada instalación."
        patternId="proyectos"
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* ── IMPACT DASHBOARD (STATS ANIMADOS) ── */}
        <div className="relative z-30 -mt-20 sm:-mt-24 mb-10 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {estadisticas.map((s, i) => (
            <StatCard key={i} s={s} i={i} />
          ))}
        </div>

        {/* Texto de separación sutil */}
        <div className="text-center mb-20 opacity-60">
           <p className="text-slate-400 text-[13px] font-medium tracking-widest uppercase">
             Impulsando la soberanía energética en cada rincón del Perú
           </p>
        </div>

        {/* ── ENCABEZADO + FILTROS ── */}
        <div className="text-center mb-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] uppercase text-[10px] sm:text-xs mb-4 py-1.5 px-4 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10"
          >
            Casos Reales
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-primary-dark)] mb-5 tracking-tight"
          >
            Portafolio de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">proyectos</span>
          </motion.h2>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {categorias.map((cat, i) => {
            const c = colorCat[cat]
            const activo = filtro === cat
            const count = cat === "Todos" ? proyectos.length : proyectos.filter(p => p.categoria === cat).length
            
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setFiltro(cat)}
                className={`relative group px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden ${
                  activo
                    ? "text-white shadow-[0_8px_16px_-4px_rgba(0,0,0,0.15)] scale-105"
                    : "bg-white text-[var(--color-primary-dark)] border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
                style={
                  activo
                    ? { background: cat === "Todos" ? "#1e293b" : c?.dot, borderColor: "transparent" }
                    : {}
                }
              >
                {/* Indicador de color para inactivos */}
                {!activo && cat !== "Todos" && c && (
                  <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: c.dot }} />
                )}
                
                <span className="relative z-10">{cat}</span>
                
                {/* Contador */}
                <span 
                  className={`relative z-10 text-[11px] px-2 py-[1px] rounded-full font-black transition-colors ${
                    activo 
                      ? "bg-white/20 text-white" 
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  }`}
                >
                  {count}
                </span>

                {/* Fondo hover sutil si no está activo */}
                {!activo && cat !== "Todos" && c && (
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" 
                    style={{ backgroundColor: c.dot }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* ── GRILLA ── */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          <AnimatePresence>
            {proyectosFiltrados.map((proyecto) => (
              <ProyectoCard key={proyecto.id} proyecto={proyecto} />
            ))}
          </AnimatePresence>
        </motion.div>

        {proyectosFiltrados.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[var(--color-text-muted)] text-lg font-medium">No hay proyectos en esta categoría.</p>
          </div>
        )}

        {/* ── CTA FINAL ── */}
        <div className="mt-20">
          <ActionSection
            icon={<Zap size={28} className="text-[#fcd34d]" />}
            title={({ accentFrom, accentTo }) => (
              <>¿Tienes un proyecto en <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${accentFrom}, ${accentTo})` }}>mente?</span></>
            )}
            description="Cotiza gratis y recibe una propuesta a medida para tu empresa, fundo o comunidad."
            buttonLabel="Cotizar mi proyecto"
            buttonHref={`https://wa.me/${WHATSAPP}?text=Hola, me interesa cotizar un proyecto de energía solar`}
            buttonEffect="magnetic"
          />
        </div>

      </div>
    </div>
  )
}

export default ProyectosPage
