import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Phone, Mail, User, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react"

const WHATSAPP = "51971812567"
const sedes = [
  { nombre: "Zonal Lima", direccion: "Av. Los Chancas N°112, Santa Anita" },
  { nombre: "Zonal La Libertad", direccion: "Mz A3 Lote 18, Urb. Sol de Trujillo" },
  { nombre: "Zonal Piura - Tumbes", direccion: 'Mz "H" Lote "19", Prolongación Cuzco, Seis de Setiembre' },
  { nombre: "Zonal Selva Sur", direccion: "Av. Jaime Troncoso con Jr. Marco Ruiz, a 1 cdra de SENATI" },
]

const redes = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
]

function Contacto({ mostrarBloqueProveedores = false }) {
  const [mostrarProveedor, setMostrarProveedor] = useState(false)

  return (
    <section id="contacto" className="py-16 bg-[var(--color-bg-soft)]">
      <div className="max-w-7xl mx-auto px-6">
        {!mostrarBloqueProveedores && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-dark)]">
              Contacto
            </h2>
            <p className="text-[var(--color-text-muted)] mt-2 max-w-2xl mx-auto">
              Nuestro equipo está listo para asesorarte en soluciones de energía solar.
            </p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LADO IZQUIERDO: Solicitar Información */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[var(--color-primary)]">
              <div className="flex flex-col gap-4">
                {/* Nombre y Correo lado a lado horizontal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input type="text" placeholder="Nombre" className="w-full border border-[var(--color-primary)]/20 rounded-full pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50" />
                  </div>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input type="email" placeholder="Correo" className="w-full border border-[var(--color-primary)]/20 rounded-full pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50" />
                  </div>
                </div>
                {/* Teléfono ancho completo debajo */}
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input type="tel" placeholder="Teléfono" className="w-full border border-[var(--color-primary)]/20 rounded-full pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50" />
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hola, solicito información sobre sus servicios de energía solar`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-center gap-2 mt-4 bg-[#25D366] hover:bg-[#20BE5C] text-white font-bold py-3.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Quiero información
                </a>
              </div>
            </div>
          </motion.div>

          {/* LADO DERECHO: Datos de Contacto y Sedes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Datos de contacto y Redes */}
            <div className="bg-[var(--color-primary-dark)] rounded-[2rem] p-8 text-white shadow-sm">
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <Phone size={18} className="text-[var(--color-accent)]" />
                  <span className="text-base font-medium">971 812 567</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={18} className="text-[var(--color-accent)]" />
                  <span className="text-base font-medium">waguilar@proenergim.com</span>
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="pt-6 border-t border-white/20">
                <p className="text-white/80 font-medium text-sm mb-4">Síguenos en redes sociales</p>
                <div className="flex flex-wrap gap-3">
                  {redes.map((r) => (
                    <a
                      key={r.label}
                      href={r.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={r.label}
                      className="w-10 h-10 border border-white/20 rounded-full bg-white/10 hover:bg-white hover:text-[var(--color-primary-dark)] flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <r.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sedes (ColumnFullWidth) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-white rounded-[2rem] p-8 shadow-sm border border-[var(--color-primary)] w-full"
        >
          <h3 className="text-[var(--color-primary-dark)] font-bold text-xl mb-6 text-center">Nuestras sedes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sedes.map((sede, i) => (
              <div key={i} className="flex flex-col gap-1.5 p-4 border border-[var(--color-primary)]/20 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors h-full">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[var(--color-primary)] shrink-0" />
                  <p className="text-[var(--color-primary-dark)] font-bold text-[13px] leading-tight">{sede.nombre}</p>
                </div>
                <p className="text-[var(--color-text-muted)] text-[12px] leading-relaxed pl-6">{sede.direccion}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* PROVEEDORES FULL WIDTH ABAJO */}
        {mostrarBloqueProveedores && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 bg-white rounded-[2.5rem] p-10 shadow-sm border border-[var(--color-primary)] relative overflow-hidden"
          >
            <div className="text-center">
              <h3 className="text-[var(--color-primary-dark)] font-bold text-2xl mb-3">
                Únete a nuestra red de proveedores y aliados estratégicos
              </h3>
              <p className="text-[var(--color-text-muted)] text-base max-w-2xl mx-auto mb-8">
                Conviértete en nuestro aliado estratégico como proveedor. Si tienes productos o servicios que encajen con nosotros, cuéntanos y evaluamos trabajar juntos.
              </p>
            </div>

            {!mostrarProveedor ? (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setMostrarProveedor(true)}
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-4 px-12 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Comenzar
                </button>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="flex flex-col md:flex-row items-center gap-3 max-w-6xl m-2 p-2 mx-auto">
                    <input
                      icon={User}
                      type="text" placeholder="Nombre o empresa" className="flex-1 w-full border border-[var(--color-primary)]/20 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50" />
                    <input
                      icon={Mail}
                      type="email" placeholder="Correo" className="flex-1 w-full border border-[var(--color-primary)]/20 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50" />
                    <input
                      icon={Phone}
                      type="tel" placeholder="Celular" className="w-full md:w-32 lg:w-40 border border-[var(--color-primary)]/20 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50" />
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=Hola, quiero unirme a su red de proveedores y aliados estratégicos`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BE5C] text-white font-bold py-3 px-6 rounded-full transition-colors whitespace-nowrap shadow-sm hover:shadow-md hover:-translate-y-0.5 w-full md:w-auto"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Enviar solicitud
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        )}

      </div>
    </section>
  )
}

export default Contacto
