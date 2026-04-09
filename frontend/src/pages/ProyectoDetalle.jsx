import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, User, X, ExternalLink } from "lucide-react"
import { proyectos } from "../data/proyectos"

const WHATSAPP = "51936954890"

const colorCat = {
  "Bombeo Solar":          { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  "Electrificación Solar": { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" },
  "Riego Tecnificado":     { bg: "#cffafe", text: "#0e7490", dot: "#06b6d4" },
  "Industrial":            { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" },
}

function WhatsappIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.15-1.265-.458-2.406-1.474-.89-.788-1.489-1.762-1.664-2.062-.175-.3-.019-.462.131-.611.136-.134.301-.349.45-.523.15-.174.2-.3.301-.497.101-.202.05-.376-.025-.525-.075-.15-.672-1.62-.924-2.215-.244-.58-.492-.501-.672-.51-.174-.008-.374-.008-.574-.008s-.525.074-.798.375c-.276.3-1.045 1.025-1.045 2.499s1.07 2.894 1.219 3.094c.15.195 2.109 3.238 5.106 4.536.713.31 1.267.495 1.701.633.714.227 1.365.195 1.88.118.575-.086 1.767-.721 2.016-1.42s.25-1.299.175-1.424c-.074-.125-.274-.2-.574-.35zM12.002 22C6.48 22 2 17.514 2 12S6.48 2 12.002 2c5.523 0 10.001 4.486 10.001 10s-4.478 10-10.001 10zM12.002 0C5.373 0 0 5.372 0 12c0 2.126.549 4.133 1.517 5.864L.015 24l6.305-1.654C8.016 23.364 9.944 24 12.002 24 18.631 24 24 18.628 24 12c0-6.628-5.369-12-11.998-12z" />
    </svg>
  )
}

// ── SHIMMER BUTTON ──
function WhatsappButton({ onClick, fullWidth = false }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover="hover"
      initial="initial"
      className={`relative overflow-hidden py-3.5 rounded-2xl font-black text-white text-sm shadow-lg flex items-center justify-center gap-2.5 transition-all hover:brightness-110 ${
        fullWidth ? "w-full px-6" : "px-8 self-start"
      }`}
      style={{ backgroundColor: "var(--color-primary-dark)" }}
    >
      {/* Luz que pasa */}
      <motion.div
        variants={{
          initial: { x: "-150%", opacity: 0 },
          hover:   { x:  "150%", opacity: 1 },
        }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)" }}
      />
      <WhatsappIcon size={18} />
      <span className="relative z-10">Quiero un proyecto similar</span>
    </motion.button>
  )
}

