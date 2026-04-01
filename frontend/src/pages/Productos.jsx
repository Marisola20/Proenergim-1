import { motion } from "framer-motion"
import { Zap, Sun, Droplets, Battery, Wind, Settings } from "lucide-react"
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
    <main className="min-h-screen pb-24">
      <HeroBanner
        subtitle="Tecnología solar"
        title="Nuestros"
        highlight="productos"
        description="Calidad y eficiencia en cada producto."
        patternId="soluciones"
      />

      {/* Grid de productos */}
      <section className="py-16 px-4 bg-white">
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
