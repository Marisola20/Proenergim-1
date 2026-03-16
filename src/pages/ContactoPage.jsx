import Contacto from "../sections/Contacto"
import { motion } from "framer-motion"

const IconPattern = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.2]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="energy-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
        {/* Mail Icon */}
        <g transform="translate(38, 13) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </g>
        {/* Phone Icon */}
        <g transform="translate(138, 13) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </g>
        {/* Map Pin Icon (Staggered row) */}
        <g transform="translate(88, 63) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
           <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 0-16 0Z"/>
           <circle cx="12" cy="10" r="3"/>
        </g>
        {/* Chat / Message Icon (Staggered row) */}
        <g transform="translate(188, 63) scale(1.2)" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </g>
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#energy-pattern)" />
  </svg>
)

function ContactoPage() {
  return (
    <main className="pt-20">
      <div className="relative bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] py-20 px-6 text-center text-white overflow-hidden shadow-inner">
        <IconPattern />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md"
          >
            Contáctanos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-md md:text-xl opacity-90 drop-shadow-sm font-medium"
          >
            Estamos aquí para responder tus consultas y ofrecerte las mejores soluciones de energía para tu empresa.
          </motion.p>
        </div>
      </div>
      <Contacto mostrarBloqueProveedores={true} />
    </main>
  )
}

export default ContactoPage