// ── MODAL FORMULARIO ──
function ModalSimilar({ proyecto, onClose }) {
  const [form, setForm] = useState({ nombre: "", distrito: "" })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const mensaje = `Hola, me llamo *${form.nombre}* y quisiera un proyecto similar a: *${proyecto.nombre}*, en el distrito de *${form.distrito}*.`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`, "_blank")
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-lg font-black text-[var(--color-primary-dark)] mb-1">
          Consultanos
        </h2>
        <p className="text-xs text-gray-400 mb-5">
          Proyecto similiar a: <br />
          <span className="font-semibold text-[var(--color-primary-dark)]">{proyecto.nombre}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="¿Cuál es tu nombre?*"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
          />
          <input
            name="distrito"
            value={form.distrito}
            onChange={handleChange}
            required
            placeholder="¿En qué distrito se encuentra el proyecto?*"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            style={{ backgroundColor: "#25D366" }}
          >
            <WhatsappIcon size={16} />
            Abrir WhatsApp
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ── PÁGINA PRINCIPAL ──
function ProyectoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  const proyecto = proyectos.find((p) => p.id === id)
  const cat = colorCat[proyecto?.categoria] || { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" }

  if (!proyecto) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Proyecto no encontrado</h2>
        <button
          onClick={() => navigate("/proyectos")}
          className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-full font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          Volver a Proyectos
        </button>
      </div>
    )
  }

  const similares = proyectos
    .filter((p) => p.categoria === proyecto.categoria && p.id !== proyecto.id)
    .slice(0, 3)

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── BREADCRUMB — solo texto "Proyectos /", sin badge duplicado ── */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-10">
          <Link to="/proyectos" className="hover:text-[var(--color-primary)] font-medium transition-colors">
            Proyectos
          </Link>
          <span>/</span>
          <span className="font-medium">{proyecto.categoria}</span>
        </div>

        {/* ── DETALLE PRINCIPAL ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* INFO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col @container"
          >
            {/* Badge categoría */}
            <div className="mb-4">
              <span
                className="inline-flex items-center gap-2 text-xs font-black px-4 py-2 rounded-full border"
                style={{ backgroundColor: cat.bg, color: cat.text, borderColor: cat.dot + "40" }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.dot }} />
                {proyecto.categoria}
              </span>
            </div>

            {/* FIX 1: Título más pequeño → 1-2 líneas */}
            <h1 className="text-lg md:text-xl lg:text-3xl font-black text-[var(--color-primary-dark)] leading-tight mb-5 tracking-tight">
              {proyecto.nombre}
            </h1>

            {/* Descripción PRIMERO */}
            <p className="text-[var(--color-text-muted)] text-sm md:text-base leading-relaxed mb-6 font-medium">
              {proyecto.descripcion}
            </p>

            {/* FIX 3: Barra de información premium */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 sm:gap-x-8 py-5 mb-8 border-y border-slate-100">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-slate-50 text-[var(--color-primary)] border border-slate-100/50">
                  <MapPin size={13} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-0.5">Ubicación</p>
                  <p className="text-[11px] sm:text-sm font-bold text-[var(--color-primary-dark)]">{proyecto.ubicacion}</p>
                </div>
              </div>
              
              {proyecto.cliente && (
                <>
                  <div className="hidden sm:block w-px h-8 bg-slate-100" />
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-slate-50 text-[var(--color-primary)] border border-slate-100/50">
                      <User size={13} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-0.5">Cliente</p>
                      <p className="text-[11px] sm:text-sm font-bold text-[var(--color-primary-dark)]">{proyecto.cliente}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Galería — solo zoom/shimmer, sin lightbox */}
            {proyecto.images && proyecto.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-2">
                {proyecto.images.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="aspect-square rounded-2xl overflow-hidden shadow-sm border-2 border-transparent hover:border-[var(--color-primary)]/30 transition-all duration-300 cursor-default relative group"
                  >
                    <img
                      src={img}
                      alt={`${proyecto.nombre} ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Shimmer */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)" }}
                    />
                  </motion.div>
                ))}
              </div>
            )}

          </motion.div>

          {/* VIDEO + CTA 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:sticky top-28 flex flex-col gap-4"
          >
            {/* Video aspect-video */}
            <div
              className="rounded-3xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)] border-2 aspect-video"
              style={{ borderColor: cat.dot + "30" }}
            >
              <video
                src={proyecto.video}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                controls
              />
            </div>

            {/* CTA 2 — debajo del video, ancho completo */}
            <WhatsappButton onClick={() => setModalOpen(true)} fullWidth />
          </motion.div>
        </div>

        {/* ── PROYECTOS SIMILARES ── */}
        {similares.length > 0 && (
          <div className="border-t border-slate-100 pt-16">
            <div className="text-center mb-10">
              <span className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] uppercase text-[10px] mb-4 py-1.5 px-4 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10">
                Más proyectos
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-[var(--color-primary-dark)] tracking-tight">
                Proyectos{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">
                  similares
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similares.map((sim, i) => {
                const simCat = colorCat[sim.categoria] || { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" }
                return (
                  <motion.article
                    key={sim.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col group border-2"
                    style={{ borderColor: simCat.dot + "35" }}
                  >
                    <div className="h-44 w-full relative bg-slate-100 overflow-hidden">
                      <video
                        src={sim.video}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loop muted playsInline
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span
                        className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
                        style={{ backgroundColor: simCat.bg + "ee", color: simCat.text }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: simCat.dot }} />
                        {sim.categoria}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h4 className="text-base font-black text-[var(--color-primary-dark)] mb-2 leading-snug line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                        {sim.nombre}
                      </h4>
                      <p className="text-[var(--color-text-muted)] text-xs leading-relaxed mb-4 line-clamp-2">
                        {sim.descripcion}
                      </p>
                      <Link
                        to={`/proyecto/${sim.id}`}
                        className="mt-auto inline-flex items-center gap-1.5 text-[var(--color-primary)] font-black text-xs hover:gap-2.5 transition-all"
                      >
                        Ver proyecto <ExternalLink size={12} />
                      </Link>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {modalOpen && (
          <ModalSimilar proyecto={proyecto} onClose={() => setModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProyectoDetalle