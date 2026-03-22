import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, ArrowRight, User, FolderOpen, Award } from "lucide-react"
import { Link } from "react-router-dom"
import { proyectos } from "../data/proyectos"
import HeroBanner from "../components/HeroBanner"

const WHATSAPP = "51971812567"

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

function ProyectoCard({ proyecto }) {
  const cat = colorCat[proyecto.categoria] || { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] border-2 hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all duration-400 flex flex-col"
      style={{ borderColor: cat.dot + "40" }}
    >
      {/* Video miniatura */}
      <div className="h-52 w-full relative bg-slate-100 overflow-hidden">
        <video
          src={proyecto.video}
          preload="none"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ willChange: "transform" }}
          loop
          muted
          playsInline
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0 }}
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

        {/* Play hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
          </div>
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
    <div className="bg-white min-h-screen pb-24">
      <HeroBanner
        title="Nuestros Proyectos"
        description="Explora nuestro portafolio de soluciones implementadas a nivel nacional."
        patternId="proyectos"
      />

      <div className="max-w-7xl mx-auto px-6">

        {/* ── STATS STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 mb-16"
        >
          {estadisticas.map((s, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl px-6 py-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.07)] flex items-center justify-between gap-4"
            >
              <div className="flex flex-col text-left">
                <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">
                  {s.valor}
                </p>
                <p className="text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex shrink-0 items-center justify-center">
                <s.Icon size={24} className="text-[var(--color-primary)]" />
              </div>
            </div>
          ))}
        </motion.div>

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
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categorias.map((cat, i) => {
            const c = colorCat[cat]
            const activo = filtro === cat
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setFiltro(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  activo
                    ? "text-white shadow-md"
                    : "bg-white text-[var(--color-primary-dark)] border border-slate-200 hover:border-[var(--color-primary)]/40"
                }`}
                style={
                  activo
                    ? { background: cat === "Todos"
                        ? "#FFC107"
                        : c?.dot, borderColor: "transparent" }
                    : {}
                }
              >
                {cat !== "Todos" && c && (
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5 -translate-y-[1px] align-middle"
                    style={{ backgroundColor: activo ? "rgba(255,255,255,0.7)" : c.dot }}
                  />
                )}
                {cat}
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
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 relative overflow-hidden rounded-3xl bg-[var(--color-primary-dark)] text-white text-center p-12 md:p-16"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#fcd34d]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 tracking-tight">
              ¿Tienes un proyecto en{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#1ed760]">mente?</span>
            </h2>
            <p className="text-white/80 text-base md:text-lg font-medium mb-8 max-w-lg mx-auto leading-relaxed">
              Cotiza gratis y recibe una propuesta a medida para tu empresa, fundo o comunidad.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hola, me interesa cotizar un proyecto de energía solar`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BE5C] text-white font-black px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Cotizar mi proyecto
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default ProyectosPage
