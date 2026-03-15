import { useState } from "react"
import { Link } from "react-router-dom"
import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail, MapPin, ChevronDown } from "lucide-react"

/* ── Redes ── */
const redes = [
  { label: "Facebook",  icon: Facebook,  href: "https://facebook.com",  color: "#1877F2" },
  { label: "Instagram", icon: Instagram, href: "https://instagram.com", color: "#E1306C" },
  { label: "TikTok",    icon: null,      href: "https://tiktok.com",    color: "#555555" },
  { label: "YouTube",   icon: Youtube,   href: "https://youtube.com",   color: "#FF0000" },
  { label: "LinkedIn",  icon: Linkedin,  href: "https://linkedin.com",  color: "#0A66C2" },
]

const sitemap = [
  {
    pagina: "Inicio", to: "/",
    items: [
      { label: "Servicios",   href: "/#servicios" },
      { label: "Trayectoria", href: "/#trayectoria" },
      { label: "Clientes",    href: "/#clientes" },
      { label: "Proyectos",   href: "/#proyectos" },
      { label: "Proveedores", href: "/#proveedores" },
    ],
  },
  {
    pagina: "Nosotros", to: "/nosotros",
    items: [
      { label: "Quiénes somos",       href: "/nosotros" },
      { label: "Valores",             href: "/nosotros#valores" },
      { label: "Trayectoria",         href: "/nosotros#trayectoria" },
      { label: "Equipo",              href: "/nosotros#equipo" },
      { label: "Empresas asociadas",  href: "/nosotros#clientes" },
      { label: "Trabaja con nosotros",href: "/nosotros#trabaja" },
    ],
  },
  {
    pagina: "Soluciones", to: "/soluciones",
    items: [
      { label: "Bombeo Solar",         href: "/soluciones" },
      { label: "Electrificación Solar",href: "/soluciones" },
      { label: "Riego Tecnificado",    href: "/soluciones" },
      { label: "Mantenimiento",        href: "/soluciones" },
      { label: "Sis. de Respaldo",     href: "/soluciones" },
      { label: "Auditorías",           href: "/soluciones" },
      { label: "Preguntas frecuentes", href: "/soluciones#faqs" },
    ],
  },
  {
    pagina: "Proyectos", href: "/#proyectos",
    items: [
      { label: "Bombeo Solar",          href: "/#proyectos" },
      { label: "Electrificación Solar", href: "/#proyectos" },
      { label: "Riego Tecnificado",     href: "/#proyectos" },
      { label: "Industrial",            href: "/#proyectos" },
    ],
  },
  {
    pagina: "Contacto", to: "/contacto",
    items: [
      { label: "Solicitar información",  href: "/contacto" },
      { label: "Ser aliado estratégico", href: "/contacto" },
      { label: "Ser proveedor",          href: "/contacto" },
    ],
  },
]

const sedes = [
  { nombre: "Zonal Lima",           direccion: "Av. Los Chancas N°112, Santa Anita" },
  { nombre: "Zonal La Libertad",    direccion: "Mz A3 Lote 18, Urb. Sol de Trujillo" },
  { nombre: "Zonal Piura – Tumbes", direccion: 'Mz "H" Lote "19", Prol. Cuzco, Seis de Setiembre' },
  { nombre: "Zonal Selva Sur",      direccion: "Av. Jaime Troncoso con Jr. Marco Ruiz, a 1 cdra de SENATI" },
]

function TikTokIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M16.5 3.5c.5 1.3 1.5 2.4 2.8 3v3.1a6.3 6.3 0 01-3.2-1.1v5.9a5.3 5.3 0 11-5.3-5.3c.4 0 .9.1 1.3.2v2.4a2.7 2.7 0 00-1.3-.3 2.1 2.1 0 102.1 2.1V3.5h3.6z" />
    </svg>
  )
}

function SocialIcon({ r }) {
  return (
    <a
      href={r.href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={r.label}
      title={r.label}
      className="social-icon-btn"
      style={{ color: "rgba(255,255,255,0.75)", backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = r.color
        e.currentTarget.style.borderColor = r.color
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.92)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(255,255,255,0.75)"
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"
      }}
    >
      {r.label === "TikTok" ? <TikTokIcon size={18} /> : <r.icon size={18} />}
    </a>
  )
}

