import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, X, Send, User, MessageSquare, Star, MessageCircle } from "lucide-react"

// ── Hook: contador animado ──────────────────────────────────────────────
function useCountUp(target, duration = 2200, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

// ── Slider de Comentarios de Usuarios ────────────────────────────────────
function FeedbackSlider({ resenas }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const total = resenas.length

  const goTo = (idx, dir) => {
    if (total === 0) return
    setDirection(dir)
    setCurrent((idx + total) % total)
  }

  useEffect(() => {
    if (total <= 1) return
    const t = setTimeout(() => goTo(current + 1, 1), 5000)
    return () => clearTimeout(t)
  }, [current, total])

  if (total === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-slate-400 text-xs italic">Aún no hay comentarios. ¡Sé el primero!</p>
      </div>
    )
  }

  const r = resenas[current]

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  }

  return (
    <div>
      <div className="flex gap-0.5 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} fill={i < (r.estrellas || 5) ? "#ffee0c" : "none"} stroke="#ffee0c" className="shrink-0" />
        ))}
      </div>

      <div className="relative overflow-hidden min-h-[90px]">
        <div className="absolute -top-0.5 -left-0.5 text-4xl font-black text-[#ffee0c]/25 leading-none select-none">"</div>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="pt-3"
          >
            <p className="text-slate-700 text-xs leading-relaxed font-medium mb-3">{r.comentario}</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] flex items-center justify-center text-white font-black text-[10px] shrink-0 uppercase">
                {r.nombre?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-[#0369a1] font-bold text-[11px] leading-none">{r.nombre}</p>
                <p className="text-slate-400 text-[9px] mt-0.5 font-bold uppercase">Visitante</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-1.5">
          {resenas.map((_, i) => (
            <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-1.5 bg-[#ffee0c]" : "w-1.5 h-1.5 bg-slate-200 hover:bg-slate-300"}`}
            />
          ))}
        </div>
        <div className="flex gap-1">
          <button onClick={() => goTo(current - 1, -1)}
            className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-all hover:scale-110">
            <ChevronLeft size={14} className="text-slate-400" />
          </button>
          <button onClick={() => goTo(current + 1, 1)}
            className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-all hover:scale-110">
            <ChevronRight size={14} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Modal de Feedback ────────────────────────────────────
function FeedbackModal({ open, onClose, onRefresh }) {
  const [nombre, setNombre] = useState("")
  const [comentario, setComentario] = useState("")
  const [estrellas, setEstrellas] = useState(5)
  const [estado, setEstado] = useState("idle")

  const camposCompletos = nombre.trim() !== "" && comentario.trim() !== ""

  const enviar = async () => {
    if (!camposCompletos) return
    try {
      setEstado("loading")
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resenas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, comentario, estrellas }),
      })
      if (!res.ok) throw new Error()
      setEstado("enviado")
      onRefresh() 
      setTimeout(() => { onClose(); reset() }, 2000)
    } catch { setEstado("error") }
  }

  const reset = () => { setEstado("idle"); setNombre(""); setComentario(""); setEstrellas(5) }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 overflow-hidden pointer-events-auto">
              <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-gradient-to-br from-[#0ea5e1]/10 to-[#1ed760]/10" />
              
              <div className="flex items-start justify-between mb-6 relative">
                <div>
                  <h3 className="font-black text-[var(--color-primary-dark)] text-xl leading-tight">¿Qué te parece el sitio?</h3>
                  <p className="text-slate-500 text-sm mt-1">Déjanos tu opinión para seguir mejorando.</p>
                </div>
                <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
                  <X size={16} className="text-slate-500" />
                </button>
              </div>

              <div className="flex flex-col gap-4 relative">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Tu Calificación</label>
                  <div className="flex gap-2 justify-center py-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setEstrellas(s)} className="cursor-pointer transition-transform hover:scale-125">
                        <Star size={24} fill={s <= estrellas ? "#ffee0c" : "none"} stroke="#ffee0c" strokeWidth={1} />
                      </button>
                    ))}
                  </div>
                </div>

                <input value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" placeholder="Tu nombre"
                  className="w-full border border-slate-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 bg-slate-50" />
                
                <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="¿Qué te gusta o qué mejorarías?" 
                  rows={3} className="w-full border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 bg-slate-50 resize-none" />

                {estado === "enviado" ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
                    <p className="text-[var(--color-green)] font-bold">¡Gracias por tu comentario!</p>
                  </motion.div>
                ) : (
                  <button onClick={enviar} disabled={!camposCompletos || estado === "loading"}
                    className={`font-bold py-3.5 rounded-full text-white text-sm transition-all ${camposCompletos ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] cursor-pointer shadow-md" : "bg-slate-200"}`}>
                    {estado === "loading" ? "Enviando..." : "Enviar opinión"}
                  </button>
                )}
                {estado === "error" && <p className="text-red-500 text-center text-xs">Error al enviar. Intenta de nuevo.</p>}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── COMPONENTE PRINCIPAL DE RESEÑAS ───────────────────────────────────
