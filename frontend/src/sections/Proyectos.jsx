import { useState, useEffect, useRef, memo, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, ArrowRight, ChevronLeft, ChevronRight, Award, Globe, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { proyectos, REGION_COORDS } from "../data/proyectos"
import PeruMap from "../components/PeruMap"

const WHATSAPP = "51936954890"

const STATS = [
  { icon: <Award size={15} />, num: "+15",   label: "Años exp."  },
  { icon: <Globe size={15} />, num: "Top 10", label: "Marcas"    },
  { icon: <Users size={15} />, num: "Staff",  label: "Espec."    },
  { icon: <Award size={15} />, num: "+200",  label: "Proyectos" },
]

function WhatsappIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.15-1.265-.458-2.406-1.474-.89-.788-1.489-1.762-1.664-2.062-.175-.3-.019-.462.131-.611.136-.134.301-.349.45-.523.15-.174.2-.3.301-.497.101-.202.05-.376-.025-.525-.075-.15-.672-1.62-.924-2.215-.244-.58-.492-.501-.672-.51-.174-.008-.374-.008-.574-.008s-.525.074-.798.375c-.276.3-1.045 1.025-1.045 2.499s1.07 2.894 1.219 3.094c.15.195 2.109 3.238 5.106 4.536.713.31 1.267.495 1.701.633.714.227 1.365.195 1.88.118.575-.086 1.767-.721 2.016-1.42s.25-1.299.175-1.424c-.074-.125-.274-.2-.574-.35zM12.002 22C6.48 22 2 17.514 2 12S6.48 2 12.002 2c5.523 0 10.001 4.486 10.001 10s-4.478 10-10.001 10zM12.002 0C5.373 0 0 5.372 0 12c0 2.126.549 4.133 1.517 5.864L.015 24l6.305-1.654C8.016 23.364 9.944 24 12.002 24 18.631 24 24 18.628 24 12c0-6.628-5.369-12-11.998-12z" />
    </svg>
  )
}

function StatsMobile() {
  return (
    <div className="flex gap-2 flex-wrap justify-center sm:hidden mt-3">
      {STATS.map((s, i) => (
        <div key={i} className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5">
          <span className="text-[var(--color-primary)]">{s.icon}</span>
          <span className="text-xs font-black text-[var(--color-primary-dark)]">{s.num}</span>
        </div>
      ))}
    </div>
  )
}

