import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Briefcase, Award, Package, MessageCircle } from "lucide-react"

const WHATSAPP = "51971812567"

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let animationFrame
    const startTime = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const current = Math.round(progress * target)
      setValue(current)
      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick)
      }
    }

    animationFrame = requestAnimationFrame(tick)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [target, duration])

  return value
}

function Hero() {
  const proyectos = useCountUp(200, 1300)
  const anos = useCountUp(15, 1500)
  const sedes = useCountUp(4, 1700)

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-24 md:pt-28">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        preload="metadata"
        style={{ willChange: "transform" }}
      >
        <source src="/videos/presentacion.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/20 z-10" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--color-accent-light)]/50 via-transparent to-transparent pointer-events-none" aria-hidden />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" aria-hidden />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Soluciones de{" "}
              <span className="text-[var(--color-green)]">energía solar</span>
              <br />
              que transforman la comunidad y sus hogares
            </h1>

            <p className="text-white/95 text-base sm:text-lg md:text-xl mb-6 max-w-xl mx-auto">
              Más de 15 años desarrollando proyectos de energía renovable en todo el Perú.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10"
            >
              {/* Botón primario — gradiente */}
              <a
                href="/#proyectos"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] hover:brightness-110 text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(30,215,96,0.3)] hover:shadow-[0_0_30px_rgba(30,215,96,0.5)] hover:scale-[1.04] text-sm sm:text-base"
              >
                <Package size={20} />
                Ver proyectos
              </a>
              {/* Botón secundario */}
              <a
                href={`https://wa.me/${WHATSAPP}?text=Hola, me gustaría contactarlos para conocer más sobre sus servicios de energía solar`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border-2 border-white/80 hover:border-white text-white hover:bg-white/10 font-semibold px-6 sm:px-8 py-3 sm:py-3 rounded-full transition-all duration-200 hover:scale-[1.04] text-sm sm:text-base"
              >
                <MessageCircle size={20} />
                Contáctanos
              </a>
            </motion.div>

            {/* Estadísticas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-2 flex flex-col sm:flex-row justify-center items-stretch gap-3 sm:gap-4 md:gap-6 w-full max-w-4xl mx-auto"
            >
              <div className="flex-1 flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-lg border border-white/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-green)] flex items-center justify-center shrink-0 shadow-md">
                  <Briefcase size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-xl sm:text-2xl md:text-3xl drop-shadow">
                    +{proyectos}
                  </div>
                  <div className="text-white/75 text-xs sm:text-sm font-medium">proyectos</div>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-lg border border-white/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-green)] flex items-center justify-center shrink-0 shadow-md">
                  <Award size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-xl sm:text-2xl md:text-3xl drop-shadow">
                    +{anos}
                  </div>
                  <div className="text-white/75 text-xs sm:text-sm font-medium">años de experiencia</div>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-lg border border-white/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-green)] flex items-center justify-center shrink-0 shadow-md">
                  <MapPin size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-xl sm:text-2xl md:text-3xl drop-shadow">
                    +{sedes}
                  </div>
                  <div className="text-white/75 text-xs sm:text-sm font-medium">sedes / regiones</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
