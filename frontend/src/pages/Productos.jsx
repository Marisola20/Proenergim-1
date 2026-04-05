import { motion } from "framer-motion"
import { ShieldCheck, Wrench } from "lucide-react"
import HeroBanner from "../components/HeroBanner"

const productos = [
  { titulo: "Paneles Solares 400W Monocristalino", precio: "799.70" },
  { titulo: "Bomba de Agua Solar 1HP", precio: "1,721.08" },
  { titulo: "Batería Litio 100Ah 12V", precio: "1,112.62" },
  { titulo: "Inversor Solar 3kW MPPT", precio: "1,477.70" },
  { titulo: "Kit Solar Residencial 2kW", precio: "2,633.78" },
  { titulo: "Panel Solar Industrial 550W", precio: "5,650.02" },
  { titulo: "Sistema Eólico 1kW", precio: "7,388.49" },
  { titulo: "Variador Bombeo Solar 5.5kW", precio: "10,083.12" },
  { titulo: "Sistema Híbrido Solar-Eólico 10kW", precio: "17,993.15" },
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
          <div className="lg:w-2/5 p-10 md:p-14 flex flex-col justify-center bg-gradient-to-br from-white/40 to-transparent">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-[var(--color-primary-dark)]">
              Top calidad.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">
                Rendimiento garantizado.
              </span>
            </h2>
          </div>

          <div className="lg:w-3/5 p-10 md:p-14 bg-[var(--color-primary-dark)] text-white flex flex-col justify-center gap-8 relative overflow-hidden">
            <div className="absolute top-[-20px] right-[10%] w-24 h-24 bg-white/[0.03] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10px] left-[15%] w-20 h-20 bg-white/[0.04] rounded-full pointer-events-none" />

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

      {/* ── GRID DE PRODUCTOS ── */}
      <section className="pb-16 px-3 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4">
            {productos.map((prod, i) => (
              <motion.div
                key={prod.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="group bg-white rounded-xl border border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Imagen con badge precio */}
                <div className="relative">
                  <img
                    src="/images/Trayectoria/prueba1.webp"
                    alt={prod.titulo}
                    className="w-full aspect-square object-cover bg-gray-50"
                  />
                  {/* Badge precio */}
                  <div
                    className="absolute bottom-0 left-0 right-0 text-center py-1 px-1"
                    style={{ backgroundColor: "var(--color-green)" }}
                  >
                    <span className="font-bold text-[14px] sm:text-xs md:text-lg lg:text-2xl text-white">
                      S/. {prod.precio}
                    </span>
                  </div>
                </div>

                {/* Nombre */}
                <div className="px-2 py-1.5">
                  <p className="text-[5px] sm:text-[10px] md:text-lg lg:text-xl font-medium leading-tight text-center text-[var(--color-primary-dark)] line-clamp-2">
                    {prod.titulo}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Productos