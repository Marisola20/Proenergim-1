import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, ArrowRight, ChevronLeft, ChevronRight, User } from "lucide-react"
import { Link } from "react-router-dom"
import { proyectos } from "../data/proyectos"

const WHATSAPP = "51971812567"

function WhatsappIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.15-1.265-.458-2.406-1.474-.89-.788-1.489-1.762-1.664-2.062-.175-.3-.019-.462.131-.611.136-.134.301-.349.45-.523.15-.174.2-.3.301-.497.101-.202.05-.376-.025-.525-.075-.15-.672-1.62-.924-2.215-.244-.58-.492-.501-.672-.51-.174-.008-.374-.008-.574-.008s-.525.074-.798.375c-.276.3-1.045 1.025-1.045 2.499s1.07 2.894 1.219 3.094c.15.195 2.109 3.238 5.106 4.536.713.31 1.267.495 1.701.633.714.227 1.365.195 1.88.118.575-.086 1.767-.721 2.016-1.42s.25-1.299.175-1.424c-.074-.125-.274-.2-.574-.35zM12.002 22C6.48 22 2 17.514 2 12S6.48 2 12.002 2c5.523 0 10.001 4.486 10.001 10s-4.478 10-10.001 10zM12.002 0C5.373 0 0 5.372 0 12c0 2.126.549 4.133 1.517 5.864L.015 24l6.305-1.654C8.016 23.364 9.944 24 12.002 24 18.631 24 24 18.628 24 12c0-6.628-5.369-12-11.998-12z" />
    </svg>
  )
}

function Proyectos() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Excluir algunos para no tener los 11 en destacados, o mostrar todos
  const destacados = proyectos.slice(0, 6)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % destacados.length)
    }, 6000) // Cambia cada 6 segundos
    return () => clearInterval(timer)
  }, [destacados.length])

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % destacados.length)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + destacados.length) % destacados.length)

  const p = destacados[currentIndex]

  return (
    <section id="proyectos" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
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
              className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-primary-dark)] mb-3 tracking-tight"
            >
              Proyectos{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">Destacados</span>
            </motion.h2>
            <p className="text-[var(--color-text-muted)] text-base md:text-lg font-medium leading-relaxed">
              Descubre cómo transformamos la energía en soluciones reales para nuestros clientes.
            </p>
          </div>

          <Link 
            to="/proyectos" 
            className="shrink-0 text-[var(--color-primary-dark)] hover:text-white border-2 border-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 transition-all"
          >
            Ver todos los proyectos <ArrowRight size={16} />
          </Link>
        </div>

        {/* CONTENEDOR DEL CARRUSEL */}
        <div 
          className="relative bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[var(--color-primary)] min-h-[460px] flex flex-col md:flex-row group transition-colors duration-500"
        >
          {/* BOTÓN ANTERIOR — lado izquierdo */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-[var(--color-primary)] text-white backdrop-blur-md transition-all duration-300 border border-white/20 shadow-md"
            aria-label="Proyecto anterior"
          >
            <ChevronLeft size={18} />
          </button>

          {/* BOTÓN SIGUIENTE — lado derecho */}
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-[var(--color-primary)] text-white backdrop-blur-md transition-all duration-300 border border-white/20 shadow-md"
            aria-label="Proyecto siguiente"
          >
            <ChevronRight size={18} />
          </button>
          
          {/* LADO IZQUIERDO: Info (aprox 40% ancho) */}
          <div className="w-full md:w-[40%] p-8 md:p-12 flex flex-col justify-center z-10 bg-white relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col h-full justify-center"
              >
                <div className="mb-4">
                  <span 
                    className="inline-block text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: p.color + "15", color: p.color }}
                  >
                    {p.categoria}
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--color-primary-dark)] leading-tight mb-4">
                  {p.nombre}
                </h3>
                
                <p className="text-gray-500 text-sm md:text-base mb-6 line-clamp-3 md:line-clamp-4">
                  {p.descripcion}
                </p>
                
                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm font-medium">
                    <MapPin size={16} className="text-[var(--color-primary)]" />
                    <span>{p.ubicacion}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm font-medium">
                    <User size={16} className="text-[var(--color-primary)] opacity-70" />
                    <span>Cliente: {p.cliente}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-auto">
                  <Link
                    to={`/proyecto/${p.id}`}
                    className="flex items-center gap-2 bg-transparent text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-white border-2 border-[var(--color-primary-dark)]/20 hover:border-[var(--color-primary-dark)] text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300"
                  >
                    Ver info <ArrowRight size={16} />
                  </Link>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=Hola, me interesa saber más sobre el proyecto: ${p.nombre}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 bg-transparent text-[#25D366] hover:bg-[#25D366] hover:text-white border-2 border-[#25D366]/30 hover:border-[#25D366] text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300"
                  >
                    <WhatsappIcon size={16} />
                    WhatsApp
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* LADO DERECHO: MULTIMEDIA (aprox 60% ancho) */}
          <div className="w-full md:w-[60%] h-[350px] md:h-auto relative bg-gray-900 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 w-full h-full"
              >
                <video 
                  src={p.video} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* INDICADORES (Puntitos) */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {destacados.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? "w-8 bg-[var(--color-primary)]" 
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Proyectos
