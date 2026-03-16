import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { servicios } from "../data/servicios"
import { MessageCircle, HelpCircle, Plus, Minus } from "lucide-react"

const WHATSAPP = "51971812567"
const faqs = [
  { p: "¿Cuánto cuesta un sistema solar?", r: "Depende del consumo y tipo de proyecto. Te enviamos una propuesta sin compromiso." },
  { p: "¿Dan mantenimiento?", r: "Sí. Ofrecemos mantenimiento preventivo y correctivo de sistemas e instalaciones." },
  { p: "¿Trabajan en todo el Perú?", r: "Sí. Tenemos sedes en Lima, Trujillo, Piura y Selva Sur." },
  { p: "¿Qué sectores atienden?", r: "Agricultura, industria, comercio, hogares y proyectos de agua potable." },
  { p: "¿Ofrecen financiamiento?", r: "Te asesoramos en las opciones disponibles según tu proyecto." },
  { p: "¿Cuánto dura una instalación?", r: "Varía según el tamaño del proyecto; desde días hasta algunas semanas." },
]

const SolucionesIconPattern = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.2]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="soluciones-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
        {/* Sun Icon */}
        <g transform="translate(38, 13) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </g>
        {/* Lightning Icon */}
        <g transform="translate(138, 13) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </g>
        {/* Leaf Icon (Staggered row) */}
        <g transform="translate(88, 63) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
           <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
           <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </g>
        {/* Battery Icon (Staggered row) */}
        <g transform="translate(188, 63) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
          <line x1="22" y1="11" x2="22" y2="13" />
        </g>
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#soluciones-pattern)" />
  </svg>
)

function Soluciones() {
  const [faqAbierto, setFaqAbierto] = useState(null)

  return (
    <main className="pb-20">
      {/* ENCABEZADO */}
      <div className="relative bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] pt-28 pb-20 px-6 text-center text-white overflow-hidden shadow-inner mb-16">
        <SolucionesIconPattern />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-4"
          >
            Soluciones de energía solar para un futuro sostenible
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/90 drop-shadow-sm font-medium max-w-2xl mx-auto text-lg"
          >
            Categorías y beneficios para agricultura, industria y comercio.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {servicios.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-[var(--color-primary)]/10 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-40 w-full overflow-hidden bg-[var(--color-primary)]/10">
                <img src={s.imagen} alt={s.nombre} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/15 flex items-center justify-center mb-3">
                  <s.icon size={20} className="text-[var(--color-primary-dark)]" />
                </div>
                <h3 className="font-bold text-[var(--color-primary-dark)] text-lg mb-2">{s.nombre}</h3>
                <p className="text-[var(--color-text-muted)] text-sm">{s.descripcion}</p>
              </div>
            </motion.div>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 flex flex-col items-center"
        >
          <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-6 flex items-center gap-2">
            <HelpCircle size={26} /> Preguntas frecuentes
          </h2>
          <div className="space-y-3 w-full max-w-2xl">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-[var(--color-bg-soft)] rounded-xl overflow-hidden border border-[var(--color-primary)]/10"
              >
                <button
                  type="button"
                  onClick={() => setFaqAbierto(faqAbierto === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-[var(--color-primary-dark)] text-sm pr-4">{faq.p}</span>
                  <span className="text-[var(--color-primary-dark)] shrink-0">
                    {faqAbierto === i ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                <AnimatePresence>
                  {faqAbierto === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 pt-0 text-[var(--color-text-muted)] text-sm">{faq.r}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--color-primary-dark)] rounded-2xl p-8 md:p-10 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-2">¿Necesitas asesoría?</h2>
          <p className="text-white/80 text-sm mb-6">Habla con nuestro experto por WhatsApp.</p>
          <a
            href={`https://wa.me/${WHATSAPP}?text=Hola, necesito hablar con un experto en energía solar`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 bg-[var(--whatsapp)] hover:bg-green-500 text-white font-bold px-6 py-3 rounded-full transition-all duration-200"
          >
            <MessageCircle size={22} />
            Habla con nuestro experto
          </a>
        </motion.section>
      </div>
    </main>
  )
}

export default Soluciones
