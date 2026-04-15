import { motion } from "framer-motion";
 
/**
 * ImpactSection component
 * Standardized L/R layout for the "Impact/Purpose" sections.
 * 
 * @param {string|React.Node} title - The main text on the left side.
 * @param {React.Node} highlight - Optional highlighted text/gradient.
 * @param {Array} points - Array of { icon: Icon, label: string, text: string, color: string }
 */
export default function ImpactSection({ title, highlight, points = [], wideRight = false, bgColor = "" }) {
  return (
    <section className={`relative z-30 -mt-24 sm:-mt-24 lg:-mt-28 px-4 sm:px-6 mb-16 sm:mb-18 lg:mb-20 ${bgColor}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl rounded-4xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] border border-[var(--color-primary-light)] overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Lado Izquierdo: El Gancho Visual/Texto */}
        <div className={`${wideRight ? 'lg:w-1/3' : 'lg:w-2/5'} p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white/40 to-transparent`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-black tracking-tight leading-tight text-[var(--color-primary-dark)]">
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
        <div className={`${wideRight ? 'lg:w-2/3' : 'lg:w-3/5'} p-8 sm:p-10 lg:p-12 bg-[var(--color-primary-dark)] text-white flex flex-col justify-center gap-6 sm:gap-8 relative overflow-hidden`}>
          {/* Círculos decorativos */}
          <div className="absolute top-[-20px] right-[10%] w-24 h-24 bg-white/[0.03] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10px] left-[15%] w-20 h-20 bg-white/[0.04] rounded-full pointer-events-none" />
          <div className="absolute top-[40%] right-[5%] w-16 h-16 bg-white/[0.02] rounded-full blur-md pointer-events-none" />
          <div className="absolute bottom-[20%] left-[5%] w-12 h-12 bg-white/[0.05] rounded-full pointer-events-none" />
 
          {points.map((p, idx) => (
            <div key={idx} className="flex gap-5 relative z-10">
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20"
                style={{ borderColor: `${p.color}40` }}
              >
                <p.icon size={22} style={{ color: p.color }} />
              </div>
              <div className="flex flex-col">
                <h3
                  className="font-black uppercase text-[11px] sm:text-xs lg:text-sm tracking-[0.2em] mb-1"
                  style={{ color: p.color }}
                >
                  {p.label}
                </h3>
                <p title={p.text} className="text-white/90 text-xs sm:text-sm lg:text-base leading-relaxed font-medium line-clamp-3 sm:line-clamp-4 lg:line-clamp-none">
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