function StatsTablet() {
  return (
    <div className="hidden sm:flex lg:hidden border border-gray-100 rounded-xl overflow-hidden mt-6 w-full">
      {STATS.map((s, i) => (
        <div key={i} className={`flex items-center gap-2 px-3 py-2.5 flex-1 ${i < STATS.length - 1 ? "border-r border-gray-100" : ""}`}>
          <span className="text-[var(--color-primary)]">{s.icon}</span>
          <div>
            <div className="text-xs font-black text-[var(--color-primary-dark)] leading-none">{s.num}</div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

const ProjectVideo = memo(({ src, active, inView }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        videoRef.current?.pause()
      } else if (active && inView) {
        videoRef.current?.play().catch(() => {})
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    if (videoRef.current) {
      if (active && inView && !document.hidden) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [active, inView])

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      preload="metadata"
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
      style={{ visibility: active ? "visible" : "hidden" }}
    />
  )
})

ProjectVideo.displayName = "ProjectVideo"

const ProjectInfo = memo(({ p, isInView, onPrev, onNext, hasMultiple }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch bg-white rounded-[2rem] p-5 md:p-8 border-2 border-[var(--color-primary)]/40 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-1000" />
      
      {/* Multimedia side */}
      <div className="w-full lg:w-[48%] aspect-video rounded-[1.8rem] overflow-hidden shadow-2xl bg-gray-900 border border-white/40 relative group-hover:shadow-[var(--color-primary)]/20 transition-all duration-700">
        <ProjectVideo src={p.video} active={true} inView={isInView} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        
        {/* Navigation Arrows Overlay */}
        {hasMultiple && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center z-20 pointer-events-none">
            <button 
              onClick={(e) => { e.preventDefault(); onPrev(); }}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[var(--color-primary)] hover:border-transparent transition-all pointer-events-auto active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); onNext(); }}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[var(--color-primary)] hover:border-transparent transition-all pointer-events-auto active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Info side */}
      <div className="w-full lg:w-[52%] flex flex-col items-start text-left">
        <div className="flex items-center gap-3 mb-4 w-full">
          <span 
            className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
            style={{ 
              backgroundColor: p.color + "10", 
              color: p.color, 
              borderColor: p.color + "30" 
            }}
          >
            {p.categoria}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent" />
        </div>
        
        <h3 className="text-lg md:text-xl font-black text-[var(--color-primary-dark)] leading-tight mb-2">
          {p.nombre}
        </h3>
        
        <p className="text-gray-500 text-xs md:text-sm mb-5 leading-relaxed font-medium">
          {p.descripcion}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 w-full">
          {/* Ubicación — siempre visible */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white hover:border-[var(--color-primary)]/20 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
              <MapPin size={13} className="text-[var(--color-primary)]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Ubicación</span>
              <span className="text-[11px] font-bold text-[var(--color-primary-dark)] truncate block">{p.ubicacion}</span>
            </div>
          </div>
          {/* Cliente — solo sm+ */}
          {p.cliente && (
            <div className="hidden sm:flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white hover:border-[var(--color-primary)]/20 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="min-w-0">
                <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Cliente</span>
                <span className="text-[11px] font-bold text-[var(--color-primary-dark)] truncate block">{p.cliente}</span>
              </div>
            </div>
          )}
        </div>

        {/* Galería de Imágenes */}
        {p.images && p.images.length > 0 && (
          <div className="w-full mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Galería</h4>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-custom">
              {p.images.map((img, i) => (
                <div 
                  key={i} 
                  className="shrink-0 w-28 h-20 rounded-xl overflow-hidden border-2 border-transparent hover:border-[var(--color-primary)]/50 transition-all cursor-pointer group/img shadow-md hover:shadow-lg"
                >
                  <img 
                    src={img} 
                    alt={`${p.nombre} gallery ${i}`} 
                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" 
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-auto">
          <Link
            to={`/proyecto/${p.id}`}
            className="shrink-0 text-[var(--color-primary-dark)] hover:text-white border-2 border-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] font-bold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-sm"
          >
            Ver info
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP}?text=Hola, me interesa saber más sobre el proyecto: ${p.nombre}`}
            target="_blank" rel="noreferrer noopener"
            className="shrink-0 text-[#25D366] hover:text-white border-2 border-[#25D366]/30 hover:bg-[#25D366] font-bold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-sm"
          >
            WhatsApp
            <WhatsappIcon size={16} />
          </a>
        </div>
      </div>
    </div>
  )
})

ProjectInfo.displayName = "ProjectInfo"

function Proyectos() {
  const [activeRegionIdx, setActiveRegionIdx] = useState(0)
  const [activeProjectIdx, setActiveProjectIdx] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef(null)

  // Agrupar proyectos por región
  const { groupedProjects, visibleProjects } = useMemo(() => {
    // Solo regiones que tengan proyectos y no estén ocultas
    const regionsWithProjects = [...new Set(proyectos.map(p => p.region))]
    const grouped = regionsWithProjects
      .filter(regionName => REGION_COORDS[regionName] && !REGION_COORDS[regionName].hidden)
      .map(regionName => ({
        region: regionName,
        items: proyectos.filter(p => p.region === regionName)
      }))

    // Lista plana de proyectos en regiones visibles para el mapa y navegación global
    const visible = grouped.flatMap(g => g.items)

    return { groupedProjects: grouped, visibleProjects: visible }
  }, [])

  // Índice global para el mapa (compatibilidad con PeruMap)
  const globalIndex = useMemo(() => {
    let count = 0
    for (let i = 0; i < activeRegionIdx; i++) {
      count += groupedProjects[i].items.length
    }
    return count + activeProjectIdx
  }, [activeRegionIdx, activeProjectIdx, groupedProjects])

  useEffect(() => {
    if (!isAutoPlaying || !isInView) return
    const timer = setInterval(() => {
      const currentRegion = groupedProjects[activeRegionIdx]
      if (activeProjectIdx < currentRegion.items.length - 1) {
        setActiveProjectIdx(prev => prev + 1)
      } else {
        setActiveRegionIdx(prev => (prev + 1) % groupedProjects.length)
        setActiveProjectIdx(0)
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, isInView, activeRegionIdx, activeProjectIdx, groupedProjects])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleManualRegionSelect = useCallback((idx) => {
    setIsAutoPlaying(false)
    setActiveRegionIdx(idx)
    setActiveProjectIdx(0)
  }, [])

  const handleNextProject = useCallback(() => {
    setIsAutoPlaying(false)
    const currentRegion = groupedProjects[activeRegionIdx]
    if (activeProjectIdx < currentRegion.items.length - 1) {
      setActiveProjectIdx(prev => prev + 1)
    } else {
      setActiveRegionIdx(prev => (prev + 1) % groupedProjects.length)
      setActiveProjectIdx(0)
    }
  }, [activeRegionIdx, activeProjectIdx, groupedProjects])

  const handlePrevProject = useCallback(() => {
    setIsAutoPlaying(false)
    if (activeProjectIdx > 0) {
      setActiveProjectIdx(prev => prev - 1)
    } else {
      const prevRegionIdx = (activeRegionIdx - 1 + groupedProjects.length) % groupedProjects.length
      setActiveRegionIdx(prevRegionIdx)
      setActiveProjectIdx(groupedProjects[prevRegionIdx].items.length - 1)
    }
  }, [activeRegionIdx, activeProjectIdx, groupedProjects])

  const handleMapSelect = useCallback((globalIdx) => {
    setIsAutoPlaying(false)
    // Encontrar región y sub-índice basado en globalIdx
    let count = 0
    for (let i = 0; i < groupedProjects.length; i++) {
      if (globalIdx < count + groupedProjects[i].items.length) {
        setActiveRegionIdx(i)
        setActiveProjectIdx(globalIdx - count)
        break
      }
      count += groupedProjects[i].items.length
    }
  }, [groupedProjects])

  const currentProject = groupedProjects[activeRegionIdx].items[activeProjectIdx]

  return (
    <section id="proyectos" ref={sectionRef} className="section-py bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* BLOQUE SUPERIOR: CONTENIDO + MAPA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10 px-6 lg:px-12">
          <div className="text-center lg:text-left order-1 lg:order-1">
            <motion.span
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] uppercase text-[10px] mb-6 py-1.5 px-4 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10"
            >
              Nuestra Huella
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-4xl font-black text-[var(--color-primary-dark)] tracking-tighter mb-4 leading-[0.9]"
            >
              Proyectos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">Destacados</span>
            </motion.h2>
            <p className="text-[var(--color-text-muted)] text-base md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Descubre cómo transformamos la energía en soluciones reales para nuestros clientes en todo el Perú.
            </p>
          </div>

          <div className="flex flex-col items-center order-2 lg:order-2">
            <PeruMap 
              projects={visibleProjects} 
              currentIndex={globalIndex} 
              onSelectProject={handleMapSelect} 
            />
            <StatsMobile />
            <StatsTablet />
          </div>
        </div>

        {/* BLOQUE MEDIO: TAGS DE DEPARTAMENTOS */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <h4 className="shrink-0 text-sm font-black tracking-[0.2em] text-gray-400 hidden sm:block">Departamentos:</h4>
            <div className="flex gap-2 overflow-x-auto p-2 scrollbar-custom flex-1 items-center">
              {groupedProjects.map((group, idx) => {
                const isActive = idx === activeRegionIdx
                return (
                  <button
                    key={group.region}
                    onClick={() => handleManualRegionSelect(idx)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 pb-2 pt-1 text-xs font-bold transition-all duration-200 bg-transparent border-b-2 ${
                      isActive
                        ? "border-[#0ea5e1] text-[#0a6b90]"
                        : "border-transparent text-gray-400 hover:border-[#b3e4f7] hover:text-[#0ea5e1]"
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e1] shrink-0" />}
                    <span>{group.region}</span>
                  </button>
                )
              })}
            </div>
          </div>
          {/* Botón Ver todos — movido aquí debajo de departamentos */}
          <div className="flex justify-center lg:justify-start">
            <Link
              to="/proyectos"
              className="shrink-0 text-[var(--color-primary-dark)] hover:text-white border-2 border-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] font-bold text-sm px-7 py-3 rounded-full flex items-center gap-2 transition-all w-fit shadow-lg shadow-black/5"
            >
              Ver todos los proyectos
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>

        {/* DETALLE DEL PROYECTO */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <ProjectInfo 
                p={currentProject} 
                isInView={isInView} 
                onPrev={handlePrevProject}
                onNext={handleNextProject}
                hasMultiple={groupedProjects[activeRegionIdx].items.length > 1}
              />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}

export default Proyectos
