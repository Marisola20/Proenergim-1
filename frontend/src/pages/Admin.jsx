import { useState, useEffect } from "react"
import { 
  LogOut, Trash2, FileText, Users, MessageSquare, 
  RefreshCw, Eye, EyeOff, Search, Download, CheckCircle, 
  Mail, MousePointer2, Menu, X, LayoutDashboard 
} from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

// Logos
import logoMovil from "../assets/logo-movile.webp"

const API_URL = import.meta.env.VITE_API_URL
const ADMIN_PASS = "pro2026-energim"

const STATUS_COLORS = {
  "Pendiente": { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
  "En Proceso": { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
  "Completado": { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
  "Cancelado": { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
}

export default function Admin() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem("admin_auth") === "true")
  const [password, setPassword] = useState("")
  const [verPass, setVerPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024)
  const [toast, setToast] = useState(null)

  // Datos
  const [leads, setLeads] = useState([])
  const [chatLeads, setChatLeads] = useState([])
  const [compras, setCompras] = useState([])
  const [suscriptors, setSuscriptors] = useState([])
  const [visits, setVisits] = useState(0)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // Redimensionamiento Responsivo Estándar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

  const fetchData = async () => {
    setLoading(true)
    try {
      const [rLeads, rChat, rCompras, rSus, rVisits] = await Promise.all([
        fetch(`${API_URL}/api/leads`),
        fetch(`${API_URL}/api/chat-leads`),
        fetch(`${API_URL}/api/compra`),
        fetch(`${API_URL}/api/suscriptors`),
        fetch(`${API_URL}/api/visits`)
      ])
      
      setLeads(await rLeads.json())
      setChatLeads(await rChat.json())
      setCompras(await rCompras.json())
      setSuscriptors(await rSus.json())
      const visitData = await rVisits.json()
      setVisits(visitData.count || 0)
    } catch (e) {
      console.error(e)
      showToast("Error de conexión con el servidor")
    }
    setLoading(false)
  }

  useEffect(() => {
    if (auth) fetchData()
  }, [auth])

  const handleDelete = async (id, category) => {
    if (!window.confirm("¿Estás seguro de eliminar este registro permanentemente?")) return
    try {
      const res = await fetch(`${API_URL}/api/${category}/${id}`, { method: "DELETE" })
      if (res.ok) {
        showToast("Registro eliminado")
        fetchData()
      }
    } catch (e) { showToast("Error al eliminar") }
  }

  const handleStatusChange = async (id, category, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/${category}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newStatus })
      })
      if (res.ok) {
        showToast("Estado actualizado")
        fetchData()
      }
    } catch (e) { showToast("Error al actualizar") }
  }

  const exportCSV = (data, filename) => {
    if (!data.length) return showToast("No hay datos para exportar")
    const keys = Object.keys(data[0]).filter(k => k !== "_id" && k !== "__v" && k !== "updatedAt")
    const csvContent = [
      keys.join(";"),
      ...data.map(d => keys.map(k => {
        const val = d[k] ?? ""
        const cleanVal = String(val).replace(/\n/g, " ").replace(/"/g, '""')
        return `"${cleanVal}"`
      }).join(";"))
    ].join("\n")
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()
    showToast("Archivo CSV descargado")
  }

  const exportPDF = async (data, title) => {
    if (!data.length) return showToast("No hay datos para exportar")
    try {
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.setTextColor(30, 41, 59) // slate-800
      doc.text("Reporte: " + title.toUpperCase(), 14, 20)
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(`Fecha de exportación: ${new Date().toLocaleString()}`, 14, 28)
      
      const keys = Object.keys(data[0]).filter(k => k !== "_id" && k !== "__v" && k !== "updatedAt")
      const rows = data.map(d => keys.map(k => {
          if (k === "fecha" || k === "createdAt") return new Date(d[k]).toLocaleDateString()
          return d[k]?.toString() ?? "-"
      }))

      autoTable(doc, {
        startY: 35,
        head: [keys.map(k => k.toUpperCase())],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], fontSize: 9 } // Slate 900 header
      })
      doc.save(`Proenergim_${title.replace(/\s+/g, '_')}.pdf`)
      showToast("Archivo PDF descargado")
    } catch (e) { showToast("Error al generar PDF") }
  }

  const getFilteredData = (data) => {
    if (!searchQuery) return data
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }

  // ── Vistas Principales ──────────────────────────────────────

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Contactos", val: leads.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Chat Flotante", val: chatLeads.length, icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Solicitudes", val: compras.length, icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Visitas Web", val: visits, icon: MousePointer2, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">{s.label}</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{s.val}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.bg}`}>
              <s.icon size={24} className={s.color} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-blue-600" /> Rendimiento Global
          </h3>
          <div className="flex gap-8">
             <div className="flex-1 bg-slate-50 p-6 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-500 mb-2">Total Interacciones</p>
                <p className="text-4xl font-bold text-slate-800">{leads.length + chatLeads.length + compras.length}</p>
             </div>
             <div className="flex-1 bg-slate-50 p-6 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-500 mb-2">Total Suscriptores</p>
                <p className="text-4xl font-bold text-slate-800">{suscriptors.length}</p>
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle size={20} className="text-emerald-600" /> Embudo de Estados
          </h3>
          <div className="flex gap-8">
             <div className="flex-1">
                <p className="text-sm font-semibold text-slate-500 mb-2 border-b border-slate-100 pb-2">Pendientes de Acción</p>
                <p className="text-3xl font-bold text-amber-500">
                  {[...leads, ...chatLeads, ...compras].filter(i => i.estado === "Pendiente").length}
                </p>
             </div>
             <div className="flex-1">
                <p className="text-sm font-semibold text-slate-500 mb-2 border-b border-slate-100 pb-2">Gestiones Completadas</p>
                <p className="text-3xl font-bold text-emerald-500">
                  {[...leads, ...chatLeads, ...compras].filter(i => i.estado === "Completado").length}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )

  const TableView = ({ title, data, category, columns }) => {
    const filtered = getFilteredData(data)
    return (
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Buscar en ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => exportCSV(data, title.toLowerCase())} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-semibold text-sm hover:bg-slate-700 transition-colors">
                <Download size={16} /> Exportar CSV
            </button>
            <button onClick={() => exportPDF(data, title)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors">
                <FileText size={16} /> Descargar PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {columns.map(c => (
                  <th key={c.key} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.label}</th>
                ))}
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Manejo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filtered.map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-slate-50 transition-colors">
                  {columns.map(c => (
                    <td key={c.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {c.render ? c.render(item[c.key], item) : (
                         item[c.key] || <span className="text-slate-300">-</span>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                      value={item.estado || "Pendiente"}
                      onChange={(e) => handleStatusChange(item._id, category, e.target.value)}
                      className="text-xs font-medium rounded px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      style={{
                        backgroundColor: STATUS_COLORS[item.estado || "Pendiente"]?.bg,
                        color: STATUS_COLORS[item.estado || "Pendiente"]?.text,
                      }}
                    >
                      {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button 
                      onClick={() => handleDelete(item._id, category)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Eliminar Registro"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <Search size={32} className="mx-auto mb-3 text-slate-300" />
              <p>No se encontraron resultados.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Listado de Navegación ──────────────────────────────────
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "Formularios", icon: Users, category: "leads" },
    { id: "chat", label: "Chat Flotante", icon: MessageSquare, category: "chat-leads" },
    { id: "compras", label: "Solicitudes", icon: FileText, category: "compra" },
    { id: "suscriptors", label: "Suscriptores", icon: Mail, category: "suscriptors" },
  ]

  // ── Pantalla de Login Limpia ────────────────────────────────
  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
           <div className="text-center mb-8">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <img src={logoMovil} alt="Logo" className="w-10 h-10 object-contain drop-shadow" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Panel Administrativo</h1>
              <p className="text-sm text-slate-500 mt-1">Ingreso seguro Proenergim</p>
           </div>
           
           <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Código de Acceso</label>
                <div className="relative">
                  <input 
                    type={verPass ? "text" : "password"}
                    placeholder="Ingresa la contraseña maestra..."
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12 text-slate-800"
                  />
                  <button onClick={() => setVerPass(!verPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {verPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
              </div>
              <button 
                onClick={handleLogin} 
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Inicar Sesión
              </button>
           </div>
        </div>
      </div>
    )
  }

  // ── Layout Principal Sólido ─────────────────────────────────
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Toast Notification Minimalista */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-100 bg-slate-800 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Overlay Móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Clásico Fijo */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <img src={logoMovil} alt="Proenergim" className="h-8 w-auto mr-3" />
          <span className="font-black text-xl text-slate-800 tracking-tight">PROENERGIM</span>
        </div>

        <div className="h-[calc(100vh-4rem)] flex flex-col justify-between py-4">
          <nav className="px-4 space-y-1">
            {navItems.map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { 
                    setActiveTab(item.id); 
                    setSearchQuery("");
                    if(window.innerWidth <= 1024) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                    active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon size={20} className={active ? "text-blue-600" : "text-slate-400"} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="px-4 pb-4">
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Área Principal (Independiente) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Superior Limpio */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {activeTab === "dashboard" ? "Panel General" : activeTab.replace("-", " ")}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={fetchData} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
               <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Sincronizar
            </button>
            <div className="hidden sm:flex items-center gap-2">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
               </span>
               <span className="text-xs font-semibold text-slate-500 uppercase">Online</span>
            </div>
          </div>
        </header>

        {/* Zona de Contenido Scrolleable */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-350 mx-auto pb-12">
            {activeTab === "dashboard" && <DashboardView />}
            {activeTab === "leads" && (
              <TableView title="Formularios de Contacto" category="leads" data={leads}
                columns={[
                  { key: "nombre", label: "Nombre" },
                  { key: "telefono", label: "Teléfono" },
                  { key: "empresa", label: "Empresa", render: (v) => <span className="font-semibold text-blue-700">{v || "-"}</span> },
                  { key: "mensaje", label: "Mensaje", render: (v) => <span className="text-slate-500 truncate max-w-xs">{v || "-"}</span> },
                  { key: "fecha", label: "Fecha", render: (v) => <span>{new Date(v).toLocaleDateString()}</span> },
                ]}
              />
            )}
            {activeTab === "chat" && (
              <TableView title="Lideres del Chat" category="chat-leads" data={chatLeads}
                columns={[
                  { key: "nombre", label: "Nombre" },
                  { key: "ciudad", label: "Ciudad" },
                  { key: "tema", label: "Tema Requerido", render: (v) => <span className="font-medium text-slate-700">{v}</span> },
                  { key: "fecha", label: "Fecha", render: (v) => <span>{new Date(v).toLocaleDateString()}</span> },
                ]}
              />
            )}
            {activeTab === "compras" && (
              <TableView title="Solicitudes de Compra" category="compra" data={compras}
                columns={[
                  { key: "producto", label: "Producto", render: (v) => <span className="font-semibold text-slate-800">{v}</span> },
                  { key: "precio", label: "Precio", render: (v) => <span className="text-emerald-700 font-bold">S/. {v}</span> },
                  { key: "nombre", label: "Cliente" },
                  { key: "celular", label: "Celular/WA" },
                  { key: "createdAt", label: "Fecha Compra", render: (v) => <span>{new Date(v).toLocaleDateString()}</span> },
                ]}
              />
            )}
            {activeTab === "suscriptors" && (
              <TableView title="Email Suscriptores" category="suscriptors" data={suscriptors}
                columns={[
                  { key: "email", label: "Dirección de Correo", render: (v) => <span className="font-medium text-slate-800">{v}</span> },
                  { key: "createdAt", label: "Fecha Suscripción", render: (v) => <span>{new Date(v).toLocaleDateString()}</span> },
                ]}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}