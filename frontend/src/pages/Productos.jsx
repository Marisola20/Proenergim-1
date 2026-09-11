import { useCallback, useState, useEffect } from "react"
import { motion as Motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Wrench, X, BadgeCheck, PartyPopper, RefreshCw } from "lucide-react"
import HeroBanner from "../components/HeroBanner"
import ImpactSection from "../components/ImpactSection"

const API_URL = import.meta.env.VITE_API_URL || ""
const formatPrice = (price) => new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(price) || 0)

// ── Componente de tarjeta (fuera de Productos para evitar remontaje en cada render) ──
function CardProducto({ prod, i, onComprar }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.45, delay: i * 0.07 }}
      className="group bg-white rounded-xl border border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Imagen */}
      <div className="relative">
        <img
          src={prod.imagen}
          alt={prod.titulo}
          className="w-full aspect-square object-cover bg-gray-50"
        />
        {/* Badge marca */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 shadow-sm border border-gray-100">
          <span className="font-black tracking-wide text-[var(--color-primary-dark)]" style={{ fontSize: "clamp(10px, 1.2vw, 16px)" }}>
            {prod.marca}
          </span>
        </div>
        {/* Precio */}
        <div
          className="absolute bottom-0 left-0 right-0 text-center py-1 px-1"
          style={{ backgroundColor: "var(--color-green)" }}
        >
          <span className="font-bold text-white whitespace-nowrap" style={{ fontSize: "clamp(13px, 2.2vw, 26px)" }}>
            S/. {formatPrice(prod.precio)}
          </span>
        </div>
      </div>

      {/* Nombre + Botón */}
      <div className="px-2 py-2 flex flex-col gap-1.5">
        <p
          className="leading-tight text-center font-medium text-[var(--color-primary-dark)] line-clamp-3"
          style={{ fontSize: "clamp(12px, 2vw, 16px)" }}
        >
          {prod.titulo}
        </p>
        <button
          onClick={() => onComprar(prod)}
          className="w-full font-bold py-1 sm:py-1.5 rounded-lg text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "var(--color-primary-dark)", fontSize: "clamp(12px, 2vw, 17px)" }}
        >
          Comprar
        </button>
      </div>
    </Motion.div>
  )
}

