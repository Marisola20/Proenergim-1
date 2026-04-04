import { useState, useEffect } from "react"
import { LogOut, Trash2, FileText, Users, MessageSquare, RefreshCw } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL
const ADMIN_PASS = "proenergim2024" // ← cámbiala por tu contraseña

export default function Admin() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem("admin_auth") === "true")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [leads, setLeads] = useState([])
  const [chatLeads, setChatLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState("leads") // leads | chat

  // ── Login ──
  const handleLogin = () => {
    if (password === ADMIN_PASS) {
      sessionStorage.setItem("admin_auth", "true")
      setAuth(true)
      setError("")
    } else {
      setError("Contraseña incorrecta!")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth")
    setAuth(false)
  }

  // ── Cargar datos ──
  const cargarLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/leads`)
      const data = await res.json()
      setLeads(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const cargarChatLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/chat-leads`)
      const data = await res.json()
      setChatLeads(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (auth) {
      cargarLeads()
      cargarChatLeads()
    }
  }, [auth])

  // ── Limpiar BD ──
  const limpiarLeads = async () => {
    if (!confirm("¿Segura que quieres limpiar todos los leads del formulario?")) return
    await fetch(`${API_URL}/api/leads`, { method: "DELETE" })
    setLeads([])
  }

  const limpiarChatLeads = async () => {
    if (!confirm("¿Segura que quieres limpiar todos los leads del chat?")) return
    await fetch(`${API_URL}/api/chat-leads`, { method: "DELETE" })
    setChatLeads([])
  }

  // ── Exportar CSV ──
  const exportarCSV = (data, nombre) => {
    const encabezado = Object.keys(data[0] || {}).join(",")
    const filas = data.map(d => Object.values(d).map(v => `"${v}"`).join(",")).join("\n")
    const csv = "\uFEFF" + encabezado + "\n" + filas
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${nombre}_${new Date().toLocaleDateString("es-PE")}.csv`
    a.click()
  }

  // ── LOGIN ──
  if (!auth) {
    return (
      <div className="min-h-screen bg-[#031e32] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0ea5e1]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#0ea5e1]" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1 className="text-2xl font-black text-[#031e32]">Panel Admin</h1>
            <p className="text-slate-500 text-sm mt-1">Proenergim E.I.R.L.</p>
          </div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            className="w-full border border-slate-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e1] mb-3"
          />
          {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-[#0ea5e1] hover:bg-[#0284c7] text-white font-black py-3.5 rounded-full transition-all"
          >
            Ingresar
          </button>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ──
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#031e32] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-black text-lg">Panel Admin</h1>
          <p className="text-white/50 text-xs">Proenergim E.I.R.L.</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-bold transition-all">
          <LogOut size={16} /> Salir
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#0ea5e1]/10 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-[#0ea5e1]" />
              </div>
              <p className="text-slate-500 text-sm font-bold">Leads Formulario</p>
            </div>
            <p className="text-4xl font-black text-[#031e32]">{leads.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#1ed760]/10 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} className="text-[#1ed760]" />
              </div>
              <p className="text-slate-500 text-sm font-bold">Leads Chat</p>
            </div>
            <p className="text-4xl font-black text-[#031e32]">{chatLeads.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("leads")}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${tab === "leads" ? "bg-[#031e32] text-white" : "bg-white text-slate-500 border border-slate-200"}`}
          >
            Formulario ({leads.length})
          </button>
          <button
            onClick={() => setTab("chat")}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${tab === "chat" ? "bg-[#031e32] text-white" : "bg-white text-slate-500 border border-slate-200"}`}
          >
            Chat ({chatLeads.length})
          </button>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => tab === "leads" ? cargarLeads() : cargarChatLeads()}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 font-bold text-sm px-4 py-2.5 rounded-full hover:bg-slate-50 transition-all"
          >
            <RefreshCw size={15} /> Actualizar
          </button>
          <button
            onClick={() => exportarCSV(tab === "leads" ? leads : chatLeads, tab === "leads" ? "leads_formulario" : "leads_chat")}
            className="flex items-center gap-2 bg-[#0ea5e1] text-white font-bold text-sm px-4 py-2.5 rounded-full hover:bg-[#0284c7] transition-all"
          >
            <FileText size={15} /> Exportar CSV
          </button>
          <button
            onClick={() => tab === "leads" ? limpiarLeads() : limpiarChatLeads()}
            className="flex items-center gap-2 bg-red-500 text-white font-bold text-sm px-4 py-2.5 rounded-full hover:bg-red-600 transition-all"
          >
            <Trash2 size={15} /> Limpiar BD
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-bold">Cargando...</div>
          ) : tab === "leads" ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 font-black text-slate-500 text-xs uppercase tracking-wider">Nombre</th>
                  <th className="text-left px-6 py-4 font-black text-slate-500 text-xs uppercase tracking-wider">Teléfono</th>
                  <th className="text-left px-6 py-4 font-black text-slate-500 text-xs uppercase tracking-wider">Correo</th>
                  <th className="text-left px-6 py-4 font-black text-slate-500 text-xs uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-slate-400 font-bold">Sin leads aún</td></tr>
                ) : leads.map((l, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#031e32]">{l.nombre}</td>
                    <td className="px-6 py-4 text-slate-600">{l.telefono || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{l.empresa || "-"}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{new Date(l.fecha).toLocaleString("es-PE")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 font-black text-slate-500 text-xs uppercase tracking-wider">Nombre</th>
                  <th className="text-left px-6 py-4 font-black text-slate-500 text-xs uppercase tracking-wider">Ciudad</th>
                  <th className="text-left px-6 py-4 font-black text-slate-500 text-xs uppercase tracking-wider">Tema</th>
                  <th className="text-left px-6 py-4 font-black text-slate-500 text-xs uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {chatLeads.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-slate-400 font-bold">Sin leads aún</td></tr>
                ) : chatLeads.map((l, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#031e32]">{l.nombre}</td>
                    <td className="px-6 py-4 text-slate-600">{l.ciudad || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{l.tema || "-"}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{new Date(l.fecha).toLocaleString("es-PE")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}