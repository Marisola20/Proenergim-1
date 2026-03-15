import { motion } from "framer-motion"

const clientes = [
  { nombre: "Agronegocios Génesis", logo: "/images/clientes/Agronegocios genesis.webp" },
  { nombre: "BCP",                  logo: "/images/clientes/BCP.webp" },
  { nombre: "CAF",                  logo: "/images/clientes/CAF.webp" },
  { nombre: "Don Limones",          logo: "/images/clientes/Don limones.webp" },
  { nombre: "Interbank",            logo: "/images/clientes/Interbank.webp" },
  { nombre: "Mibanco",              logo: "/images/clientes/Mibanco.webp" },
  { nombre: "Scotiabank",           logo: "/images/clientes/Scotiabank.webp" },
  { nombre: "SENATI",               logo: "/images/clientes/Senati.webp" },
  { nombre: "Grupo Arato",          logo: "/images/clientes/arato.webp" },
  { nombre: "CIME Ingenieros",      logo: "/images/clientes/cime-ingenieros.webp" },
  { nombre: "Limones Piuranos",     logo: "/images/clientes/limones piuranos.webp" },
  { nombre: "Tomonorte",            logo: "/images/clientes/tomonorte.webp" },
]

function CarruselFila({ items, velocidad = 30 }) {
  const duplicado = [...items, ...items]
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: velocidad, repeat: Infinity, ease: "linear" }}
      >
        {duplicado.map((cliente, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center w-40 h-20 hover:shadow-md transition-shadow duration-200 p-3"
          >
            <img
              src={cliente.logo}
              alt={cliente.nombre}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Clientes() {
  return (
    <section className="bg-[var(--color-bg-soft)] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-[var(--color-primary-dark)]">
            Nuestros clientes
          </h2>
          <p className="text-[var(--color-text-muted)] mt-2 text-sm">
            Empresas e instituciones que confían en nuestra experiencia
          </p>
        </motion.div>
        <CarruselFila items={clientes} velocidad={28} />
      </div>
    </section>
  )
}

export default Clientes
