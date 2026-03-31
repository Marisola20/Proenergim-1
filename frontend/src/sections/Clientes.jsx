import { memo } from "react"
import { motion } from "framer-motion"

const clientes = [
  { nombre: "Agronegocios Génesis", logo: "/images/clientes/Agronegocios-genesis.webp" },
  { nombre: "BCP",                  logo: "/images/clientes/BCP.webp" },
  { nombre: "CAF",                  logo: "/images/clientes/CAF.webp" },
  { nombre: "Don Limones",          logo: "/images/clientes/Don-Limon.webp" },
  { nombre: "Interbank",            logo: "/images/clientes/Interbank.webp" },
  { nombre: "Mibanco",              logo: "/images/clientes/Mi-banco.webp" },
  { nombre: "Scotiabank",           logo: "/images/clientes/Scotiabank.webp" },
  { nombre: "SENATI",               logo: "/images/clientes/Senati.webp" },
  { nombre: "Grupo Arato",          logo: "/images/clientes/Arato.webp" },
  { nombre: "CIME Ingenieros",      logo: "/images/clientes/Cime-Ingenieros.webp" },
  { nombre: "Limones Piuranos",     logo: "/images/clientes/Limones-piuranos.webp" },
  { nombre: "Tomonorte",            logo: "/images/clientes/Tomonorte.webp" },
]

const ClienteItem = memo(({ cliente }) => (
  <div
    className="group bg-white rounded-2xl shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center justify-center hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 px-8"
    style={{ height: "110px" }}
  >
    <img
      src={cliente.logo}
      alt={cliente.nombre}
      loading="lazy"
      decoding="async"
      className="h-20 w-auto object-contain group-hover:grayscale-0 grayscale-[20%] transition-all duration-300"
      style={{
        filter: "grayscale(20%)",
        transform: cliente.nombre === "Don Limones" ? "scale(1.2)" : "scale(1)"
      }}
      onMouseEnter={e => (e.currentTarget.style.filter = "grayscale(0%)")}
      onMouseLeave={e => (e.currentTarget.style.filter = "grayscale(20%)")}
    />
  </div>
))

ClienteItem.displayName = "ClienteItem"

function CarruselFila({ items, velocidad = 30 }) {
  const duplicado = [...items, ...items]
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-5 w-max items-center"
        style={{ willChange: "transform" }}
        whileInView={{ x: ["0%", "-50%"] }}
        transition={{ duration: velocidad, repeat: Infinity, ease: "linear" }}
        viewport={{ once: false }}
      >
        {duplicado.map((cliente, i) => (
          <ClienteItem key={i} cliente={cliente} />
        ))}
      </motion.div>
    </div>
  )
}

function Clientes() {
  return (
    <section className="section-py" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] uppercase text-[10px] sm:text-xs mb-4 py-1.5 px-4 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10"
          >
            Confían en Nosotros
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-4xl font-black text-[var(--color-primary-dark)] mb-5 tracking-tight"
          >
            Nuestros{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">clientes</span>
          </motion.h2>
          <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
            Empresas e instituciones que confían en nuestra experiencia y soluciones energéticas
          </p>
        </motion.div>

        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-[#f8fafc] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none" />
          <CarruselFila items={clientes} velocidad={30} />
        </div>
      </div>
    </section>
  )
}

export default Clientes
