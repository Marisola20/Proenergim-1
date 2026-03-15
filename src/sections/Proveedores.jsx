import { motion } from "framer-motion"

const proveedores = [
  { nombre: "ABB", src: "/images/proveedores/ABB.webp" },
  { nombre: "CEPER", src: "/images/proveedores/CEPER.webp" },
  { nombre: "Indeco", src: "/images/proveedores/Indeco.webp" },
  { nombre: "LD Solar", src: "/images/proveedores/LD solar.webp" },
  { nombre: "Merlin Gerin", src: "/images/proveedores/Merlin_Gerin.webp" },
  { nombre: "Philips", src: "/images/proveedores/Philips_logo.webp" },
  { nombre: "Rittal", src: "/images/proveedores/Rittal.webp" },
  { nombre: "Schneider Electric", src: "/images/proveedores/Schneider electric.webp" },
  { nombre: "Trina Solar", src: "/images/proveedores/Trinasolar.webp" },
]

function CarruselFila({ items, velocidad = 30 }) {
  const duplicado = [...items, ...items, ...items] // Triplicar para animación suave

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-6 w-max items-center"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: velocidad, repeat: Infinity, ease: "linear" }}
      >
        {duplicado.map((item, i) => (
          <div
            key={i}
            className="group relative bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md min-w-[140px] h-[80px] flex items-center justify-center transition-all duration-300 overflow-hidden"
          >
            <img
              src={item.src}
              alt={`Logo de ${item.nombre}`}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Proveedores() {
  return (
    <section className="bg-[var(--color-bg-soft)] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold text-[var(--color-primary-dark)]">
            Nuestros Proveedores
          </h2>
          <p className="text-[var(--color-text-muted)] mt-2 max-w-2xl mx-auto">
            Trabajamos con marcas del Top 10 del mundo, en paneles solares, variadores de frecuencia y electrobombas.
          </p>
        </motion.div>

        {/* Usamos un wrapper con fade en los bordes para el carrusel */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[var(--color-bg-soft)] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--color-bg-soft)] to-transparent z-10"></div>
          <CarruselFila items={proveedores} velocidad={25} />
        </div>
      </div>
    </section>
  )
}

export default Proveedores
