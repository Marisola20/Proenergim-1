import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Folder, MessageCircle, ChevronRight } from "lucide-react"

const WHATSAPP = "51936954890"

// --- VARIANTES PARA EL BOTÓN DE CONTACTO (Animación Hover) ---
const contactButtonVariants = {
  initial: { 
    backgroundColor: "rgba(255, 255, 255, 0)", 
    borderColor: "#ffffff",
    backdropFilter: "blur(12px)"
  },
  hover: { 
    backgroundColor: "rgba(255, 255, 255, 1)", 
    borderColor: "rgba(255, 255, 255, 0)",
    backdropFilter: "blur(0px)"
  }
}

const contactIconVariants = {
  initial: { color: "#ffffff" },
  hover: { color: "#0ea5e1" }
}

const contactTextVariants = {
  initial: { color: "#ffffff" },
  hover: { color: "transparent" }
}

// --- VARIANTES PARA EL BOTÓN DE PROYECTOS (Ícono Vivo) ---
const iconMoveVariants = {
  initial: { x: 0, rotate: 0 },
  hover: { x: 5, rotate: 5, transition: { type: "spring", stiffness: 300 } }
}

const chevronVariants = {
  initial: { opacity: 0, x: -10 },
  hover: { opacity: 1, x: 0, transition: { duration: 0.3 } }
}

function Hero() {
  const videoRef = useRef(null)
  const [videoVisible, setVideoVisible] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Revisar cada 500ms si el video está corriendo de verdad
    const interval = setInterval(() => {
      const isPaused = video.paused || video.ended || document.hidden
      setVideoVisible(v => !isPaused)
    }, 500)

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        video.play().catch(() => {})
      } else {
        video.pause()
        setVideoVisible(false)
      }
    }

    // Escucha cualquier pausa/play del video directamente
    const handlePlaying = () => setVideoVisible(true)
    const handlePause = () => setVideoVisible(false)
    const handleWaiting = () => setVideoVisible(false)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(video)
    video.addEventListener("playing", handlePlaying)
    video.addEventListener("pause", handlePause)
    video.addEventListener("waiting", handleWaiting)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      clearInterval(interval)
      observer.disconnect()
      video.removeEventListener("playing", handlePlaying)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("waiting", handleWaiting)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <section 
      id="inicio" 
      className="relative h-[100dvh] md:min-h-[100dvh] md:h-auto flex items-center overflow-hidden pt-24 bg-gray-900"
      style={{ 
        backgroundImage: "url('/images/bienvenida/img-hero.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Imagen de fondo — solo visible cuando video NO está activo */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{
          backgroundImage: "url('/images/bienvenida/img-hero.webp')",
          opacity: videoVisible ? 0 : 1,
        }}
      />

      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-[1] transition-opacity duration-500"
        style={{ opacity: videoVisible ? 0.9 : 0 }}
      >
        <source src="/videos/bienvenida/video-hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay transparente para eventos */}
      <div className="absolute inset-0 z-10 pointer-events-none" />

      <div className="relative z-20 w-full max-w-7xl mx-auto pt-10 sm:pt-20 px-6 sm:px-20 md:px-16 lg:px-4 flex flex-col items-start justify-center gap-10">
        
        <div className="max-w-6xl w-full text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Título: Dos líneas en amarillo brillante */}
            <h1 className="font-extrabold leading-[1.3] mb-8 tracking-tight text-[#ffee0c] drop-shadow-[4px_4px_14px_rgba(0,0,0,0.5)]">
              <span className="block text-4xl sm:text-4xl md:text-5xl lg:text-[80px]">
                Soluciones de energía solar
              </span>
              <span className="block text-4xl sm:text-4xl md:text-5xl lg:text-[80px]">
                que transforman tu negocio
              </span>
            </h1>

            {/* Subtítulo: Blanco con barra lateral amarilla */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white text-lg sm:text-lg md:text-xl lg:text-2xl mb-12 max-w-5xl font-bold leading-relaxed border-l-4 border-[#ffee0c] pl-6 drop-shadow-[4px_4px_14px_rgba(0,0,0,0.5)]"
            >
              Más de 15 años desarrollando proyectos de energía renovable en todo el Perú.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-row flex-wrap justify-start gap-3 sm:gap-6 pb-8 sm:pb-0"
            >
              {/* Botón 1: Ver proyectos (Efecto Ícono Vivo) */}
              <motion.a
                href="#proyectos"
                whileHover="hover"
                className="group inline-flex items-center gap-2 sm:gap-3 font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-2xl transition-all duration-300 hover:scale-105 text-sm sm:text-lg text-white shadow-xl hover:brightness-110 whitespace-nowrap"
                style={{ background: "linear-gradient(90deg, #00acc1, #2ecc71)" }}
              >
                <motion.div variants={iconMoveVariants}>
                  <Folder size={20} fill="white" fillOpacity={0.2}/>
                </motion.div>
                <span>Ver proyectos</span>
              </motion.a>

              {/* Botón 2: Contáctanos (Animado en Hover) */}
              <motion.a
                href={`https://wa.me/${WHATSAPP}?text=Hola, me gustaría contactarlos para conocer más sobre sus servicios de energía solar.`}
                target="_blank"
                rel="noreferrer noopener"
                initial="initial"
                whileHover="hover"
                variants={contactButtonVariants}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 sm:gap-3 font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-2xl border-2 transition-transform duration-300 hover:scale-105 text-sm sm:text-lg shadow-xl overflow-hidden whitespace-nowrap"
              >
                <motion.div
                  variants={contactIconVariants}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <MessageCircle size={20} />
                </motion.div>
                
                <motion.span 
                  variants={contactTextVariants}
                  transition={{ duration: 0.3 }}
                  className="bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]"
                >
                  Contactanos
                </motion.span>
              </motion.a>             
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
