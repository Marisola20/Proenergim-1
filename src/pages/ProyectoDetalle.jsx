import { useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { MapPin, User, ArrowLeft, MessageCircle } from "lucide-react"
import { proyectos } from "../data/proyectos"

const WHATSAPP = "51971812567"

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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const proyecto = proyectos.find((p) => p.id === id)

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

  // Obtener proyectos similares (misma categoría, excluyendo el actual), máximo 3
  const similares = proyectos
    .filter((p) => p.categoria === proyecto.categoria && p.id !== proyecto.id)
    .slice(0, 3)

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* BOTON VOLVER */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] font-bold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Volver
        </button>

        {/* DETALLE PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">
          
          {/* INFO COLUMN */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full justify-center"
          >
            <div className="mb-6">
              <span 
                className="inline-block text-xs font-bold px-4 py-1.5 rounded-full"
                style={{ backgroundColor: proyecto.color + "15", color: proyecto.color }}
              >
                {proyecto.categoria}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary-dark)] leading-tight mb-8">
              {proyecto.nombre}
            </h1>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-6 mb-8 text-gray-600 bg-gray-50 p-6 rounded-2xl border border-gray-100 items-center justify-between">
              <div className="flex gap-6">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Ubicación</p>
                    <p className="font-semibold text-gray-800">{proyecto.ubicacion}</p>
                  </div>
                </div>
                <div className="w-px bg-gray-200 hidden sm:block"></div>
                <div className="flex items-start gap-3">
                  <User size={20} className="text-[var(--color-primary)] mt-0.5 shrink-0 opacity-80" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Cliente</p>
                    <p className="font-semibold text-gray-800">{proyecto.cliente}</p>
                  </div>
                </div>
              </div>
              
              {/* Botón principal de WhatsApp unificado en la caja de información */}
              <a
                href={`https://wa.me/${WHATSAPP}?text=Hola, estoy interesado en implementar un proyecto similar a: ${proyecto.nombre}`}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20BE5C] text-white text-base font-bold px-6 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap hover:-translate-y-0.5"
              >
                <WhatsappIcon size={20} />
                Quiero un proyecto similar
              </a>
            </div>

            <div className="prose prose-lg text-gray-600 mb-10">
              <p className="leading-relaxed">
                {proyecto.descripcion}
              </p>
            </div>
          </motion.div>

          {/* MEDIA COLUMN */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:sticky top-28"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-gray-900 border-4 border-white aspect-[4/3] md:aspect-video lg:aspect-[4/3]">
              <video 
                src={proyecto.video} 
                className="w-full h-full object-cover"
                autoPlay loop muted playsInline controls
              />
            </div>
          </motion.div>
        </div>

        {/* PROYECTOS SIMILARES */}
        {similares.length > 0 && (
          <div className="border-t border-gray-100 pt-16">
            <h3 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-8">
              Proyectos Similares
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {similares.map((sim, i) => (
                <motion.article
                  key={sim.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group border border-[var(--color-primary)]"
                >
                  <div className="h-40 w-full relative bg-gray-100 overflow-hidden">
                    <video 
                      src={sim.video} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loop muted playsInline 
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <span 
                      className="text-[10px] font-black tracking-widest uppercase mb-2"
                      style={{ color: sim.color }}
                    >
                      {sim.categoria}
                    </span>
                    <h4 className="text-lg font-bold text-[var(--color-primary-dark)] mb-2 line-clamp-2">
                      {sim.nombre}
                    </h4>
                    <Link
                      to={`/proyecto/${sim.id}`}
                      className="mt-auto inline-block text-[var(--color-primary)] font-bold text-sm hover:underline"
                    >
                      Leer más &rarr;
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProyectoDetalle
