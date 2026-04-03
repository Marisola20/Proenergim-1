import { motion } from "framer-motion"
import { Zap, Sun, Droplets, Battery, Wind, Settings, ShieldCheck, Wrench } from "lucide-react"
import HeroBanner from "../components/HeroBanner"

const productos = [
  {
    icon: Sun,
    titulo: "Paneles Solares",
    descripcion: "Sistemas fotovoltaicos residenciales e industriales de alta eficiencia para generación de energía limpia.",
    color: "#f59e0b",
  },
  {
    icon: Droplets,
    titulo: "Bombas de Agua Solar",
    descripcion: "Soluciones de bombeo solar para riego tecnificado, agua potable rural y uso agrícola.",
    color: "#0ea5e9",
  },
  {
    icon: Battery,
    titulo: "Sistemas de Almacenamiento",
    descripcion: "Baterías y sistemas de respaldo energético para garantizar autonomía las 24 horas.",
    color: "#8b5cf6",
  },
  {
    icon: Zap,
    titulo: "Instalaciones Eléctricas",
    descripcion: "Proyectos de electrificación rural y urbana con estándares de seguridad y calidad.",
    color: "#1ed760",
  },
  {
    icon: Wind,
    titulo: "Energía Eólica",
    descripcion: "Sistemas híbridos solar-eólico para comunidades remotas y proyectos de gran escala.",
    color: "#06b6d4",
  },
  {
    icon: Settings,
    titulo: "Mantenimiento",
    descripcion: "Servicio técnico especializado, monitoreo y mantenimiento preventivo de sistemas instalados.",
    color: "#f97316",
  },
]

function Productos() {
  return (
    <main className="min-h-screen pb-24 bg-white">
      <HeroBanner
        subtitle="Tecnología solar"
        title="Nuestros"
        highlight="productos"
        description="Calidad y eficiencia en cada producto."
        patternId="soluciones"
      />

      {/* ── SECCIÓN DE IMPACTO (OVERLAP) ── */}
      <section className="relative z-30 -mt-24 px-6 mb-24">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl rounded-4xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] border-1 border-[var(--color-primary-light)] overflow-hidden flex flex-col lg:flex-row"
        >
          {/* Lado Izquierdo: El Gancho Visual/Texto */}
          <div className="lg:w-2/5 p-10 md:p-14 flex flex-col justify-center bg-gradient-to-br from-white/40 to-transparent">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-[var(--color-primary-dark)]">
              Calidad comprobada.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">Rendimiento garantizado.</span>
            </h2>
          </div>

          {/* Lado Derecho: Valor Agregado */}
          <div className="lg:w-3/5 p-10 md:p-14 bg-[var(--color-primary-dark)] text-white flex flex-col justify-center gap-8 relative overflow-hidden">
            {/* Círculos decorativos */}
            <div className="absolute top-[-20px] right-[10%] w-24 h-24 bg-white/[0.03] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10px] left-[15%] w-20 h-20 bg-white/[0.04] rounded-full pointer-events-none" />
            <div className="absolute top-[40%] right-[5%] w-16 h-16 bg-white/[0.02] rounded-full blur-md pointer-events-none" />
            <div className="absolute bottom-[20%] left-[5%] w-12 h-12 bg-white/[0.05] rounded-full pointer-events-none" />
            
            {/* Garantía */}
            <div className="flex gap-5 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <ShieldCheck size={22} className="text-[#7ad7ff]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-[#7ad7ff] mb-1">Marcas Líderes</h3>
                <p className="text-white text-[14px] leading-relaxed font-medium">
                  Trabajamos con el top 10 de fabricantes solares a nivel nacional.
                </p>
              </div>
            </div>

            {/* Soporte */}
            <div className="flex gap-5 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Wrench size={22} className="text-[#3cf57c]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-[#3cf57c] mb-1">Soporte Continuo</h3>
                <p className="text-white text-[14px] leading-relaxed font-medium">
                  Acompañamiento técnico para el rendimiento óptimo de tu inversión.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Grid de productos */}
      <section className="pb-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((prod, i) => {
              const Icon = prod.icon
              return (
                <motion.div
                  key={prod.titulo}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[var(--color-primary)]/30 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-md transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${prod.color}20` }}
                  >
                    <Icon size={26} style={{ color: prod.color }} />
                  </div>
                  <h3
                    className="font-bold text-xl mb-2"
                    style={{ color: "var(--color-primary-dark)" }}
                  >
                    {prod.titulo}
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                    {prod.descripcion}
                  </p>
                  <div
                    className="mt-5 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-full"
                    style={{ background: `linear-gradient(90deg, ${prod.color}, ${prod.color}55)` }}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Productos
