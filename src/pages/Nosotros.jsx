import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Award, Target, Users, Zap, TreePine, Briefcase } from "lucide-react"
import HeroBanner from "../components/HeroBanner"
import Trayectoria from "../sections/Trayectoria"

const valores = [
  {
    icon: Heart,
    titulo: "Compromiso",
    texto: "Con el cliente, con el resultado y con el cuidado del medio ambiente en cada proyecto.",
    color: "#ef4444",
    bg: "#fef2f2",
  },
  {
    icon: Award,
    titulo: "Calidad",
    texto: "Soluciones técnicas de alto nivel con materiales y marcas líderes del mercado.",
    color: "#eab308",
    bg: "#fefce8",
  },
  {
    icon: Target,
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
    icon: Zap,
    titulo: "Innovación",
    texto: "Adoptamos tecnología de vanguardia en cada solución eléctrica y solar.",
    color: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    icon: Users,
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
      viewport={{ once: true }}
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
        title="Conoce a PROENERGIM"
        description="Empresa peruana especializada en energía solar. Equipo, valores y sedes en todo el Perú."
        patternId="nosotros"
      />

      <div className="max-w-7xl mx-auto px-6">

        {/* ── VALORES ── */}
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
            <p className="text-[var(--color-text-muted)] text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
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
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-white text-center bg-[var(--color-primary-dark)]"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <Briefcase size={28} className="text-[#fcd34d]" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 tracking-tight">
              ¿Te apasiona el{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fcd34d] to-[#fb923c]">futuro limpio</span>?
            </h2>
            <p className="text-white/90 text-base md:text-lg font-medium mb-8 max-w-lg mx-auto leading-relaxed">
              Únete al equipo Proenergim. Buscamos personas comprometidas con el impacto ambiental y las energías renovables.
            </p>
            <a
              href="https://wa.me/51971812567?text=Hola, me gustaría postularme a trabajar con ustedes"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-black px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-white bg-[#25D366] hover:bg-[#20BE5C]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Postúlate por WhatsApp
            </a>
          </div>
        </motion.section>

      </div>
    </main>
  )
}

export default Nosotros
