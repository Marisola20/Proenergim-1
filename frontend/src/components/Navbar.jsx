import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import logoWeb from "../assets/logo-web.webp"

const links = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Soluciones", href: "/soluciones" },
  { label: "Productos", href: "/productos" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Contacto", href: "/contacto" },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-[var(--color-primary)] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between relative">

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={logoWeb}
            alt="Proenergim"
            loading="eager"
            decoding="async"
            className="h-14 lg:h-[3.8rem] w-auto object-contain"
          />
        </Link>

        {/* Links — solo laptop+ */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-7">
          {links.map((link) => (
            <li key={link.label}>
              {link.href.startsWith("/#") ? (
                <a
                  href={link.href}
                  className="text-[var(--color-primary-dark)]/90 hover:text-[var(--color-primary-dark)] text-sm xl:text-base font-medium transition-all duration-200 relative after:absolute after:left-0 after:bottom-[-2px] after:h-0.5 after:w-0 after:bg-[var(--color-accent)] after:transition-all hover:after:w-full whitespace-nowrap"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.href}
                  className="text-[var(--color-primary-dark)]/90 hover:text-[var(--color-primary-dark)] text-sm xl:text-base font-semibold transition-all duration-200 relative after:absolute after:left-0 after:bottom-[-2px] after:h-0.5 after:w-0 after:bg-[var(--color-accent)] after:transition-all hover:after:w-full whitespace-nowrap"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Botón CTA con efecto shimmer — solo laptop+ */}
        <Link
          to="/contacto"
          className="hidden lg:inline-flex shrink-0 group relative items-center justify-center bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] p-[2px] rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
        >
          <span className="flex items-center justify-center w-full h-full bg-transparent group-hover:bg-white rounded-full px-4 py-1.5 transition-all duration-300 border-none overflow-hidden relative">
            {/* Shimmer */}
            <span className="absolute inset-0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            <span className="text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#0ea5e1] group-hover:to-[#1ed760] font-extrabold text-sm xl:text-base whitespace-nowrap relative z-10">
              Solicitar información
            </span>
          </span>
        </Link>

        {/* Hamburguesa — móvil y tablet */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-[var(--color-primary-dark)] p-2"
          aria-label="Menú"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Dropdown flotante animado */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:hidden absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 px-3 py-3 z-50 origin-top-right"
            >
              <ul className="flex flex-col gap-0.5">
                {links.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    {link.href.startsWith("/#") ? (
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block text-[var(--color-primary-dark)]/90 hover:text-[var(--color-primary)] py-2 px-3 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className="block text-[var(--color-primary-dark)]/90 hover:text-[var(--color-primary)] py-2 px-3 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.04, duration: 0.2 }}
                  className="pt-2 mt-1 border-t border-slate-100"
                >
                  <Link
                    to="/contacto"
                    onClick={() => setOpen(false)}
                    className="group relative flex items-center justify-center bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] p-[2px] rounded-full transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                  >
                    <span className="w-full text-center bg-transparent group-hover:bg-white rounded-full px-4 py-1.5 transition-all duration-300 overflow-hidden relative">
                      {/* Shimmer */}
                      <span className="absolute inset-0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                      <span className="text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#0ea5e1] group-hover:to-[#1ed760] font-extrabold text-sm whitespace-nowrap relative z-10">
                        Solicitar información
                      </span>
                    </span>
                  </Link>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  )
}

export default Navbar