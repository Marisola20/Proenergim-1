import { useMemo } from "react"
import { motion } from "framer-motion"
import { MapPin, Globe, Users, Clock, Award } from "lucide-react"
import { REGION_COORDS } from "../data/proyectos"

const PeruMap = ({ projects, currentIndex, onSelectProject }) => {
  // Encontrar las regiones únicas presentes en la lista de proyectos
  const projectRegions = useMemo(() => {
    const regions = {}
    projects.forEach((p, idx) => {
      if (!regions[p.region]) {
        regions[p.region] = {
          name: p.region,
          firstIndex: idx, // Para navegar al primer proyecto de esta región al hacer clic
          coords: REGION_COORDS[p.region]
        }
      }
    })
    return Object.values(regions).filter(r => r.coords && !r.coords.hidden)
  }, [projects])

  const activeProject = projects[currentIndex]
  const activeRegionName = activeProject?.region

  return (
    <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center bg-transparent overflow-visible mx-auto p-4 lg:p-0">
      <svg
        viewBox="0 0 648 648"
        className="w-full h-full relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* User's Map Image */}
        <image 
          href="/images/proyecto/mapa.svg" 
          x="0" 
          y="0" 
          width="648" 
          height="648" 
        />

        {/* Markers (One per region) */}
        {projectRegions.map((reg, index) => {
          const isActive = reg.name === activeRegionName
          const { x: coordX, y: coordY } = reg.coords
          const x = (coordX / 100) * 648
          const y = (coordY / 100) * 648

          return (
            <motion.g
              key={reg.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              style={{ cursor: "pointer" }}
              onClick={() => onSelectProject(reg.firstIndex)}
            >
              {/* Pulse effect for active marker */}
              {isActive && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="22"
                  fill="var(--color-primary)"
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
                />
              )}

              {/* Marker Dot */}
              <motion.circle
                cx={x}
                cy={y}
                r={isActive ? "10" : "7"}
                fill={isActive ? "var(--color-primary)" : "var(--color-green)"}
                stroke="white"
                strokeWidth="2.5"
                whileHover={{ scale: 1, strokeWidth: 2 }}
                animate={{
                  scale: isActive ? 0.8 : 1,
                  filter: isActive ? "drop-shadow(0 0 8px rgba(30,215,96,0.5))" : "none"
                }}
              />
            </motion.g>
          )
        })}
      </svg>
      
      {/* Decorative Expert Info Cards */}
      {/* Card 1: Experience (Top Left) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-[-8%] -left-[1%] z-20 pointer-events-none"
      >
        <div className="bg-white/80 backdrop-blur-md border-1 border-[var(--color-primary)] p-3 rounded-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
            <Award size={16} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <span className="block text-xs font-black text-slate-800 leading-none">+15 Años</span>
            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Experiencia Solar</span>
          </div>
        </div>
      </motion.div>

      {/* Card 2: Global Brands (Top Right) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-[30%] -right-[8%] z-20 pointer-events-none"
      >
        <div className="bg-white/80 backdrop-blur-md border-1 border-blue-600 p-3 rounded-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Globe size={16} className="text-blue-600" />
          </div>
          <div>
            <span className="block text-xs font-black text-slate-800 leading-none">Top 10 Global</span>
            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Marcas Premium</span>
          </div>
        </div>
      </motion.div>

      {/* Card 3: Staff (Bottom Left) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="absolute bottom-[20%] -left-[5%] z-20 pointer-events-none"
      >
        <div className="bg-white/80 backdrop-blur-md border-1 border-green-600 p-3 rounded-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Users size={16} className="text-green-600" />
          </div>
          <div>
            <span className="block text-xs font-black text-slate-800 leading-none">Staff Especializado</span>
            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Perú y Extranjero</span>
          </div>
        </div>
      </motion.div>

      {/* Card 4: After-sales (Bottom Right) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-[5%] -right-[15%] z-20 pointer-events-none"
      >
        <div className="bg-white/90 border-1 border-orange-600 backdrop-blur-md p-3.5 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <Award size={20} className="text-orange-600" />
          </div>
          <div>
            <span className="block text-base font-black text-[var(--color-primary-dark)] leading-none">+ 200</span>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Proyectos Ejecutados</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PeruMap