function Resenas() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [resenas, setResenas] = useState([])
  const [visitorVisible, setVisitorVisible] = useState(false)
  const [realVisits, setRealVisits] = useState(0)
  const hasIncremented = useRef(false)

  const count = useCountUp(realVisits, 2500, visitorVisible)

  const fetchResenas = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resenas`)
      const data = await res.json()
      setResenas(data)
    } catch (err) { console.error(err) }
  }

  const handleVisits = async () => {
    try {
      // 1. Obtener visitas actuales
      const resGet = await fetch(`${import.meta.env.VITE_API_URL}/api/visits`)
      const dataGet = await resGet.json()
      setRealVisits(dataGet.count || 0)

      // 2. Incrementar solo una vez por sesión de componente
      if (!hasIncremented.current) {
        const resPost = await fetch(`${import.meta.env.VITE_API_URL}/api/visits/increment`, { method: "POST" })
        const dataPost = await resPost.json()
        if (dataPost.count) setRealVisits(dataPost.count)
        hasIncremented.current = true
      }
    } catch (err) { console.error("Error en visitas:", err) }
  }

  useEffect(() => {
    fetchResenas()
    handleVisits()
  }, [])

  useEffect(() => {
    if (drawerOpen) {
      setVisitorVisible(true)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [drawerOpen])

  return (
    <>
      {/* ── Tab flotante en el borde derecho ── */}
      <motion.button
        id="hero-drawer-tab"
        onClick={() => setDrawerOpen(!drawerOpen)}
        whileHover={{ x: drawerOpen ? 0 : -4, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[-4px_0_15px_rgba(0,0,0,0.1)] border-l-2 border-y-2 border-[var(--color-primary)]/40 bg-white"
        style={{
          borderRadius: "14px 0 0 14px",
          width: "40px",
          padding: "18px 8px",
        }}
      >
        <div className="mb-1">
          {drawerOpen
            ? <ChevronRight size={18} className="text-[var(--color-primary)]" />
            : <ChevronLeft size={18} className="text-[var(--color-primary)]" />
          }
        </div>
        <span
          className="text-[var(--color-primary-dark)] font-black uppercase tracking-[0.15em]"
          style={{ fontSize: "10px", writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Feedback
        </span>
      </motion.button>

      {/* ── Drawer lateral ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[101] bg-black/20"
            />

          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-1/2 right-0 z-[102] -translate-y-1/2 flex items-center"
          >
            <div
              className="w-[310px] h-auto max-h-[90vh] flex flex-col gap-4 p-6 overflow-y-auto bg-white shadow-[-15px_0_40px_rgba(0,0,0,0.1)] border-l-2 border-y-2 border-[var(--color-primary)]/20 rounded-l-[2.5rem] scrollbar-thin scrollbar-thumb-[var(--color-primary)]/20 scrollbar-track-transparent"
            >
              {/* Cabecera del Panel */}
              <div className="flex items-center justify-between mb-1">
                <span className="inline-block text-[var(--color-primary-dark)] font-black tracking-[0.2em] uppercase text-[9px] py-1.5 px-4 bg-[var(--color-primary)]/10 rounded-xl border border-[var(--color-primary)]/20">
                  Retroalimentación
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-all cursor-pointer group"
                >
                  <X size={14} className="text-slate-400 group-hover:text-[var(--color-primary)]" />
                </button>
              </div>

              {/* Contador visitantes */}
              <div className="flex items-center gap-3 bg-[var(--color-bg-soft)] border border-[var(--color-primary)]/15 rounded-2xl px-4 py-4">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-green)] rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <p className="text-[var(--color-primary-dark)] font-black text-2xl leading-none">
                    {visitorVisible ? count.toLocaleString("es-PE") : "···"}
                  </p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">
                    Visitas en vivo
                  </p>
                </div>
              </div>

              {/* Slider de Comentarios */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4 text-center">Opiniones de la web</p>
                <FeedbackSlider resenas={resenas} />
              </div>

              {/* Botón de opinión - Clon exacto de la estética del Navbar */}
              <motion.button
                onClick={() => { setDrawerOpen(false); setFeedbackOpen(true) }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full relative group flex items-center justify-center bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] p-[2px] rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                <div className="flex items-center justify-center w-full h-full bg-transparent group-hover:bg-white rounded-full py-3.5 transition-all duration-300 overflow-hidden relative">
                  {/* Shimmer */}
                  <span className="absolute inset-0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                  
                  <div className="flex items-center gap-2 relative z-10 transition-colors duration-300">
                    <MessageSquare 
                      size={18} 
                      className="text-white group-hover:text-[#0ea5e1] transition-colors" 
                    />
                    <span className="text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#0ea5e1] group-hover:to-[#1ed760] font-black text-sm transition-all">
                      Danos tu opinión
                    </span>
                  </div>
                </div>
              </motion.button>

              <p className="text-slate-300 text-[8px] text-center font-bold uppercase tracking-widest">
                Protección de datos garantizada
              </p>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} onRefresh={fetchResenas} />
    </>
  )
}

export default Resenas
