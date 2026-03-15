import { motion } from "framer-motion"

const clientes = [
  "Pequeños Agricultores",
  "Limones Piuranos S.A.C.",
  "Grupo Arato",
  "SENATI",
  "CIME Ingenieros",
  "Tgestiona",
  "CAF",
  "Telefónica",
]

const proveedores = [
  "Trina Solar",
  "Pedrollo",
  "Franklin Electric",
  "Siemens",
  "ABB",
  "Schneider Electric",
  "Philips",
  "3M",
  "INDECO",
  "BTicino",
  "RITAR",
  "LD Solar",
]

function CarruselFila({ items, velocidad = 30, inverso = false }) {
  const duplicado = [...items, ...items]

  return (
    <div className="overflow-hidden relative">
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: inverso ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration: velocidad,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicado.map((item, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-xl px-6 py-4 shadow-sm whitespace-nowrap min-w-[160px] text-center"
          >
            <span className="text-[var(--color-primary-dark)] font-semibold text-sm">{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function ClientesProveedores() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Clientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <span className="inline-block bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
              Confían en nosotros
            </span>
            <h2 className="text-3xl font-bold text-[var(--color-primary-dark)]">
              Nuestros clientes
            </h2>
          </div>
          <CarruselFila items={clientes} velocidad={25} />
        </motion.div>

        {/* Divisor */}
        <div className="border-t border-gray-100 mb-16" />

        {/* Proveedores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <span className="inline-block bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
              Trabajamos con los mejores
            </span>
            <h2 className="text-3xl font-bold text-[var(--color-primary-dark)]">
              Nuestros proveedores
            </h2>
          </div>
          <CarruselFila items={proveedores} velocidad={20} inverso={true} />
        </motion.div>

      </div>
    </section>
  )
}

export default ClientesProveedores