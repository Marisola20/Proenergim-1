import { useState, useEffect } from "react"
import { LogOut, Trash2, FileText, Users, MessageSquare, RefreshCw, Eye, EyeOff, Sun } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL
const ADMIN_PASS = "pro2026-energim"

export default function Admin() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem("admin_auth") === "true")
  const [password, setPassword] = useState("")
  const [verPass, setVerPass] = useState(false)
  const [error, setError] = useState("")
  const [leads, setLeads] = useState([])
  const [chatLeads, setChatLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState("leads")
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogin = () => {
    if (password === ADMIN_PASS) {
      sessionStorage.setItem("admin_auth", "true")
      setAuth(true)
      setError("")
    } else {
      setError("Contraseña incorrecta")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth")
    setAuth(false)
  }

  const cargarLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/leads`)
      const data = await res.json()
      setLeads(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const cargarChatLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/chat-leads`)
      const data = await res.json()
      setChatLeads(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => {
    if (auth) { cargarLeads(); cargarChatLeads() }
  }, [auth])

  const limpiarLeads = async () => {
    if (!confirm("¿Segura que quieres limpiar todos los leads del formulario?")) return
    await fetch(`${API_URL}/api/leads`, { method: "DELETE" })
    setLeads([])
    showToast("Leads del formulario eliminados ✓")
  }

  const limpiarChatLeads = async () => {
    if (!confirm("¿Segura que quieres limpiar todos los leads del chat?")) return
    await fetch(`${API_URL}/api/chat-leads`, { method: "DELETE" })
    setChatLeads([])
    showToast("Leads del chat eliminados ✓")
  }

  const exportarCSV = (data, nombre) => {
    if (!data.length) return showToast("No hay datos para exportar", "err")
    const keys = Object.keys(data[0])
    const encabezado = keys.join(",")
    const filas = data.map(d => keys.map(k => `"${d[k] ?? ""}"`).join(",")).join("\n")
    const csv = "\uFEFF" + encabezado + "\n" + filas
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${nombre}_${new Date().toLocaleDateString("es-PE").replace(/\//g, "-")}.csv`
    a.click()
    showToast("CSV exportado correctamente ✓")
  }

  const currentData = tab === "leads" ? leads : chatLeads

  // ── LOGIN ──────────────────────────────────────────────────
  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #031e32 0%, #042d4a 50%, #031e32 100%)" }}>

        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #0ea5e1 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Círculos decorativos */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #0ea5e1, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #1ed760, transparent)" }} />

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="bg-white/[0.06] backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/10 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.5)]">

            {/* Logo / Icono */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-5 shadow-lg"
                style={{ background: "linear-gradient(135deg, #0ea5e1, #1ed760)" }}>
                <Sun size={36} className="text-white" strokeWidth={2} />
              </div>
              <h1 className="text-white font-black text-2xl tracking-tight">Panel Admin</h1>
              <p className="text-white/40 text-sm font-medium mt-1">Proenergim E.I.R.L.</p>
            </div>

            {/* Input contraseña */}
            <div className="relative mb-4">
              <input
                type={verPass ? "text" : "password"}
                placeholder="Contraseña de acceso"
                value={password}
                onChange={e => { setPassword(e.target.value); setError("") }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="w-full rounded-2xl px-5 py-4 pr-12 text-sm font-medium text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#0ea5e1]/50 transition-all"
                style={{ background: "rgba(255,255,255,0.08)", border: error ? "1.5px solid rgba(239,68,68,0.5)" : "1.5px solid rgba(255,255,255,0.12)" }}
              />
              <button
                type="button"
                onClick={() => setVerPass(p => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {verPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <span className="text-red-400 text-xs font-bold">❌ {error}</span>
              </div>
            )}

            {/* Botón */}
            <button
              onClick={handleLogin}
              className="w-full py-4 rounded-2xl font-black text-white text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
              style={{ background: "linear-gradient(135deg, #0ea5e1, #1ed760)", boxShadow: "0 8px 30px -8px rgba(14,165,225,0.5)" }}
            >
              Ingresar al panel
            </button>

            <p className="text-center text-white/20 text-xs font-medium mt-6">
              Acceso restringido · Solo personal autorizado
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ──────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold text-white transition-all ${toast.type === "err" ? "bg-red-500" : "bg-[#1ed760]"}`}
          style={{ color: toast.type === "err" ? "#fff" : "#031e32" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm"
        style={{ background: "linear-gradient(135deg, #031e32, #042d4a)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0ea5e1, #1ed760)" }}>
            <Sun size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-sm tracking-tight leading-none">Proenergim</h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Panel Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-bold transition-all px-3 py-2 rounded-xl hover:bg-white/10"
        >
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Leads Formulario", value: leads.length, icon: Users, color: "#0ea5e1", bg: "#e0f2fe" },
            { label: "Leads Chat", value: chatLeads.length, icon: MessageSquare, color: "#1ed760", bg: "#dcfce7" },
            { label: "Total Leads", value: leads.length + chatLeads.length, icon: Users, color: "#8b5cf6", bg: "#f5f3ff" },
            { label: "Esta semana", value: [...leads, ...chatLeads].filter(l => {
              const d = new Date(l.fecha)
              const now = new Date()
              const diff = (now - d) / (1000 * 60 * 60 * 24)
              return diff <= 7
            }).length, icon: RefreshCw, color: "#f59e0b", bg: "#fef3c7" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <s.icon size={17} style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-3xl font-black text-[#031e32]">{s.value}</p>
              <p className="text-slate-400 text-xs font-bold mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Panel principal */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Toolbar */}
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
              {[
                { key: "leads", label: `Formulario (${leads.length})` },
                { key: "chat", label: `Chat (${chatLeads.length})` },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="px-4 py-2 rounded-xl font-black text-xs transition-all"
                  style={tab === t.key
                    ? { background: "#031e32", color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }
                    : { color: "#94a3b8" }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Acciones */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => tab === "leads" ? cargarLeads() : cargarChatLeads()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs transition-all"
              >
                <RefreshCw size={13} /> Actualizar
              </button>
              <button
                onClick={() => exportarCSV(currentData, tab === "leads" ? "leads_formulario" : "leads_chat")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #0ea5e1, #0284c7)" }}
              >
                <FileText size={13} /> Exportar CSV
              </button>
              <button
                onClick={() => tab === "leads" ? limpiarLeads() : limpiarChatLeads()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white bg-red-500 hover:bg-red-600 transition-all hover:-translate-y-0.5"
              >
                <Trash2 size={13} /> Limpiar BD
              </button>
            </div>
          </div>

          {/* Tabla */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-[#0ea5e1] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-bold">Cargando datos...</p>
            </div>
          ) : currentData.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-sm">Sin leads aún</p>
              <p className="text-slate-300 text-xs mt-1">Los leads aparecerán aquí cuando lleguen</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {tab === "leads"
                      ? ["Nombre", "Teléfono", "Correo", "Origen", "Fecha"].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">{h}</th>
                      ))
                      : ["Nombre", "Ciudad", "Tema", "Origen", "Fecha"].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">{h}</th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((l, i) => (
                    <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-black text-[#031e32] text-sm">{l.nombre || "-"}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{tab === "leads" ? (l.telefono || "-") : (l.ciudad || "-")}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm max-w-[200px] truncate">{tab === "leads" ? (l.empresa || "-") : (l.tema || "-")}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                          style={l.origen === "chat_flotante"
                            ? { background: "#dcfce7", color: "#15803d" }
                            : { background: "#e0f2fe", color: "#0369a1" }}>
                          {l.origen || "web"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs font-medium">
                        {new Date(l.fecha).toLocaleString("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer tabla */}
          {currentData.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-slate-400 text-xs font-bold">
                {currentData.length} registro{currentData.length !== 1 ? "s" : ""} encontrado{currentData.length !== 1 ? "s" : ""}
              </p>
              <p className="text-slate-300 text-xs">
                Última actualización: {new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}