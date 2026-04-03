import { motion } from "framer-motion"
import { Headset, MapPin } from "lucide-react"
import Contacto from "../sections/Contacto"
import HeroBanner from "../components/HeroBanner"

function ContactoPage() {
  return (
    <main className="pb-24 bg-white">
      <HeroBanner 
        subtitle="Estamos para ayudarte"
        title="Asesoría"
        highlight="personalizada"
        description="Recibe asesoría en cada etapa de tu proyecto."
        patternId="contacto"
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
              Siempre listos.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">En todo el Perú.</span>
            </h2>
          </div>

          {/* Lado Derecho: Info Rápida */}
          <div className="lg:w-3/5 p-10 md:p-14 bg-[var(--color-primary-dark)] text-white flex flex-col justify-center gap-8 relative overflow-hidden">
            {/* Círculos decorativos */}
            <div className="absolute top-[-20px] right-[10%] w-24 h-24 bg-white/[0.03] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10px] left-[15%] w-20 h-20 bg-white/[0.04] rounded-full pointer-events-none" />
            
            {/* Asesoría */}
            <div className="flex gap-5 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Headset size={22} className="text-[#7ad7ff]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-[#7ad7ff] mb-1">Equipo Técnico</h3>
                <p className="text-white text-[14px] leading-relaxed font-medium">
                  Expertos listos para resolver tus dudas técnicas y optimizar tu proyecto.
                </p>
              </div>
            </div>

            {/* Cobertura */}
            <div className="flex gap-5 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <MapPin size={22} className="text-[#3cf57c]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-[#3cf57c] mb-1">Cobertura Nacional</h3>
                <p className="text-white text-[14px] leading-relaxed font-medium">
                  4 sedes, un solo compromiso: estar donde nos necesitas.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Contacto mostrarBloqueProveedores={true} />
    </main>
  )
}

export default ContactoPage
