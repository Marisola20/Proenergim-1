import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { MapPin, Briefcase, Award, Package, MessageCircle } from "lucide-react"

const WHATSAPP = "51936954890"

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
  const videoRef = useRef(null)

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        videoRef.current?.pause()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting && !document.hidden) {
            videoRef.current.play().catch(() => {})
          } else {
            videoRef.current.pause()
          }
        }
      },
      { threshold: 0.1 }
    )

    if (videoRef.current) observer.observe(videoRef.current)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      observer.disconnect()
    }
  }, [])

  return (
    <section id="inicio" className="relative min-h-[100dvh] flex items-center overflow-hidden pt-24 md:pt-28">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        preload="metadata"
        fetchPriority="high"
        style={{ opacity: 0.95 }}
      >
        <source src="/videos/video-hero.mp4" type="video/mp4" />
      </video>

      <div className="relative z-20 w-full max-w-8xl mx-6 md:mx-10 lg:mx-20 px-4 sm:px-6 flex flex-col items-start justify-center">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <h1 className="font-extrabold leading-[1.1] mb-8 text-left tracking-tight">
              <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#ffee0c] drop-shadow-xl mb-2">
                Soluciones
              </span>
              <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-[#ffee0c] to-[#f5de0b] drop-shadow-2xl mb-4">
                de energía solar
              </span>
              <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white/95 font-bold leading-tight">
                que transforman tu hogar
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/90 text-lg sm:text-xl md:text-2xl mb-12 max-w-2xl font-semibold leading-relaxed border-l-4 border-[#ffee0c] pl-6"
            >
              Más de 15 años liderando proyectos de energía renovable con tecnología de vanguardia en todo el Perú.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap justify-start gap-4 sm:gap-6"
            >
              {/* Botón primario — gradiente */}
              <a
                href="#proyectos"
                className="inline-flex items-center gap-3 font-black px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-[1.05] hover:rotate-1 text-lg text-white shadow-[0_10px_20px_-5px_rgba(30,215,96,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(30,215,96,0.4)]"
                style={{
                  background: "linear-gradient(135deg, #0ea5e1, #1ed760)",
                }}
              >
                <Package size={24} strokeWidth={2.5}/>
                Ver proyectos
              </a>

              {/* Botón secundario — Glassmorphism */}
              <a
                href={`https://wa.me/${WHATSAPP}?text=Hola, me gustaría contactarlos para conocer más sobre sus servicios de energía solar`}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border-2 border-white/20 font-black px-10 py-5 rounded-2xl transition-all duration-300 hover:bg-white hover:border-white text-lg text-white hover:text-[#0ea5e1] shadow-xl hover:scale-[1.05] hover:-rotate-1"
              >
                <MessageCircle size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform"/>
                Contáctanos
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Overlay sutil para mejorar legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10 pointer-events-none" />
    </section>
  )
}

export default Hero