function Footer() {
  const [openSection, setOpenSection] = useState(null)

  const toggleSection = (seccion) => {
    setOpenSection(openSection === seccion ? null : seccion)
  }

  return (
    <footer style={{ backgroundColor: "var(--color-primary-dark)", color: "white" }}>

      <div className="max-w-7xl mx-auto px-6 pt-8 pb-10">

        {/* ── Redes sociales · ARRIBA ── */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-8 pb-7"
             style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="footer-section-title mb-0 mr-2">Síguenos</span>
          {redes.map((r) => <SocialIcon key={r.label} r={r} />)}
        </div>

        {/* ── Grid principal: sitemap (izq) | contacto+sedes (der) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Sitemap · 2/3 del ancho en desktop, 1 col en móvil con acordeón, 2 a 5 en otras */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-4 md:gap-y-8">
            {sitemap.map((pagina) => (
              <div key={pagina.pagina} className="border-b border-white/10 md:border-none pb-2 md:pb-0">
                <div 
                  className="flex items-center justify-between cursor-pointer md:cursor-auto mb-2"
                  onClick={() => toggleSection(pagina.pagina)}
                >
                  {pagina.to ? (
                    <Link to={pagina.to} className="footer-nav-link text-white font-bold text-sm block" onClick={(e) => e.stopPropagation()}>
                      {pagina.pagina}
                    </Link>
                  ) : (
                    <a href={pagina.href} className="footer-nav-link text-white font-bold text-sm block" onClick={(e) => e.stopPropagation()}>
                      {pagina.pagina}
                    </a>
                  )}
                  {/* Icono de acordeón solo en móvil */}
                  <div className="md:hidden text-white/50 p-1">
                    <ChevronDown size={18} className={`transform transition-transform duration-300 ${openSection === pagina.pagina ? "rotate-180" : ""}`} />
                  </div>
                </div>
                
                <ul className={`flex-col gap-1 border-l border-white/15 pl-2.5 overflow-hidden transition-all duration-300 ${openSection === pagina.pagina ? "flex" : "hidden md:flex"}`}>
                  {pagina.items.map((item) => (
                    <li key={item.label}>
                      <a href={item.href}
                         className="text-white/45 text-xs leading-snug hover:text-white/90 transition-colors duration-150 block py-1">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contacto + Sedes · 1/3 del ancho en desktop */}
          <div className="flex flex-col gap-5 lg:border-l lg:border-white/10 lg:pl-8 mt-4 md:mt-0">

            <div>
              <h4 className="footer-section-title">Contacto</h4>
              <div className="flex flex-col gap-2">
                <a href="tel:+51971812567"
                   className="flex items-center gap-2 text-sm font-black hover:text-white/70 transition-all">
                  <Phone size={13} className="opacity-60 flex-shrink-0" />
                  +51 971 812 567
                </a>
                <a href="mailto:waguilar@proenergim.com"
                   className="flex items-center gap-2 text-xs font-semibold hover:text-white/70 transition-all text-white/80">
                  <Mail size={13} className="opacity-60 flex-shrink-0" />
                  <span className="break-all">waguilar@proenergim.com</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="footer-section-title">Sedes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {sedes.map((sede) => (
                  <div key={sede.nombre} className="flex items-start gap-2">
                    <MapPin size={12} className="opacity-45 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white/85 leading-tight">{sede.nombre}</p>
                      <p className="text-xs text-white/40 leading-snug">{sede.direccion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div style={{ backgroundColor: "rgba(0,0,0,0.22)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs font-bold">
            © 2025 PROENERGIM E.I.R.L. — Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs font-bold">
            <Link to="/politica-privacidad" className="text-white/30 hover:text-white transition-colors">POLÍTICA DE PRIVACIDAD</Link>
            <Link to="/terminos-condiciones" className="text-white/30 hover:text-white transition-colors">TÉRMINOS Y CONDICIONES</Link>
          </div>
        </div>
      </div>

    </footer>
  )
}

export default Footer
