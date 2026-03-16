import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, ArrowRight, User } from "lucide-react"
import { Link } from "react-router-dom"
import { proyectos } from "../data/proyectos"

const ProyectosIconPattern = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.2]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="proyectos-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
        {/* Solar Panel / Grid */}
        <g transform="translate(38, 13) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </g>
        {/* Wrench / Settings */}
        <g transform="translate(138, 13) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </g>
        {/* Map Pin */}
        <g transform="translate(88, 63) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
           <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 0-16 0Z"/>
           <circle cx="12" cy="10" r="3"/>
        </g>
        {/* Checkmark */}
        <g transform="translate(188, 63) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </g>
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#proyectos-pattern)" />
  </svg>
)

function ProyectosPage() {
  const [filtro, setFiltro] = useState("Todos")

  // Obtener categorías únicas
  const categorias = ["Todos", ...new Set(proyectos.map(p => p.categoria))]

  const proyectosFiltrados = filtro === "Todos" 
    ? proyectos 
    : proyectos.filter(p => p.categoria === filtro)

  return (
    <div className="bg-[var(--color-bg-soft)] min-h-screen pb-20">
      
      {/* ENCABEZADO */}
      <div className="relative bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] pt-28 pb-20 px-6 text-center text-white overflow-hidden shadow-inner mb-12">
        <ProyectosIconPattern />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md mb-4"
          >
            Nuestros Proyectos
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 drop-shadow-sm font-medium max-w-2xl mx-auto text-lg"
          >
            Explora nuestro portafolio de soluciones implementadas a nivel nacional.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* FILTROS */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {categorias.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setFiltro(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                filtro === cat
                  ? "bg-[var(--color-accent)] text-[#1a1a1a] shadow-md"
                  : "bg-white text-[var(--color-primary-dark)] border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* GRILLA DE PROYECTOS */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {proyectosFiltrados.map((proyecto) => (
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={proyecto.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group border border-[var(--color-primary)]"
              >
                {/* VIDEO / IMAGEN MINIATURA (Reproduce en mute loop si es un video ligero) */}
                <div className="h-48 w-full relative bg-gray-100 overflow-hidden">
                  <video 
                    src={proyecto.video} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loop muted playsInline 
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-300"></div>
                  
                  {/* Badge Categoría */}
                  <div className="absolute top-4 left-4">
                    <span 
                      className="inline-block text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md bg-white/90 shadow-sm"
                      style={{ color: proyecto.color }}
                    >
                      {proyecto.categoria}
                    </span>
                  </div>
                </div>

                {/* INFO */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[var(--color-primary-dark)] mb-3 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                    {proyecto.nombre}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-5 line-clamp-3">
                    {proyecto.descripcion}
                  </p>
                  
                  <div className="mt-auto flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-xs font-medium">
                      <MapPin size={14} className="text-[var(--color-primary)] shrink-0" />
                      <span className="truncate">{proyecto.ubicacion}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-xs font-medium">
                      <User size={14} className="text-[var(--color-primary)] opacity-70 shrink-0" />
                      <span className="truncate">{proyecto.cliente}</span>
                    </div>
                  </div>

                  <Link
                    to={`/proyecto/${proyecto.id}`}
                    className="w-full flex items-center justify-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white text-sm font-bold px-4 py-3 rounded-full transition-all duration-300"
                  >
                    Ver detalles completos <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {proyectosFiltrados.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No se encontraron proyectos en esta categoría.</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProyectosPage
