import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { servicios } from "../data/servicios"
import { HelpCircle, MessageCircle, ShieldCheck, Zap, HeartHandshake, TrendingDown } from "lucide-react"
import HeroBanner from "../components/HeroBanner"

const WHATSAPP = "51936954890"

const faqs = [
  {
    p: "¿Cuánto cuesta un sistema solar?",
    r: "Depende del consumo y tipo de proyecto. Te enviamos una propuesta personalizada y sin compromiso.",
  },
  {
    p: "¿Dan mantenimiento?",
    r: "Sí. Ofrecemos mantenimiento preventivo y correctivo de sistemas e instalaciones eléctricas y solares.",
  },
  {
    p: "¿Trabajan en todo el Perú?",
    r: "Sí. Tenemos sedes en Lima, Trujillo, Piura y Selva Sur, y atendemos proyectos en todo el país.",
  },
  {
    p: "¿Qué sectores atienden?",
    r: "Agricultura, industria, comercio, hogares y proyectos de agua potable y riego tecnificado.",
  },
  {
    p: "¿Ofrecen financiamiento?",
    r: "Te asesoramos en las opciones disponibles según tu proyecto y necesidades de inversión.",
  },
  {
    p: "¿Cuánto dura una instalación?",
    r: "Varía según el tamaño del proyecto; desde pocos días para instalaciones pequeñas hasta algunas semanas para grandes sistemas.",
  },
]

const beneficios = [
  {
    icon: TrendingDown,
    titulo: "Ahorro Inmediato",
    desc: "Reduce hasta el 90% de tu factura eléctrica.",
    color: "#22c55e"
  },
  {
    icon: ShieldCheck,
    titulo: "Garantía Real",
    desc: "Equipos con certificación internacional.",
    color: "#0ea5e1"
  },
  {
    icon: HeartHandshake,
    titulo: "Soporte 24/7",
    desc: "Asistencia técnica personalizada siempre.",
    color: "#f59e0b"
  },
  {
    icon: Zap,
    titulo: "Autonomía Total",
    desc: "Energía ininterrumpida para tu hogar.",
    color: "#8b5cf6"
  }
]

