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

function Nosotros() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary-dark)] mb-4">
            Conoce a PROENERGIM
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Empresa peruana especializada en energía solar. Equipo, valores y sedes en todo el país.
          </p>
        </motion.section>

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
