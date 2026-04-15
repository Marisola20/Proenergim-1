import { useState } from "react"
import { motion } from "framer-motion"
import { Target, Heart, BadgeCheck, ClipboardCheck, HandshakeIcon, Lightbulb, TreePine, Briefcase, MapPin, Zap } from "lucide-react"
import HeroBanner from "../components/HeroBanner"
import Trayectoria from "../sections/Trayectoria"
import ActionSection from "../components/ActionSection"
import ImpactSection from "../components/ImpactSection"

const valores = [
  {
    icon: Heart,
    titulo: "Compromiso",
    texto: "Con el cliente, con el resultado y con el cuidado del medio ambiente en cada proyecto.",
    color: "#ef4444",
    bg: "#fef2f2",
  },
  {
    icon: BadgeCheck,
    titulo: "Calidad",
    texto: "Soluciones técnicas de alto nivel con materiales y marcas líderes del mercado.",
    color: "#eab308",
    bg: "#fefce8",
  },
  {
    icon: ClipboardCheck,
    titulo: "Responsabilidad",
    texto: "Cumplimos plazos, presupuestos y estándares de seguridad en cada instalación.",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
  {
    icon: TreePine,
    titulo: "Sostenibilidad",
    texto: "Promovemos el uso de energías limpias para un futuro más verde y eficiente.",
    color: "#10b981",
    bg: "#ecfdf5",
  },
  {
    icon: Lightbulb,
    titulo: "Innovación",
    texto: "Adoptamos tecnología de vanguardia en cada solución eléctrica y solar.",
    color: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    icon: HandshakeIcon,
    titulo: "Equipo",
    texto: "Un equipo multidisciplinario comprometido con el éxito de cada cliente.",
    color: "#f97316",
    bg: "#fff7ed",
  },
]

const equipo = [
  {
    nombre: "Equipo Técnico",
    rol: "Ingeniería e instalación",
    desc: "Profesionales especializados en sistemas solares, eléctricos e hidráulicos.",
    inicial: "T",
    color: "#0ea5e9",
  },
  {
    nombre: "Equipo Comercial",
    rol: "Asesoría y propuestas",
    desc: "Acompañamos al cliente desde la cotización hasta la ejecución del proyecto.",
    inicial: "C",
    color: "#f97316",
  },
  {
    nombre: "Gerencia",
    rol: "Dirección y estrategia",
    desc: "Liderazgo con más de 15 años de trayectoria en el sector energético peruano.",
    inicial: "G",
    color: "#8b5cf6",
  },
]

/* ── Tarjeta con efecto flip ── */
function FlipCard({ v, i }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: i * 0.08 }}
      style={{ perspective: "1000px", height: "220px" }}
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      className="cursor-pointer"
    >
      {/* Contenedor giratorio */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── FRENTE: Icono + Título centrado ── */}
        <div
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderColor: v.color + "4d" }}
          className="absolute inset-0 bg-white border-2 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center gap-4 p-6"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: v.bg }}
          >
            <v.icon size={30} style={{ color: v.color }} strokeWidth={2.2} />
          </div>
          <h3 className="font-black text-[var(--color-primary-dark)] text-xl tracking-tight text-center">
            {v.titulo}
          </h3>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: v.color }}>
            Toca para saber más →
          </span>
        </div>

        {/* ── DETRÁS: Icono pequeño + Descripción ── */}
        <div
          className="absolute inset-0 rounded-2xl shadow-[0_8px_30px_-6px_rgba(0,0,0,0.18)] flex flex-col items-center justify-center gap-4 p-7 text-center overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* fondo degradado */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ background: `linear-gradient(135deg, ${v.color}f0, ${v.color}cc)` }}
          />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
              <v.icon size={22} style={{ color: "#fff" }} strokeWidth={2.2} />
            </div>
            <h3 className="font-black text-white text-base tracking-tight">{v.titulo}</h3>
            <p className="text-white/90 text-sm leading-relaxed">{v.texto}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Nosotros() {
  return (
    <main className="pb-24 bg-white">
      <HeroBanner
        subtitle="Cultura empresarial"
        title="Sobre"
        highlight="nosotros"
        description="Conoce el enfoque que guía cada proyecto."
        patternId="nosotros"
      />

      {/* ── SECCIÓN DE PROPÓSITO ÚNICO (LA GRAN PROMESA) ── */}
      <ImpactSection
        wideRight
        title={<>Juntos</>}
        highlight="Crecemos."
        points={[
          {
            icon: Target,
            label: "Misión",
            text: "Diseñamos y construimos sistemas solares para tu negocio, impulsando el desarrollo sostenible de cada comunidad.",
            color: "#7ad7ff"
          },
          {
            icon: Zap,
            label: "Visión",
            text: "Al 2028, ser la mejor alternativa en calidad y garantía para proyectos fotovoltaicos en todos los sectores productivos del país.",
            color: "#3cf57c"
          }
        ]}
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Título de la sección de valores para separar contenido */}
        <div className="text-center mb-12">
          <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] text-[10px] sm:text-xs mb-4 py-1.5 px-4 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10"
            >
              Lo que nos mueve
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-black text-[var(--color-primary-dark)] tracking-tight opacity-50"
            >
              Nuestro 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]"> ADN</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm sm:text-base md:text-lg mt-4 text-gray-600 max-w-3xl mx-auto"
            >
              Cada proyecto lleva nuestra firma — y nuestra firma tiene estos principios.
            </motion.p>
        </div>
        <section className="mb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {valores.map((v, i) => (
              <FlipCard key={i} v={v} i={i} />
            ))}
          </div>
        </section>

      </div>

      {/* ── TRAYECTORIA ── */}
      <Trayectoria />

      <div className="max-w-7xl mx-auto px-6">

        {/* ── EQUIPO ── */}
        <section className="mb-24 mt-8">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] uppercase text-[10px] sm:text-xs mb-4 py-1.5 px-4 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10"
            >
              Quiénes somos
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-primary-dark)] mb-4 tracking-tight"
            >
              Nuestro{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">equipo</span>
            </motion.h2>
            <p className="text-[var(--color-text-muted)] text-sm sm:text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
              Profesionales apasionados por la energía solar que trabajan cada día para ti.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {equipo.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border-2 border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/50 rounded-2xl overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.13)] hover:-translate-y-1 transition-all duration-300 text-center"
              >
                {/* Slot de foto */}
                <div
                  className="w-full h-48 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${e.color}18, ${e.color}08)` }}
                >
                  {e.foto ? (
                    <img
                      loading="lazy"
                      src={e.foto}
                      alt={e.nombre}
                      decoding="async"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <div
                        className="w-20 h-20 rounded-full border-4 border-white shadow-md flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${e.color}cc, ${e.color})` }}
                      >
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40" style={{ color: e.color }}>
                        Foto próximamente
                      </span>
                    </>
                  )}
                </div>
                {/* Info */}
                <div className="p-6">
                  <h3 className="font-bold text-[var(--color-primary-dark)] text-lg mb-1">{e.nombre}</h3>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: e.color }}
                  >{e.rol}</p>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── TRABAJA CON NOSOTROS ── */}
        <div className="mt-20">
          <ActionSection
            icon={<Briefcase size={28} className="text-[#fcd34d]" />}
            title={({ accentFrom, accentTo }) => (
              <>¿Te apasiona el <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${accentFrom}, ${accentTo})` }}>futuro limpio</span>?</>
            )}
            description="Únete al equipo Proenergim. Buscamos personas comprometidas con el impacto ambiental y las energías renovables."
            buttonLabel="Postúlate por WhatsApp"
            buttonHref="https://wa.me/51936954890?text=Hola, me gustaría postularme a trabajar con ustedes"
            buttonEffect="magnetic"
            accentFrom="#38bdf8"
            accentTo="#1ed760"
          />
        </div>

      </div>
    </main>
  )
}

export default Nosotros