function FAQItem({ faq, i, abierto, setAbierto }) {
  const isOpen = abierto === i
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06 }}
      className={`group rounded-2xl border transition-all duration-500 overflow-hidden ${
        isOpen
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-xl"
          : "border-slate-100 bg-white hover:border-slate-300"
      }`}
    >
      <button
        type="button"
        onClick={() => setAbierto(isOpen ? null : i)}
        className="w-full relative flex items-center justify-between px-8 py-6 text-left gap-5 outline-none"
      >
        {/* Acento lateral */}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full transition-all duration-300 ${isOpen ? "bg-[var(--color-primary)]" : "bg-slate-200 group-hover:bg-slate-300"}`} />
        
        <span className={`flex items-center gap-4 font-bold transition-colors duration-300 text-sm sm:text-base md:text-lg tracking-tight ${isOpen ? "text-[var(--color-primary-dark)]" : "text-slate-700"}`}>
          <div className={`p-2 rounded-xl transition-all border ${isOpen ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
            <HelpCircle size={18} strokeWidth={2.5} />
          </div>
          {faq.p}
        </span>
        
        <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
          isOpen ? "bg-[var(--color-primary)] text-white rotate-180" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
        }`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "circOut" }}
          >
            <div className="px-8 pb-8 pl-[4.5rem]">
               <div className="h-px w-full bg-[var(--color-primary)]/10 mb-6" />
               <p className="text-[var(--color-text-muted)] text-sm md:text-base leading-relaxed font-medium">
                {faq.r}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Soluciones() {
  const [faqAbierto, setFaqAbierto] = useState(null)

  return (
    <main className="pb-24 bg-white">
      <HeroBanner
        subtitle="Lo que ofrecemos"
        title="Servicios"
        highlight="especializados"
        description="Implementación de sistemas solares confiables."
        patternId="soluciones"
      />
      {/* ── SECCIÓN DE BENEFICIOS PREMIUM ── */}
      <section className="relative z-30 -mt-24 px-6 mb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {beneficios.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5, delay: i * 0.1 } // Entrada con delay solo aquí
              }}
              whileHover={{ 
                borderColor: `${b.color}00`, 
                y: -10,
                transition: { duration: 0.1 } // Subida rápida
              }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.2, // Bajada rápida (por defecto)
                type: "spring", 
                damping: 25 
              }}
              className="group relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border-2 flex flex-col items-center text-center gap-5 transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] overflow-hidden"
              style={{ borderColor: `${b.color}60` }} // Borde de color inicial bien visible
            >
              {/* Brillo de fondo al hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${b.color}10, transparent 70%)` }}
              />

              <div
                className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10"
                style={{ 
                  backgroundColor: `${b.color}15`,
                  boxShadow: `inset 0 0 20px ${b.color}10`
                }}
              >
                <b.icon size={28} style={{ color: b.color }} strokeWidth={2.2} />
              </div>

              <div className="flex flex-col gap-2 relative z-10">
                <h3 className="font-black text-[var(--color-primary-dark)] text-base tracking-tight leading-none">
                  {b.titulo}
                </h3>
                <p className="text-[var(--color-text-muted)] text-[13px] font-semibold leading-relaxed px-2">
                  {b.desc}
                </p>
              </div>

              {/* Indicador de acento inferior */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 rounded-full transition-all duration-200 group-hover:w-24"
                style={{ backgroundColor: b.color }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* ── SERVICIOS ── */}
        <section className="mb-28">
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] uppercase text-[10px] sm:text-xs mb-4 py-1.5 px-4 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10"
            >
            Enfoque técnico
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-primary-dark)] mb-5 tracking-tight"
            >
              Nuestra{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">Especialidad</span>
            </motion.h2>
            <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Soluciones que optimizan el rendimiento y reducen costos operativos. 
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {servicios.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group bg-white border-2 hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all duration-400 rounded-3xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.07)]"
                style={{ borderColor: s.iconBg + "40" }}
              >
                {/* Imagen */}
                <div className="h-52 w-full overflow-hidden relative">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={s.imagen}
                    alt={s.nombre}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay degradado sobre imagen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  {/* Badge del icono flotante */}
                  <div
                    className="absolute top-4 left-4 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/60"
                    style={{ backgroundColor: s.iconBg }}
                  >
                    <s.icon size={20} color="white" strokeWidth={2.2} />
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h3 className="font-black text-[var(--color-primary-dark)] text-xl mb-2 tracking-tight">
                    {s.nombre}
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-5">
                    {s.descripcion}
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=Hola, me interesa saber más sobre: ${s.nombre}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:gap-2.5"
                    style={{ color: s.iconBg }}
                  >
                    Solicitar información
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-28">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-[var(--color-primary)] font-black tracking-[0.3em] text-[10px] sm:text-xs mb-6 py-2 px-6 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10 mx-auto group hover:bg-[var(--color-primary)]/10 transition-colors cursor-default"
            >
              FAQ
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--color-primary-dark)] mb-6 tracking-tight leading-[1.1]"
            >
              Preguntas{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] px-2">Frecuentes</span>
            </motion.h2>
            <p className="text-[var(--color-text-muted)] text-base md:text-lg lg:text-xl max-w-3xl mx-auto font-medium leading-relaxed opacity-80">
              Todo lo que necesitas saber antes de dar el primer paso hacia la energía solar.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                i={i}
                abierto={faqAbierto}
                setAbierto={setFaqAbierto}
              />
            ))}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-[var(--color-primary-dark)] text-white text-center p-12 md:p-16"
        >
          {/* Decoración */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#fcd34d]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 tracking-tight">
              Da el paso a la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#1ed760]">energía solar</span>
            </h2>
            <p className="text-white/80 text-base md:text-lg font-medium mb-8 max-w-lg mx-auto leading-relaxed">
              Cotiza gratis y recibe una propuesta a medida para tu empresa, fundo o comunidad.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hola, me interesa conocer más sobre sus soluciones solares`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BE5C] text-white font-black px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <MessageCircle size={20} />
              Hablar con un experto
            </a>
          </div>
        </motion.section>

      </div>
    </main>
  )
}

export default Soluciones