function Productos() {
  const [productos, setProductos] = useState([])
  const [cargandoProductos, setCargandoProductos] = useState(true)
  const [errorProductos, setErrorProductos] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [form, setForm] = useState({ nombre: "", celular: "", correo: "", descripcion: "" })
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)
  const [dots, setDots] = useState("")

  const cargarProductos = useCallback(async () => {
    setCargandoProductos(true)
    setErrorProductos("")
    try {
      const res = await fetch(`${API_URL}/api/productos`, { cache: "no-store" })
      if (!res.ok) throw new Error("No se pudo cargar el catálogo")
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error("Respuesta de catálogo no válida")
      setProductos(data)
    } catch (error) {
      console.error("Error al cargar productos:", error)
      setErrorProductos("No pudimos actualizar el catálogo. Inténtalo nuevamente.")
    } finally {
      setCargandoProductos(false)
    }
  }, [])

  useEffect(() => {
    cargarProductos()
    window.addEventListener("focus", cargarProductos)
    return () => window.removeEventListener("focus", cargarProductos)
  }, [cargarProductos])

  const variadores = productos.filter(prod => prod.categoria === "variadores")
  const accesorios = productos.filter(prod => prod.categoria === "accesorios")

  // Animación de puntos mientras envía
  useEffect(() => {
    if (!enviando) { setDots(""); return }
    const ciclo = [".", "..", "..."]
    let i = 0
    const id = setInterval(() => { i = (i + 1) % 3; setDots(ciclo[i]) }, 400)
    return () => clearInterval(id)
  }, [enviando])

  const abrirModal = (prod) => {
    setProductoSeleccionado(prod)
    setModalOpen(true)
    setExito(false)
    setForm({ nombre: "", celular: "", correo: "", descripcion: "" })
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setProductoSeleccionado(null)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/compra`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          producto: `${productoSeleccionado.marca} ${productoSeleccionado.titulo}`,
          precio: formatPrice(productoSeleccionado.precio),
        }),
      })
      const data = await res.json()
      if (data.success) setExito(true)
    } catch (error) {
      console.error("Error al enviar:", error)
    } finally {
      setEnviando(false)
    }
  }



  return (
    <main className="min-h-screen bg-white">
      <HeroBanner
        subtitle="Tecnología solar"
        title="Nuestros"
        highlight="productos"
        description="Calidad y eficiencia en cada producto."
        patternId="soluciones"
      />

      {/* ── SECCIÓN DE IMPACTO ── */}
      <ImpactSection
        title={<>Top calidad.</>}
        highlight="Rendimiento garantizado."
        points={[
          {
            icon: ShieldCheck,
            label: "Marcas Líderes",
            text: "Trabajamos con el top 10 de fabricantes solares a nivel nacional.",
            color: "#7ad7ff"
          },
          {
            icon: Wrench,
            label: "Soporte Continuo",
            text: "Acompañamiento técnico para el rendimiento óptimo de tu inversión.",
            color: "#3cf57c"
          }
        ]}
      />

      {/* ── BANNER GARANTÍA ── */}
      <section className="px-3 sm:px-6 mb-10">
        <div className="max-w-5xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 bg-gradient-to-r from-[#fef9e7] to-[#fffde4] border border-[#ffd966]/50 rounded-2xl px-5 py-4 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-[#ffd966]/30 flex items-center justify-center shrink-0">
              <BadgeCheck size={26} className="text-[#e6a800]" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-[var(--color-primary-dark)]">
                Garantía y soporte en nuestros productos
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Consulta las condiciones registradas para cada equipo al solicitar tu compra.
              </p>
            </div>
          </Motion.div>
        </div>
      </section>

      {cargandoProductos && productos.length === 0 && (
        <section className="px-3 sm:px-6 pb-16">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 py-12 text-gray-500">
            <RefreshCw size={20} className="animate-spin" />
            <span className="text-sm font-medium">Actualizando catálogo...</span>
          </div>
        </section>
      )}

      {errorProductos && productos.length === 0 && (
        <section className="px-3 sm:px-6 pb-16">
          <div className="max-w-5xl mx-auto rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">{errorProductos}</p>
            <button
              type="button"
              onClick={cargarProductos}
              className="mt-4 rounded-lg bg-[var(--color-primary-dark)] px-4 py-2 text-sm font-bold text-white"
            >
              Reintentar
            </button>
          </div>
        </section>
      )}

      {!cargandoProductos && !errorProductos && productos.length === 0 && (
        <section className="px-3 sm:px-6 pb-16">
          <p className="max-w-5xl mx-auto py-12 text-center text-sm text-gray-500">
            No hay productos disponibles en este momento.
          </p>
        </section>
      )}

      {productos.length > 0 && <>
        {/* ── VARIADORES DE FRECUENCIA SOLAR ── */}
        <section className="pb-16 px-3 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--color-primary-dark)]">
              Variadores de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">
                Frecuencia Solar
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Inversores híbridos de alta eficiencia</p>
          </Motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {variadores.map((prod, i) => (
              <CardProducto key={prod._id || prod.codigo} prod={prod} i={i} onComprar={abrirModal} />
            ))}
          </div>
        </div>
        </section>

        {/* ── ACCESORIOS ELÉCTRICOS ── */}
        <section className="pb-16 px-3 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto pt-10">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--color-primary-dark)]">
              Accesorios{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]">
                Eléctricos
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Componentes de protección y conexión solar</p>
          </Motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {accesorios.map((prod, i) => (
              <CardProducto key={prod._id || prod.codigo} prod={prod} i={i} onComprar={abrirModal} />
            ))}
          </div>
        </div>
        </section>
      </>}

      {/* ── MODAL ── */}
      <AnimatePresence>
        {modalOpen && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={cerrarModal}
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={cerrarModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              {!exito ? (
                <>
                  <h2 className="text-lg font-black text-[var(--color-primary-dark)] mb-1">
                    Solicitar compra
                  </h2>
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-semibold text-[var(--color-primary-dark)]">
                      {productoSeleccionado?.marca} — {productoSeleccionado?.titulo}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    S/. {formatPrice(productoSeleccionado?.precio)} · Garantía {productoSeleccionado?.garantiaAnos ?? 2} años
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre *"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
                    />
                    <input
                      name="celular"
                      value={form.celular}
                      onChange={handleChange}
                      required
                      placeholder="Tu celular *"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
                    />
                    <input
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      placeholder="Tu correo (opcional)"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
                    />
                    <textarea
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      placeholder="¿Alguna consulta o descripción?"
                      rows={3}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] resize-none"
                    />
                    <button
                      type="submit"
                      disabled={enviando}
                      className="w-full py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ backgroundColor: "var(--color-primary-dark)" }}
                    >
                      {enviando ? `Enviando${dots}` : "Enviar solicitud"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="flex justify-center mb-3">
                    <PartyPopper size={48} className="text-[var(--color-primary-dark)]" />
                  </div>
                  <h3 className="text-lg font-black text-[var(--color-primary-dark)] mb-2">
                    ¡Solicitud enviada!
                  </h3>
                  <p className="text-sm text-gray-500">
                    En breve un asesor especializado se comunicará contigo para ayudarte con tu compra.
                  </p>
                </div>
              )}
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Productos
