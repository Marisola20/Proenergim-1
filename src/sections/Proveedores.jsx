import { motion } from "framer-motion"

const proveedores = [
  { nombre: "ABB",                logo: "/images/proveedores/ABB.webp" },
  { nombre: "CEPER",              logo: "/images/proveedores/Ceper.webp" },
  { nombre: "Indeco",             logo: "/images/proveedores/INDECO.webp" },
  { nombre: "LD Solar",           logo: "/images/proveedores/LDSOLAR.webp" },
  { nombre: "Merlin Gerin",       logo: "/images/proveedores/Merlin-Gerin.webp" },
  { nombre: "Philips",            logo: "/images/proveedores/PHILIPS.webp" },
  { nombre: "Rittal",             logo: "/images/proveedores/RITTAL.webp" },
  { nombre: "Schneider Electric", logo: "/images/proveedores/Schneider-Electric.webp" },
  { nombre: "Trina Solar",        logo: "/images/proveedores/Trinasolar.webp" },
]

function CarruselFila({ items, velocidad = 30 }) {
  const duplicado = [...items, ...items, ...items]

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-5 w-max items-center"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: velocidad, repeat: Infinity, ease: "linear" }}
      >
        {duplicado.map((item, i) => (
          <div
            key={i}
            className="group bg-white rounded-2xl shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center justify-center hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300"
            style={{ width: "200px", height: "110px", padding: "18px 22px" }}
          >
            <img
              loading="lazy"
              src={item.logo}
              alt={`Logo de ${item.nombre}`}
              style={{
                width: "100%",
                height: "64px",
                objectFit: "contain",
                filter: "grayscale(20%)",
                transition: "filter 0.3s",
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = "grayscale(0%)")}
              onMouseLeave={e => (e.currentTarget.style.filter = "grayscale(20%)")}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Proveedores() {
  return (
    <section className="py-24" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] uppercase text-[10px] sm:text-xs mb-4 py-1.5 px-4 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10"
          >
            Trabajamos con los Mejores
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-primary-dark)] mb-5 tracking-tight"
          >
            Nuestros{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">proveedores</span>
          </motion.h2>
          <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Alianzas estratégicas con marcas líderes del mundo en paneles solares, variadores de frecuencia y electrobombas
          </p>
        </motion.div>

        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-[#f8fafc] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none" />
          <CarruselFila items={proveedores} velocidad={25} />
        </div>
      </div>
    </section>
  )
}

export default Proveedores
