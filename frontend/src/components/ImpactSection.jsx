import { motion } from "framer-motion";

/**
 * ImpactSection component
 * Standardized L/R layout for the "Impact/Purpose" sections.
 * 
 * @param {string|React.Node} title - The main text on the left side.
 * @param {React.Node} highlight - Optional highlighted text/gradient.
 * @param {Array} points - Array of { icon: Icon, label: string, text: string, color: string }
 */
export default function ImpactSection({ title, highlight, points = [] }) {
  return (
    <section className="relative z-30 -mt-16 sm:-mt-24 px-6 mb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl rounded-4xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] border border-[var(--color-primary-light)] overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Lado Izquierdo: El Gancho Visual/Texto */}
        <div className="lg:w-2/5 p-8 sm:p-10 md:p-14 flex flex-col justify-center bg-gradient-to-br from-white/40 to-transparent">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-[var(--color-primary-dark)]">
            {title}
            {highlight && (
              <>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">
                  {highlight}
                </span>
              </>
            )}
          </h2>
        </div>

        {/* Lado Derecho: Puntos clave (Misión/Visión/Características) */}
        <div className="lg:w-3/5 p-10 md:p-14 bg-[var(--color-primary-dark)] text-white flex flex-col justify-center gap-8 relative overflow-hidden">
          {/* Círculos decorativos */}
          <div className="absolute top-[-20px] right-[10%] w-24 h-24 bg-white/[0.03] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10px] left-[15%] w-20 h-20 bg-white/[0.04] rounded-full pointer-events-none" />
          <div className="absolute top-[40%] right-[5%] w-16 h-16 bg-white/[0.02] rounded-full blur-md pointer-events-none" />
          <div className="absolute bottom-[20%] left-[5%] w-12 h-12 bg-white/[0.05] rounded-full pointer-events-none" />

          {points.map((p, idx) => (
            <div key={idx} className="flex gap-5 relative z-10">
              <div 
                className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20"
                style={{ borderColor: `${p.color}40` }}
              >
                <p.icon size={22} style={{ color: p.color }} />
              </div>
              <div className="flex flex-col">
                <h3 
                  className="font-black uppercase text-[11px] sm:text-xs tracking-[0.2em] mb-1"
                  style={{ color: p.color }}
                >
                  {p.label}
                </h3>
                <p className="text-white text-base leading-relaxed font-medium">
                  {p.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
