import { useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { MapPin, User, ArrowLeft, Calendar, ExternalLink } from "lucide-react"
import { proyectos } from "../data/proyectos"

const WHATSAPP = "51971812567"

const colorCat = {
  "Bombeo Solar":        { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  "Electrificación Solar": { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" },
  "Riego Tecnificado":   { bg: "#cffafe", text: "#0e7490", dot: "#06b6d4" },
  "Industrial":          { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" },
}

function WhatsappIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.15-1.265-.458-2.406-1.474-.89-.788-1.489-1.762-1.664-2.062-.175-.3-.019-.462.131-.611.136-.134.301-.349.45-.523.15-.174.2-.3.301-.497.101-.202.05-.376-.025-.525-.075-.15-.672-1.62-.924-2.215-.244-.58-.492-.501-.672-.51-.174-.008-.374-.008-.574-.008s-.525.074-.798.375c-.276.3-1.045 1.025-1.045 2.499s1.07 2.894 1.219 3.094c.15.195 2.109 3.238 5.106 4.536.713.31 1.267.495 1.701.633.714.227 1.365.195 1.88.118.575-.086 1.767-.721 2.016-1.42s.25-1.299.175-1.424c-.074-.125-.274-.2-.574-.35zM12.002 22C6.48 22 2 17.514 2 12S6.48 2 12.002 2c5.523 0 10.001 4.486 10.001 10s-4.478 10-10.001 10zM12.002 0C5.373 0 0 5.372 0 12c0 2.126.549 4.133 1.517 5.864L.015 24l6.305-1.654C8.016 23.364 9.944 24 12.002 24 18.631 24 24 18.628 24 12c0-6.628-5.369-12-11.998-12z" />
    </svg>
  )
}

function ProyectoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  const proyecto = proyectos.find((p) => p.id === id)
  const cat = colorCat[proyecto?.categoria] || { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" }

  if (!proyecto) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Proyecto no encontrado</h2>
        <button onClick={() => navigate("/proyectos")}
          className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-full font-semibold hover:bg-[var(--color-primary-dark)] transition-colors">
          Volver a Proyectos
        </button>
      </div>
    )
  }

  const similares = proyectos.filter((p) => p.categoria === proyecto.categoria && p.id !== proyecto.id).slice(0, 3)

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb / Volver */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-10">
          <Link to="/proyectos" className="hover:text-[var(--color-primary)] font-medium transition-colors">Proyectos</Link>
          <span>/</span>
          <span className="text-[var(--color-primary-dark)] font-bold truncate max-w-xs">{proyecto.nombre}</span>
        </div>

        {/* DETALLE PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">

          {/* INFO */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">

            {/* Badge categoría */}
            <div className="mb-5">
              <span className="inline-flex items-center gap-2 text-xs font-black px-4 py-2 rounded-full border"
                style={{ backgroundColor: cat.bg, color: cat.text, borderColor: cat.dot + "40" }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.dot }} />
                {proyecto.categoria}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--color-primary-dark)] leading-tight mb-6 tracking-tight">
              {proyecto.nombre}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-[0_1px_8px_-2px_rgba(0,0,0,0.06)]">
                <MapPin size={16} className="text-[var(--color-primary)] shrink-0" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Ubicación</p>
                  <p className="text-sm font-bold text-[var(--color-primary-dark)]">{proyecto.ubicacion}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-[0_1px_8px_-2px_rgba(0,0,0,0.06)]">
                <User size={16} className="text-[var(--color-primary)] shrink-0 opacity-80" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">Cliente</p>
                  <p className="text-sm font-bold text-[var(--color-primary-dark)]">{proyecto.cliente}</p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <p className="text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed mb-8 font-medium">
              {proyecto.descripcion}
            </p>

            {/* Botón WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hola, estoy interesado en un proyecto similar a: ${proyecto.nombre}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BE5C] text-white text-base font-black px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 self-start"
            >
              <WhatsappIcon size={20} />
              Quiero un proyecto similar
            </a>
          </motion.div>

          {/* VIDEO */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="w-full lg:sticky top-28">
            <div className="rounded-3xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)] border-2 border-slate-100 aspect-[4/3]"
              style={{ borderColor: cat.dot + "30" }}>
              <video src={proyecto.video} className="w-full h-full object-cover" autoPlay loop muted playsInline controls />
            </div>
          </motion.div>
        </div>

        {/* PROYECTOS SIMILARES */}
        {similares.length > 0 && (
          <div className="border-t border-slate-100 pt-16">
            <div className="text-center mb-10">
              <span className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] uppercase text-[10px] mb-4 py-1.5 px-4 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10">
                Más proyectos
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-[var(--color-primary-dark)] tracking-tight">
                Proyectos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">similares</span>
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
                      <video src={sim.video} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loop muted playsInline onMouseEnter={(e) => e.target.play()} onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0 }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
                        style={{ backgroundColor: simCat.bg + "ee", color: simCat.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: simCat.dot }} />
                        {sim.categoria}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h4 className="text-base font-black text-[var(--color-primary-dark)] mb-2 leading-snug line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                        {sim.nombre}
                      </h4>
                      <p className="text-[var(--color-text-muted)] text-xs leading-relaxed mb-4 line-clamp-2">{sim.descripcion}</p>
                      <Link to={`/proyecto/${sim.id}`}
                        className="mt-auto inline-flex items-center gap-1.5 text-[var(--color-primary)] font-black text-xs hover:gap-2.5 transition-all">
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
    </div>
  )
}

export default ProyectoDetalle
