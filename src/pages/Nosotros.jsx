import { motion } from "framer-motion"
import { Users, Heart, Award, Building2, Briefcase } from "lucide-react"

const valores = [
  { icon: Heart, titulo: "Compromiso", texto: "Con el cliente y con el medio ambiente." },
  { icon: Award, titulo: "Calidad", texto: "Soluciones técnicas de alto nivel." },
  { icon: Building2, titulo: "Trayectoria", texto: "Más de 15 años en el sector." },
]

const equipo = [
  { nombre: "Equipo técnico", rol: "Ingeniería e instalación" },
  { nombre: "Equipo comercial", rol: "Asesoría y propuestas" },
  { nombre: "Gerencia", rol: "Dirección y estrategia" },
]

const NosotrosIconPattern = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.2]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="nosotros-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
        {/* Heart Icon */}
        <g transform="translate(38, 13) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </g>
        {/* Users Icon */}
        <g transform="translate(138, 13) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </g>
        {/* Building Icon (Staggered row) */}
        <g transform="translate(88, 63) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
           <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
           <path d="M9 22v-4h6v4 M8 6h.01 M16 6h.01 M12 6h.01 M12 10h.01 M12 14h.01 M16 10h.01 M16 14h.01 M8 10h.01 M8 14h.01"/>
        </g>
        {/* Target/Goal Icon (Staggered row) */}
        <g transform="translate(188, 63) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </g>
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#nosotros-pattern)" />
  </svg>
)

function Nosotros() {
  return (
    <main className="pb-20">
      {/* ENCABEZADO */}
      <div className="relative bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] pt-28 pb-20 px-6 text-center text-white overflow-hidden shadow-inner mb-16">
        <NosotrosIconPattern />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-4"
          >
            Conoce a PROENERGIM
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/90 drop-shadow-sm font-medium max-w-2xl mx-auto text-lg"
          >
            Empresa peruana especializada en energía solar. Equipo, valores y sedes en todo el país.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        <section className="flex justify-center mb-20">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
            {valores.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--color-bg-soft)] rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-white/90 border border-[var(--color-primary)]/20 shadow-sm flex items-center justify-center mx-auto mb-4">
                  <v.icon size={26} className="text-[var(--color-primary-dark)]" />
                </div>
                <h3 className="font-bold text-[var(--color-primary-dark)] text-lg mb-2">{v.titulo}</h3>
                <p className="text-[var(--color-text-muted)] text-sm">{v.texto}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-6 flex items-center gap-2">
            <Users size={28} /> Equipo
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {equipo.map((e, i) => (
              <div key={i} className="bg-white border border-[var(--color-primary)]/10 rounded-xl p-5">
                <p className="font-semibold text-[var(--color-primary-dark)]">{e.nombre}</p>
                <p className="text-[var(--color-text-muted)] text-sm">{e.rol}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-4">Empresas asociadas y clientes</h2>
          <p className="text-[var(--color-text-muted)] text-sm mb-6">
            Trabajamos con pequeños agricultores, empresas y organismos en todo el Perú.
          </p>
          <div className="bg-[var(--color-bg-soft)] rounded-2xl p-8 text-center">
            <p className="text-[var(--color-text-muted)] text-sm">Incluir logos de clientes y aliados aquí.</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--color-primary-dark)] rounded-2xl p-8 md:p-10 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <Briefcase size={28} /> Trabaja con nosotros
          </h2>
          <p className="text-white/80 text-sm mb-6 max-w-lg mx-auto">
            Si quieres formar parte del equipo, envíanos tu CV y cuéntanos por qué te interesa la energía solar.
          </p>
          <a
            href="https://wa.me/51971812567?text=Hola, me gustaría postularme a trabajar con ustedes"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-white font-bold px-6 py-3 rounded-full transition-all duration-200"
          >
            Postúlate
          </a>
        </motion.section>
      </div>
    </main>
  )
}

export default Nosotros
