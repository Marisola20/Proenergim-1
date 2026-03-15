import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import logoMobile from "../assets/logo-movile.webp"

const links = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Soluciones", href: "/soluciones" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Contacto", href: "/contacto" },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-[var(--color-primary)] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoMobile}
            alt="Proenergim"
            className="h-14 w-auto md:h-[4.5rem] object-contain"
          />
        </Link>

        <ul className="hidden md:flex gap-6">
          {links.map((link) => (
            <li key={link.label}>
              {link.href.startsWith("/#") ? (
                <a
                  href={link.href}
                  className="text-[var(--color-primary-dark)]/90 hover:text-[var(--color-primary-dark)] text-base font-medium transition-all duration-200 relative after:absolute after:left-0 after:bottom-[-2px] after:h-0.5 after:w-0 after:bg-[var(--color-accent)] after:transition-all hover:after:w-full"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.href}
                  className="text-[var(--color-primary-dark)]/90 hover:text-[var(--color-primary-dark)] text-base font-medium transition-all duration-200 relative after:absolute after:left-0 after:bottom-[-2px] after:h-0.5 after:w-0 after:bg-[var(--color-accent)] after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <Link
          to="/contacto"
          className="hidden md:inline-flex items-center bg-[#FFC107] hover:bg-[#25D366] text-[#25D366] hover:text-[#FFC107] font-extrabold px-5 py-2.5 rounded-full text-base transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
        >
          Solicitar información
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[var(--color-primary-dark)] p-2"
          aria-label="Menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white px-6 pb-4 border-t border-[var(--color-primary)]">
          <ul className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <li key={link.label}>
                {link.href.startsWith("/#") ? (
                  <a href={link.href} onClick={() => setOpen(false)} className="block text-[var(--color-primary-dark)]/90 hover:text-[var(--color-primary-dark)] py-2 text-base font-medium">
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.href} onClick={() => setOpen(false)} className="block text-[var(--color-primary-dark)]/90 hover:text-[var(--color-primary-dark)] py-2 text-base font-medium">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/contacto"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center bg-[#FFC107] hover:bg-[#25D366] text-[#25D366] hover:text-[#FFC107] font-extrabold px-4 py-2 rounded-full text-base transition-all duration-300"
              >
                Solicitar información
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar
