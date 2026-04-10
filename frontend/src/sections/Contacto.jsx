import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, Mail, User, Send, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react"

const WHATSAPP = "51936954890"

const sedes = [
  { nombre: "Lima", ciudad: "Lima", imagen: "/images/sedes/Lima.webp" },
  { nombre: "La Libertad", ciudad: "Trujillo", imagen: "/images/sedes/Trujillo.webp" },
  { nombre: "Piura", ciudad: "Tumbes ", imagen: "/images/sedes/Tumbes.webp" },
  { nombre: "Selva Sur", ciudad: "Madre de Dios", imagen: "/images/sedes/Madre-de-Dios.webp" },
]

const redes = [
  { icon: Facebook, href: "https://www.facebook.com/share/1DdKNkDJVa/", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/proenergim?igsh=OGgzYWV3NzF4OWw2", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
]

function FlipSede({ sede }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div
      className="[perspective:1000px] h-44 cursor-pointer rounded-2xl"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] rounded-2xl ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRENTE */}
        <div className="absolute inset-0 rounded-2xl [backface-visibility:hidden] overflow-hidden flex flex-col items-center justify-center gap-2 p-5 bg-[var(--color-primary-dark)] border border-[#0ea5e9]/30 shadow-[0_4px_20px_-4px_rgba(3,105,161,0.3)]">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-green-500/30 rounded-full pointer-events-none" />
          <div className="w-11 h-11 rounded-xl bg-green-500/15 border border-white/20 flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <p className="text-white font-black text-sm text-center leading-tight tracking-tight">{sede.nombre}</p>
          <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.1em]">Ver ciudad →</span>
        </div>

        {/* REVERSO */}
        <div className="absolute inset-0 rounded-2xl [backface-visibility:hidden] overflow-hidden [transform:rotateY(180deg)]">
          <img
            src={sede.imagen}
            alt={sede.ciudad}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#031e32]/85 via-[#031e32]/20 to-transparent flex flex-col justify-end p-4">
            <p className="text-white font-black text-lg leading-tight tracking-tight">{sede.ciudad}</p>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.1em] mt-0.5">{sede.nombre}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Contacto({ mostrarBloqueProveedores = false }) {
  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [telefono, setTelefono] = useState("")

  const [estado, setEstado] = useState("idle") // idle | loading | redirigiendo | enviado | error

  // Validaciones por campo
  const nombreValido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombre.trim()) && nombre.trim() !== ""
  const correoValido = correo.includes("@") && correo.trim() !== ""
  const telefonoValido = /^[0-9]{9}$/.test(telefono.trim()) && telefono.trim() !== ""
  const camposCompletos = nombreValido && correoValido && telefonoValido

  const formatearTelefono = (valor) => {
    const soloDigitos = valor.replace(/\D/g, "").slice(0, 9)
    setTelefono(soloDigitos)
  }

  const telefonoFormateado = telefono
    .replace(/^(\d{3})(\d{1,3})?/, (_, a, b) => b ? `${a} ${b}` : a)
    .replace(/^(\d{3} \d{3})(\d{1,3})?/, (_, a, b) => b ? `${a} ${b}` : a)

  const enviarFormulario = async () => {
    if (!camposCompletos) return
    try {
      setEstado("loading")

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          telefono,
          empresa: correo,
          mensaje: "Solicitud desde formulario web"
        })
      })

      if (!res.ok) throw new Error("Error")

      setEstado("redirigiendo")

      const lineas = [
        "Hola, acabo de enviar una solicitud desde la web.",
        "",
        "*Datos del cliente:*",
        "*Nombre:* " + nombre,
        "*Telefono:* " + telefono,
        "*Correo:* " + correo,
        "",
        "Estoy interesado en recibir informacion sobre sus servicios.",
        "Quedo atento a la asesoria. Gracias!",
      ]

      const mensaje = lineas.join("\n")
      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`

      setTimeout(() => {
        const link = document.createElement("a")
        link.href = url
        link.target = "_blank"
        link.rel = "noreferrer"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setEstado("enviado")
      }, 1500)

    } catch (error) {
      console.error(error)
      setEstado("error")
    }
  }
  const [mostrarProveedor, setMostrarProveedor] = useState(false)

  return (
    <section id="contacto" className="section-py bg-[var(--color-bg-soft)]">
      <div className="max-w-7xl mx-auto px-6">
        {!mostrarBloqueProveedores && (
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] uppercase text-[10px] sm:text-xs mb-4 mt-12 py-1.5 px-4 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10"
            >
              Contáctanos
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-primary-dark)] mb-5 tracking-tight"
            >
              Estamos{" "}<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">para ayudarte</span>
            </motion.h2>
            <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Nuestro equipo está listo para asesorarte en soluciones de energía solar a medida.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LADO IZQUIERDO: Solicitar Información */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[var(--color-primary)]/40">
              <h3 className="font-black text-[var(--color-primary-dark)] text-lg mb-6">Solicitar información</h3>
              <div className="flex flex-col gap-4">
                {/* Nombre — fila completa */}
                <div className="flex flex-col gap-1">
                  <div className="relative">
                    <User size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${nombre && !nombreValido ? "text-red-400" : "text-[var(--color-primary)]"}`} />
                    <input
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      type="text"
                      placeholder="Nombre completo"
                      className={`w-full border rounded-full pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 bg-slate-50 transition-all
                        ${nombre && !nombreValido
                          ? "border-red-400 focus:ring-red-300"
                          : "border-slate-200 focus:ring-[var(--color-primary)]"}`} />
                  </div>
                  {nombre && !nombreValido && (
                    <p className="text-slate-400 text-xs pl-4">*Ingresar correctamente sus nombres</p>
                  )}
                </div>
                {/* Correo + Teléfono en la misma fila */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${correo && !correoValido ? "text-red-400" : "text-[var(--color-primary)]"}`} />
                      <input
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        type="email"
                        placeholder="Correo electrónico"
                        className={`w-full border rounded-full pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 bg-slate-50 transition-all
                          ${correo && !correoValido
                            ? "border-red-400 focus:ring-red-300"
                            : "border-slate-200 focus:ring-[var(--color-primary)]"}`} />
                    </div>
                    {correo && !correoValido && (
                      <p className="text-slate-400 text-xs pl-4">*Ingresar correctamente su correo</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <Phone size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${telefono && !telefonoValido ? "text-red-400" : "text-[var(--color-primary)]"}`} />
                      <input
                        value={telefonoFormateado}
                        onChange={(e) => formatearTelefono(e.target.value)}
                        type="tel"
                        inputMode="numeric"
                        placeholder="+51 912 345 678"
                        maxLength={11}
                        className={`w-full border rounded-full pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 bg-slate-50 transition-all
                          ${telefono && !telefonoValido
                            ? "border-red-400 focus:ring-red-300"
                            : "border-slate-200 focus:ring-[var(--color-primary)]"}`} />
                    </div>
                    {telefono && telefono.length < 9 && (
                      <p className="text-slate-400 text-xs pl-4">*Número de teléfono incompleto</p>
                    )}
                    {telefono && telefono.length === 9 && !telefonoValido && (
                      <p className="text-red-500 text-xs pl-4">Ingrese correctamente su número</p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={enviarFormulario}
                  disabled={!camposCompletos || estado === "loading" || estado === "redirigiendo" || estado === "enviado"}
                  className={`flex items-center justify-center gap-2 font-bold py-3.5 rounded-full transition-all duration-300 w-full
                    ${
                      estado === "enviado"
                        ? "bg-green-100 text-green-700 cursor-default"
                        : estado === "loading" || estado === "redirigiendo"
                        ? "bg-[#25D366]/70 text-white cursor-not-allowed"
                        : camposCompletos
                        ? "bg-[#25D366] hover:bg-[#20BE5C] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                >
                  {estado === "idle" && (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Enviar a WhatsApp
                    </>
                  )}
                  {estado === "loading" && "Enviando..."}
                  {estado === "redirigiendo" && "Te estamos redirigiendo..."}
                  {estado === "enviado" && "Enviado"}
                  {estado === "error" && "Error — intenta nuevamente"}
                </button>

                {estado === "redirigiendo" && (
                  <p className="text-slate-500 text-sm text-center mt-2">
                    Abriendo WhatsApp con tu informacion...
                  </p>
                )}

                {estado === "enviado" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-3 mt-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Send size={18} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-green-700 text-sm">¡Mensaje enviado!</p>
                      <p className="text-xs text-green-600">Muchas gracias, en breve nos pondremos en contacto.</p>
                    </div>
                    <button
                      onClick={() => { setEstado("idle"); setNombre(""); setCorreo(""); setTelefono("") }}
                      className="text-xs text-green-600 hover:text-green-700 font-bold underline underline-offset-2 whitespace-nowrap"
                    >
                      Enviar otra solicitud
                    </button>
                  </motion.div>
                )}

                {estado === "error" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3 mt-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <Send size={18} className="text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-red-700 text-sm">¡Error al enviar!</p>
                      <p className="text-xs text-red-600">Ocurrio un error. Por favor intenta nuevamente.</p>
                    </div>
                    <button
                      onClick={() => setEstado("idle")}
                      className="text-xs text-red-600 hover:text-red-700 font-bold underline underline-offset-2 whitespace-nowrap"
                    >
                      Intentar de nuevo
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* LADO DERECHO: Datos de Contacto y Sedes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Datos de contacto y Redes */}
            <div className="rounded-[2rem] p-8 text-white shadow-sm flex flex-col h-full" style={{ backgroundColor: "var(--color-primary-dark)" }}>
              <h3 className="font-black text-white text-lg mb-6">Información de contacto</h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <a
                  href="tel:+51936954890"
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-4 py-4 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-[var(--color-accent-light)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-0.5">Teléfono</p>
                    <p className="text-white font-bold text-sm truncate">936 954 890</p>
                  </div>
                </a>
                <a
                  href="mailto:waguilar@proenergim.com"
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-4 py-4 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-[var(--color-accent-light)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-0.5">Correo</p>
                    <p className="text-white font-bold text-xs truncate">waguilar@proenergim.com</p>
                  </div>
                </a>
              </div>
              <div className="mt-auto pt-6 border-t border-white/20">
                <p className="text-white/60 font-bold text-[10px] uppercase tracking-wider mb-4">Síguenos en redes sociales</p>
                <div className="flex flex-wrap gap-2">
                  {redes.map((r) => (
                    <a
                      key={r.label}
                      href={r.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={r.label}
                      className="w-10 h-10 border border-white/20 rounded-full bg-white/10 hover:bg-white hover:text-[var(--color-primary-dark)] flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <r.icon size={17} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sedes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 mb-10 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 w-full"
        >
          <div className="text-center mb-6">
            <span className="inline-block text-[var(--color-primary)] font-black tracking-[0.25em] uppercase text-[10px] mb-3 py-1 px-3 bg-[var(--color-primary)]/5 rounded-full border border-[var(--color-primary)]/10">
              Dónde estamos
            </span>
            <h3 className="text-[var(--color-primary-dark)] font-black text-2xl tracking-tight">Nuestras sedes</h3>
            <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Contamos con sedes estratégicamente ubicadas para atenderte mejor.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {sedes.map((sede, i) => (
              <FlipSede key={i} sede={sede} />
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
            className="mt-16 relative overflow-hidden rounded-3xl text-white p-10 md:p-14"
            style={{ backgroundColor: "var(--color-primary-dark)" }}
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-5">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#fcd34d]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <h3 className="text-white font-black text-2xl sm:text-3xl mb-3 tracking-tight">
                  ¿Eres{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#1ed760]">proveedor o aliado</span>
                  {" "}estratégico?
                </h3>
                <p className="text-white/75 text-base max-w-2xl mx-auto leading-relaxed">
                  Si tienes productos o servicios que encajen con nuestra oferta, cuéntanos y evaluamos trabajar juntos.
                </p>
              </div>

              {!mostrarProveedor ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setMostrarProveedor(true)}
                    className="bg-[#25D366] hover:bg-[#20BE5C] text-white font-black py-4 px-12 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Quiero unirme
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  <motion.div
                    key="form-proveedor"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-3 max-w-4xl mx-auto">
                      <input type="text" placeholder="Nombre o empresa" className="flex-1 w-full border border-white/30 rounded-full px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/15 text-white placeholder-white/60" />
                      <input type="email" placeholder="Correo electrónico" className="flex-1 w-full border border-white/30 rounded-full px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/15 text-white placeholder-white/60" />
                      <input type="tel" placeholder="Celular" className="w-full md:w-44 border border-white/30 rounded-full px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/15 text-white placeholder-white/60" />
                      <a
                        href={`https://wa.me/${WHATSAPP}?text=Hola, quiero unirme a su red de proveedores y aliados estratégicos`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BE5C] text-white font-bold py-3.5 px-6 rounded-full transition-colors whitespace-nowrap shadow-sm hover:shadow-md hover:-translate-y-0.5 w-full md:w-auto"
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
            </div>
          </motion.div>
        )}

      </div>
    </section>
  )
}

export default Contacto
