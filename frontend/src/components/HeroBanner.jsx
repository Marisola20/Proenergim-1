import { motion } from "framer-motion"

const Patterns = {
  contacto: () => (
    <pattern id="contacto-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
      <g transform="translate(38, 13) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </g>
      <g transform="translate(138, 13) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </g>
      <g transform="translate(88, 63) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 0-16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </g>
      <g transform="translate(188, 63) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </g>
    </pattern>
  ),
  nosotros: () => (
    <pattern id="nosotros-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
      <g transform="translate(38, 13) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </g>
      <g transform="translate(138, 13) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </g>
      <g transform="translate(88, 63) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
        <path d="M9 22v-4h6v4 M8 6h.01 M16 6h.01 M12 6h.01 M12 10h.01 M12 14h.01 M16 10h.01 M16 14h.01 M8 10h.01 M8 14h.01"/>
      </g>
      <g transform="translate(188, 63) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </g>
    </pattern>
  ),
  soluciones: () => (
    <pattern id="soluciones-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
      <g transform="translate(38, 13) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </g>
      <g transform="translate(138, 13) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </g>
      <g transform="translate(88, 63) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </g>
      <g transform="translate(188, 63) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
        <line x1="22" y1="11" x2="22" y2="13" />
      </g>
    </pattern>
  ),
  proyectos: () => (
    <pattern id="proyectos-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
      <g transform="translate(38, 13) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </g>
      <g transform="translate(138, 13) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </g>
      <g transform="translate(88, 63) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 0-16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </g>
      <g transform="translate(188, 63) scale(1.2)" stroke="url(#banner-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </g>
    </pattern>
  )
}

const IconPattern = ({ patternId }) => {
  const PatternContent = Patterns[patternId] || Patterns.contacto
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="banner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0ea5e1" />
          <stop offset="100%" stopColor="#1ed760" />
        </linearGradient>
        <PatternContent />
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId}-pattern)`} />
    </svg>
  )
}

function HeroBanner({ title, description, patternId }) {
  return (
    <div className="relative bg-[var(--color-bg-soft)] pt-24 pb-14 px-6 text-center overflow-hidden shadow-inner mb-12">
      <IconPattern patternId={patternId} />
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-[var(--color-primary-dark)] mb-4"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[var(--color-text-muted)] font-medium max-w-2xl mx-auto text-base md:text-lg"
        >
          {description}
        </motion.p>
      </div>
    </div>
  )
}

export default HeroBanner
