import { useCallback, useState, useEffect, useMemo } from "react"
import { 
  LogOut, Trash2, FileText, Users, MessageSquare, 
  RefreshCw, Eye, EyeOff, Search, Download, CheckCircle, 
  Mail, MousePointer2, Menu, X, LayoutDashboard, Package, Pencil, Save,
  TrendingUp, TrendingDown, Calendar, BarChart3, Globe, ExternalLink, Plus, Send
} from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"

import CorreosView from "../components/CorreosView.jsx"

// Logos
import logoMovil from "../assets/logo-movile.webp"
import logoWeb from "../assets/logo-web.webp"

const API_URL = import.meta.env.VITE_API_URL || ""
const ADMIN_TOKEN_KEY = "admin_token"
const formatPrice = (price) => new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(price) || 0)

const STATUS_COLORS = {
  "Pendiente": { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
  "En Proceso": { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
  "Completado": { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
  "Cancelado": { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
}

export default function Admin() {
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem(ADMIN_TOKEN_KEY) || "")
  const [auth, setAuth] = useState(() => Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY)))
  const [password, setPassword] = useState("")
  const [verPass, setVerPass] = useState(false)
  const [error, setError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  // Verificación en dos pasos: "password" → "codigo"
  const [pasoLogin, setPasoLogin] = useState("password")
  const [codigo, setCodigo] = useState("")
  const [enviadoA, setEnviadoA] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [chartPeriod, setChartPeriod] = useState("month")
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024)
  const [toast, setToast] = useState(null)

  // Datos
  const [leads, setLeads] = useState([])
  const [chatLeads, setChatLeads] = useState([])
  const [compras, setCompras] = useState([])
  const [suscriptors, setSuscriptors] = useState([])
  const [visits, setVisits] = useState(0)
  const [visitLogs, setVisitLogs] = useState([])
  const [productos, setProductos] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [savingProduct, setSavingProduct] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Paso 1: la contraseña solo dispara el envío del código; no entrega sesión.
  const handleLogin = async () => {
    if (!password || loginLoading) return
    setLoginLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "No se pudo iniciar sesión")

      setEnviadoA(data.enviadoA || [])
      setPasoLogin("codigo")
      setPassword("")
    } catch (loginError) {
      setError(loginError.message || "Error de conexión con el servidor")
    } finally {
      setLoginLoading(false)
    }
  }

  // Paso 2: el código de 6 dígitos es lo que entrega el token.
  const handleVerificarCodigo = async () => {
    if (codigo.length !== 6 || loginLoading) return
    setLoginLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_URL}/api/admin/verificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      })
      const data = await res.json()
      if (!res.ok || !data.token) throw new Error(data.message || "No se pudo verificar el código")

      sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token)
      sessionStorage.removeItem("admin_auth")
      setAdminToken(data.token)
      setAuth(true)
      setCodigo("")
      setPasoLogin("password")
    } catch (verifyError) {
      setError(verifyError.message || "Error de conexión con el servidor")
      setCodigo("")
    } finally {
      setLoginLoading(false)
    }
  }

  const volverAContrasena = () => {
    setPasoLogin("password")
    setCodigo("")
    setError("")
    setEnviadoA([])
  }

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("admin_auth")
    sessionStorage.removeItem(ADMIN_TOKEN_KEY)
    setAdminToken("")
    setAuth(false)
  }, [])

  // Cabecera de sesión: los listados y las acciones de escritura exigen administrador
  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${adminToken}` }), [adminToken])

  const handleSesionExpirada = useCallback(() => {
    setError("Tu sesión expiró. Vuelve a iniciar sesión.")
    handleLogout()
  }, [handleLogout])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [rLeads, rChat, rCompras, rSus, rVisits, rVisitLogs, rProductos] = await Promise.all([
        fetch(`${API_URL}/api/leads`, { headers: authHeaders }),
        fetch(`${API_URL}/api/chat-leads`, { headers: authHeaders }),
        fetch(`${API_URL}/api/compra`, { headers: authHeaders }),
        fetch(`${API_URL}/api/suscriptors`, { headers: authHeaders }),
        fetch(`${API_URL}/api/visits`),
        fetch(`${API_URL}/api/visits/logs`, { headers: authHeaders }),
        fetch(`${API_URL}/api/productos/admin`, {
          headers: authHeaders,
          cache: "no-store",
        }),
      ])

      const respuestas = [rLeads, rChat, rCompras, rSus, rVisits, rVisitLogs, rProductos]

      if (respuestas.some(res => res.status === 401)) {
        handleSesionExpirada()
        throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.")
      }
      if (!respuestas.every(res => res.ok)) {
        throw new Error("No se pudieron sincronizar todos los datos")
      }

      setLeads(await rLeads.json())
      setChatLeads(await rChat.json())
      setCompras(await rCompras.json())
      setSuscriptors(await rSus.json())
      const visitData = await rVisits.json()
      setVisits(visitData.count || 0)
      setVisitLogs(await rVisitLogs.json())
      setProductos(await rProductos.json())
    } catch (e) {
      console.error(e)
      showToast(e.message || "Error de conexión con el servidor")
    }
    setLoading(false)
  }, [authHeaders, handleSesionExpirada, showToast])

  useEffect(() => {
    if (auth) fetchData()
  }, [auth, fetchData])

  const handleDelete = async (id, category) => {
    if (!window.confirm("¿Estás seguro de eliminar este registro permanentemente?")) return
    try {
      const res = await fetch(`${API_URL}/api/${category}/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      })
      if (res.status === 401) return handleSesionExpirada()
      if (res.ok) {
        showToast("Registro eliminado")
        fetchData()
      } else {
        showToast("No se pudo eliminar el registro")
      }
    } catch { showToast("Error al eliminar") }
  }

  const handleStatusChange = async (id, category, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/${category}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ estado: newStatus })
      })
      if (res.status === 401) return handleSesionExpirada()
      if (res.ok) {
        showToast("Estado actualizado")
        fetchData()
      } else {
        showToast("No se pudo actualizar el estado")
      }
    } catch { showToast("Error al actualizar") }
  }

  const handleProductFieldChange = (field, value) => {
    setEditingProduct(current => ({ ...current, [field]: value }))
  }

  const handleImageUpload = (event) => {
    event.preventDefault()
    showToast("Para subir imágenes, consulte con el administrador")
    if (event.target) event.target.value = null // Limpiar el input
  }

  const handleSaveProduct = async (event) => {
    event.preventDefault()
    if (!editingProduct || savingProduct) return

    const price = Number(editingProduct.precio)
    const warranty = Number(editingProduct.garantiaAnos)
    if (!editingProduct.titulo.trim() || !editingProduct.marca.trim() || !editingProduct.imagen.trim()) {
      return showToast("Completa el nombre, la marca y la imagen")
    }
    if (!Number.isFinite(price) || price < 0) {
      return showToast("Ingresa un precio válido")
    }

    setSavingProduct(true)
    try {
      const isNew = !editingProduct._id
      const method = isNew ? "POST" : "PUT"
      const url = isNew ? `${API_URL}/api/productos` : `${API_URL}/api/productos/${editingProduct._id}`

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          titulo: editingProduct.titulo,
          marca: editingProduct.marca,
          categoria: editingProduct.categoria,
          precio: price,
          garantiaAnos: warranty,
          imagen: editingProduct.imagen,
        }),
      })
      const updatedProduct = await res.json()
      if (res.status === 401) {
        setError("Tu sesión expiró. Vuelve a iniciar sesión.")
        handleLogout()
        return
      }
      if (!res.ok) throw new Error(updatedProduct.message || "No se pudo guardar el producto")

      if (isNew) {
        setProductos(current => [...current, updatedProduct])
        showToast("Producto creado exitosamente")
      } else {
        setProductos(current => current.map(product => (
          product._id === updatedProduct._id ? updatedProduct : product
        )))
        showToast("Producto actualizado en el catálogo")
      }
      setEditingProduct(null)
    } catch (saveError) {
      showToast(saveError.message || "Error al guardar el producto")
    } finally {
      setSavingProduct(false)
    }
  }

  const exportCSV = (dataToExport, filename) => {
    if (!dataToExport || dataToExport.length === 0) return showToast("No hay datos para exportar")
    const keys = Object.keys(dataToExport[0]).filter(k => k !== "_id" && k !== "__v" && k !== "updatedAt")
    const csvContent = [
      keys.join(";"),
      ...dataToExport.map(d => keys.map(k => {
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

  const exportPDF = async (dataToExport, title) => {
    if (!dataToExport || dataToExport.length === 0) return showToast("No hay datos para exportar")
    try {
      const doc = new jsPDF()

      // Convertir WebP a PNG via Canvas para jsPDF
      const img = new Image()
      img.src = logoWeb
      await new Promise(resolve => { img.onload = resolve; img.onerror = resolve })
      
      let imgData = null
      if (img.width > 0) {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0)
        imgData = canvas.toDataURL("image/png")
      }

      // Diseño del Header
      doc.setFillColor(25, 89, 173) // #1959ad
      doc.rect(0, 0, 210, 36, 'F')
      
      if (imgData) {
        doc.addImage(imgData, 'PNG', 14, 10, 38, 15)
      }
      
      doc.setFontSize(20)
      doc.setTextColor(255, 255, 255)
      doc.text("REPORTE OFICIAL", 196, 18, { align: "right" })
      
      doc.setFontSize(10)
      doc.text(title.toUpperCase(), 196, 26, { align: "right" })

      // Información debajo del header
      doc.setTextColor(100, 116, 139)
      doc.setFontSize(9)
      doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 46)
      
      const keys = Object.keys(dataToExport[0]).filter(k => k !== "_id" && k !== "__v" && k !== "updatedAt" && k !== "imagen" && k !== "orden")
      const rows = dataToExport.map(d => keys.map(k => {
          if (k === "fecha" || k === "createdAt") return new Date(d[k]).toLocaleDateString()
          return d[k]?.toString() ?? "-"
      }))

      autoTable(doc, {
        startY: 52,
        head: [keys.map(k => k.toUpperCase())],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: [25, 89, 173], fontSize: 9, textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { fontSize: 8, cellPadding: 4, textColor: [51, 65, 85] }
      })

      // Pie de página con numeración
      const pageCount = doc.internal.getNumberOfPages()
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184)
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text(`Página ${i} de ${pageCount} - Proenergim`, 105, 290, { align: "center" })
      }

      doc.save(`Proenergim_${title.replace(/ /g, "_")}.pdf`)
      showToast("Reporte PDF generado exitosamente")
    } catch (err) {
      showToast("Error al generar PDF")
      console.error(err)
    }
  }

  const getFilteredData = (data) => {
    if (!searchQuery) return data
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }

  // ── Helpers para gráficos ───────────────────────────────────
  const CHART_COLORS = {
    contactos: "#3b82f6",
    chat: "#10b981",
    solicitudes: "#f59e0b",
    suscriptores: "#8b5cf6",
    visitas: "#6366f1",
  }

  const PERIOD_OPTIONS = [
    { id: "month", label: "Mes" },
    { id: "2months", label: "2 Meses" },
    { id: "3months", label: "3 Meses" },
    { id: "1year", label: "1 Año" },
  ]

  const getDateField = (item) => {
    const d = item.fecha || item.createdAt
    return d ? new Date(d) : null
  }

  const chartData = useMemo(() => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Calcular rango según período
    let rangeStart, groupFn, labelFn, slots

    if (chartPeriod === "month") {
      rangeStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      groupFn = (d) => d.getDate() - 1
      slots = Array.from({ length: daysInMonth }, (_, i) => ({
        key: i, label: `${(i + 1).toString().padStart(2, "0")}`,
        contactos: 0, chat: 0, solicitudes: 0, suscriptores: 0, visitas: 0,
      }))
    } else if (chartPeriod === "2months" || chartPeriod === "3months") {
      const monthsCount = chartPeriod === "2months" ? 2 : 3
      rangeStart = new Date(now.getFullYear(), now.getMonth() - monthsCount + 1, now.getDate())
      const totalDays = Math.floor((now - rangeStart) / (1000 * 60 * 60 * 24)) + 1
      groupFn = (d) => {
        const diff = Math.floor((d - rangeStart) / (1000 * 60 * 60 * 24))
        return Math.min(Math.max(diff, 0), totalDays - 1)
      }
      slots = Array.from({ length: totalDays }, (_, i) => {
        const d = new Date(rangeStart)
        d.setDate(d.getDate() + i)
        return {
          key: i, label: `${d.getDate()}/${d.getMonth()+1}`,
          contactos: 0, chat: 0, solicitudes: 0, suscriptores: 0, visitas: 0,
        }
      })
    } else {
      // 1 year
      rangeStart = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1)
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
      groupFn = (d) => {
        const diff = (d.getFullYear() - rangeStart.getFullYear()) * 12 + (d.getMonth() - rangeStart.getMonth())
        return Math.min(Math.max(diff, 0), 11)
      }
      slots = Array.from({ length: 12 }, (_, i) => {
        const m = new Date(rangeStart)
        m.setMonth(m.getMonth() + i)
        return {
          key: i, label: monthNames[m.getMonth()],
          contactos: 0, chat: 0, solicitudes: 0, suscriptores: 0, visitas: 0,
        }
      })
    }

    const fill = (items, field) => {
      items.forEach(item => {
        const d = getDateField(item)
        if (!d || d < rangeStart || d > now) return
        const idx = groupFn(d)
        if (idx >= 0 && idx < slots.length) {
          slots[idx][field] += 1
        }
      })
    }

    fill(leads, "contactos")
    fill(chatLeads, "chat")
    fill(compras, "solicitudes")
    fill(suscriptors, "suscriptores")

    // Visitas web (visitLogs solo tienen createdAt)
    visitLogs.forEach(log => {
      const d = log.createdAt ? new Date(log.createdAt) : null
      if (!d || d < rangeStart || d > now) return
      const idx = groupFn(d)
      if (idx >= 0 && idx < slots.length) {
        slots[idx].visitas += 1
      }
    })

    // Calcular totales del período
    const totals = slots.reduce((acc, s) => ({
      contactos: acc.contactos + s.contactos,
      chat: acc.chat + s.chat,
      solicitudes: acc.solicitudes + s.solicitudes,
      suscriptores: acc.suscriptores + s.suscriptores,
      visitas: acc.visitas + s.visitas,
    }), { contactos: 0, chat: 0, solicitudes: 0, suscriptores: 0, visitas: 0 })

    return { slots, totals }
  }, [chartPeriod, leads, chatLeads, compras, suscriptors, visitLogs])

  // Tooltip personalizado con estilo glassmorphism
  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{
        background: "rgba(15, 23, 42, 0.88)",
        backdropFilter: "blur(12px)",
        borderRadius: 12,
        padding: "12px 16px",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}>
        <p style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</p>
        {payload.map((entry, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color, display: "inline-block" }} />
            <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500 }}>
              {entry.name}: <strong style={{ color: "#fff" }}>{entry.value}</strong>
            </span>
          </div>
        ))}
      </div>
    )
  }

  // ── Vistas Principales ──────────────────────────────────────

  const DashboardView = () => {
    const periodTotal = chartData.totals.contactos + chartData.totals.chat + chartData.totals.solicitudes + chartData.totals.suscriptores + chartData.totals.visitas
    const allTotal = leads.length + chatLeads.length + compras.length + suscriptors.length

    const statCards = [
      { label: "Contactos", val: leads.length, periodVal: chartData.totals.contactos, icon: Users, color: CHART_COLORS.contactos, bgLight: "#eff6ff" },
      { label: "Chat Flotante", val: chatLeads.length, periodVal: chartData.totals.chat, icon: MessageSquare, color: CHART_COLORS.chat, bgLight: "#ecfdf5" },
      { label: "Solicitudes", val: compras.length, periodVal: chartData.totals.solicitudes, icon: FileText, color: CHART_COLORS.solicitudes, bgLight: "#fffbeb" },
      { label: "Visitas Web", val: visits, periodVal: chartData.totals.visitas, icon: MousePointer2, color: CHART_COLORS.visitas, bgLight: "#eef2ff" },
    ]

    return (
      <div className="space-y-6">
        {/* ── Tarjetas de estadísticas ─────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-white p-5 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">{s.label}</p>
                  <p className="text-3xl font-extrabold text-slate-800 mt-1.5">{s.val}</p>
                  {s.periodVal !== null && (
                    <div className="flex items-center gap-1 mt-2">
                      {s.periodVal > 0 ? (
                        <TrendingUp size={14} style={{ color: CHART_COLORS.chat }} />
                      ) : (
                        <TrendingDown size={14} className="text-slate-400" />
                      )}
                      <span className="text-xs font-bold" style={{ color: s.periodVal > 0 ? CHART_COLORS.chat : "#94a3b8" }}>
                        {s.periodVal} en período
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: s.bgLight }}
                >
                  <s.icon size={22} style={{ color: s.color }} />
                </div>
              </div>
              {/* Decorative accent bar */}
              <div
                className="absolute bottom-0 left-0 h-1 rounded-b-xl"
                style={{ width: "100%", background: `linear-gradient(90deg, ${s.color}, transparent)`, opacity: 0.5 }}
              />
            </div>
          ))}
        </div>

        {/* ── Selector de Período ──────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" />
            <h3 className="text-lg font-bold text-slate-800">Actividad</h3>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1 gap-0.5">
            {PERIOD_OPTIONS.map(p => (
              <button
                key={p.id}
                onClick={() => setChartPeriod(p.id)}
                className="px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200"
                style={{
                  background: chartPeriod === p.id ? "#fff" : "transparent",
                  color: chartPeriod === p.id ? "#1e293b" : "#64748b",
                  boxShadow: chartPeriod === p.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Gráfico de Área – Actividad Total ────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h4 className="text-sm font-bold text-slate-700">Movimientos por Período</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {PERIOD_OPTIONS.find(p => p.id === chartPeriod)?.label} — Total: <strong className="text-slate-700">{periodTotal}</strong>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <BarChart3 size={14} />
              <span>Interacciones</span>
            </div>
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData.slots} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradContactos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.contactos} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.contactos} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradChat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.chat} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.chat} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSolicitudes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.solicitudes} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.solicitudes} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSuscriptores" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.suscriptores} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.suscriptores} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradVisitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.visitas} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.visitas} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#e2e8f0" }} tickLine={false}
                />
                <YAxis
                  allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="contactos" name="Contactos" stroke={CHART_COLORS.contactos} strokeWidth={2.5} fill="url(#gradContactos)" />
                <Area type="monotone" dataKey="chat" name="Chat" stroke={CHART_COLORS.chat} strokeWidth={2.5} fill="url(#gradChat)" />
                <Area type="monotone" dataKey="solicitudes" name="Solicitudes" stroke={CHART_COLORS.solicitudes} strokeWidth={2.5} fill="url(#gradSolicitudes)" />
                <Area type="monotone" dataKey="suscriptores" name="Suscriptores" stroke={CHART_COLORS.suscriptores} strokeWidth={2.5} fill="url(#gradSuscriptores)" />
                <Area type="monotone" dataKey="visitas" name="Visitas Web" stroke={CHART_COLORS.visitas} strokeWidth={2.5} fill="url(#gradVisitas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Leyenda personalizada */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
            {[
              { key: "contactos", label: "Contactos", color: CHART_COLORS.contactos },
              { key: "chat", label: "Chat", color: CHART_COLORS.chat },
              { key: "solicitudes", label: "Solicitudes", color: CHART_COLORS.solicitudes },
              { key: "suscriptores", label: "Suscriptores", color: CHART_COLORS.suscriptores },
              { key: "visitas", label: "Visitas Web", color: CHART_COLORS.visitas },
            ].map(l => (
              <div key={l.key} className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Gráfico de Barras – Comparativa ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
            <h4 className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-500" />
              Comparativa por Categoría
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              {PERIOD_OPTIONS.find(p => p.id === chartPeriod)?.label}
            </p>
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={chartData.slots} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="contactos" name="Contactos" fill={CHART_COLORS.contactos} radius={[4, 4, 0, 0]} barSize={chartPeriod === "6months" ? 16 : undefined} />
                  <Bar dataKey="chat" name="Chat" fill={CHART_COLORS.chat} radius={[4, 4, 0, 0]} barSize={chartPeriod === "6months" ? 16 : undefined} />
                  <Bar dataKey="solicitudes" name="Solicitudes" fill={CHART_COLORS.solicitudes} radius={[4, 4, 0, 0]} barSize={chartPeriod === "6months" ? 16 : undefined} />
                  <Bar dataKey="suscriptores" name="Suscriptores" fill={CHART_COLORS.suscriptores} radius={[4, 4, 0, 0]} barSize={chartPeriod === "6months" ? 16 : undefined} />
                  <Bar dataKey="visitas" name="Visitas Web" fill={CHART_COLORS.visitas} radius={[4, 4, 0, 0]} barSize={chartPeriod === "6months" ? 16 : undefined} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Panel de Resumen / Embudo ─────────────── */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
              <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <LayoutDashboard size={16} className="text-blue-500" />
                Rendimiento Global
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Interacciones Totales</p>
                  <p className="text-2xl font-extrabold text-slate-800">{leads.length + chatLeads.length + compras.length}</p>
                </div>
                <div className="bg-linear-to-br from-violet-50 to-purple-50 p-4 rounded-xl border border-violet-100">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Suscriptores</p>
                  <p className="text-2xl font-extrabold text-slate-800">{suscriptors.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
              <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                Embudo de Estados
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Pendientes", estado: "Pendiente", color: "#f59e0b", bg: "from-amber-50 to-orange-50", border: "border-amber-100" },
                  { label: "En Proceso", estado: "En Proceso", color: "#3b82f6", bg: "from-blue-50 to-sky-50", border: "border-blue-100" },
                  { label: "Completados", estado: "Completado", color: "#10b981", bg: "from-emerald-50 to-teal-50", border: "border-emerald-100" },
                  { label: "Cancelados", estado: "Cancelado", color: "#ef4444", bg: "from-red-50 to-rose-50", border: "border-red-100" },
                ].map(st => {
                  const count = [...leads, ...chatLeads, ...compras].filter(i => i.estado === st.estado).length
                  const total = leads.length + chatLeads.length + compras.length
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={st.estado} className={`bg-linear-to-r ${st.bg} p-3.5 rounded-xl ${st.border} border`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-600">{st.label}</span>
                        <span className="text-xs font-bold" style={{ color: st.color }}>{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${pct}%`, background: st.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
            <button onClick={() => exportCSV(filtered, title.toLowerCase())} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#1959ad] text-white rounded-lg font-semibold text-sm hover:bg-[#124180] transition-colors shadow-sm">
                <Download size={16} /> Exportar CSV
            </button>
            <button onClick={() => exportPDF(filtered, title)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors">
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

  const ProductsView = () => {
    const filtered = getFilteredData(productos)
    return (
      <>
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Catálogo de productos</h3>
              <p className="text-sm text-slate-500 mt-1">
                {productos.length} productos. Los cambios se publican al guardar y el catálogo los recarga al abrirlo o volver a la pestaña.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              <div className="relative w-full sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setEditingProduct({ titulo: "", marca: "", categoria: "variadores", precio: 0, garantiaAnos: 2, imagen: "" })}
                className="flex items-center justify-center gap-2 bg-[#1959ad] hover:bg-[#124180] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <Plus size={18} /> Añadir Producto
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Producto</th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Marca</th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Precio</th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Garantía</th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map(product => (
                  <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-80">
                        <img
                          src={product.imagen}
                          alt=""
                          className="w-12 h-12 rounded-lg border border-slate-200 bg-white object-cover shrink-0"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{product.titulo}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{product.codigo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600">
                      {product.categoria === "variadores" ? "Variadores" : "Accesorios"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600">{product.marca}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-bold text-emerald-700">
                      S/. {formatPrice(product.precio)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-center text-sm text-slate-600">
                      {product.garantiaAnos} años
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...product })}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors"
                      >
                        <Pencil size={16} /> Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-slate-500">
                <Search size={32} className="mx-auto mb-3 text-slate-300" />
                <p>No se encontraron productos.</p>
              </div>
            )}
          </div>
        </div>

        {editingProduct && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 p-4"
            onMouseDown={event => event.target === event.currentTarget && setEditingProduct(null)}
          >
            <form
              onSubmit={handleSaveProduct}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
                aria-label="Cerrar"
              >
                <X size={22} />
              </button>
              <div className="pr-10 mb-6">
                <h3 className="text-xl font-bold text-slate-800">Editar producto</h3>
                <p className="text-sm text-slate-500 mt-1">Código {editingProduct.codigo}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="md:col-span-2 text-sm font-semibold text-slate-700">
                  Nombre del producto
                  <textarea
                    rows={2}
                    maxLength={180}
                    value={editingProduct.titulo}
                    onChange={event => handleProductFieldChange("titulo", event.target.value)}
                    className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </label>

                <label className="text-sm font-semibold text-slate-700">
                  Categoría
                  <select
                    value={editingProduct.categoria}
                    onChange={event => handleProductFieldChange("categoria", event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="variadores">Variadores de frecuencia solar</option>
                    <option value="accesorios">Accesorios eléctricos</option>
                  </select>
                </label>

                <label className="text-sm font-semibold text-slate-700">
                  Marca
                  <input
                    type="text"
                    maxLength={80}
                    value={editingProduct.marca}
                    onChange={event => handleProductFieldChange("marca", event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </label>

                <label className="text-sm font-semibold text-slate-700">
                  Precio en soles
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingProduct.precio}
                    onChange={event => handleProductFieldChange("precio", event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </label>

                <label className="text-sm font-semibold text-slate-700">
                  Garantía en años
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="1"
                    value={editingProduct.garantiaAnos}
                    onChange={event => handleProductFieldChange("garantiaAnos", event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </label>

                <div className="md:col-span-2">
                  <span className="block text-sm font-semibold text-slate-700 mb-2">Imagen del producto</span>
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="w-full text-center rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition-colors"
                  >
                    Actualizar imagen...
                  </button>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60"
                >
                  {savingProduct ? <RefreshCw size={17} className="animate-spin" /> : <Save size={17} />}
                  {savingProduct ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        )}
      </>
    )
  }

  // ── Listado de Navegación ──────────────────────────────────
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "Formularios", icon: Users, category: "leads" },
    { id: "chat", label: "Chat Flotante", icon: MessageSquare, category: "chat-leads" },
    { id: "compras", label: "Solicitudes", icon: FileText, category: "compra" },
    { id: "productos", label: "Productos", icon: Package, category: "productos" },
    { id: "suscriptors", label: "Suscriptores", icon: Mail, category: "suscriptors" },
    { id: "correos", label: "Correos", icon: Send },
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
              <p className="text-sm text-slate-500 mt-1">
                {pasoLogin === "password" ? "Ingreso seguro Proenergim" : "Verificación en dos pasos"}
              </p>
           </div>

           {pasoLogin === "password" ? (
             <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
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
                  disabled={loginLoading}
                  className="w-full py-3 bg-[#1959ad] text-white rounded-lg font-bold hover:bg-[#124180] transition-colors disabled:opacity-60"
                >
                  {loginLoading ? "Enviando código..." : "Continuar"}
                </button>
             </div>
           ) : (
             <div className="space-y-5">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Enviamos un código de 6 dígitos a
                    {enviadoA.length > 0
                      ? <span className="font-semibold text-blue-800"> {enviadoA.join(", ")}</span>
                      : " el correo autorizado"}.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Caduca en 10 minutos y solo sirve una vez.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Código de verificación</label>
                  <input
                    autoFocus
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={codigo}
                    onChange={e => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={e => e.key === "Enter" && handleVerificarCodigo()}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-3xl font-bold tracking-[0.5em] text-slate-800"
                  />
                  {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
                </div>

                <button
                  onClick={handleVerificarCodigo}
                  disabled={loginLoading || codigo.length !== 6}
                  className="w-full py-3 bg-[#1959ad] text-white rounded-lg font-bold hover:bg-[#124180] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loginLoading ? "Verificando..." : "Entrar al panel"}
                </button>

                <button
                  onClick={volverAContrasena}
                  className="w-full text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Volver e intentar de nuevo
                </button>
             </div>
           )}
        </div>
      </div>
    )
  }

  // ── Layout Principal Sólido ─────────────────────────────────
  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* Toast Notification Premium */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-9999 bg-[#1959ad] text-white px-6 py-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(25,89,173,0.6)] flex items-center gap-4 border border-white/20 transform transition-all duration-500 ease-out animate-bounce">
          <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-md">
            <CheckCircle size={22} className="text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-wide drop-shadow-sm">{toast}</span>
        </div>
      )}

      {/* Overlay Móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Azul (Brand Color) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1959ad] transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-16 flex items-center justify-center bg-white border-b border-slate-200 shrink-0 shadow-sm">
          <img src={logoWeb} alt="Proenergim" className="h-10 w-auto object-contain" />
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    active ? "bg-white/20 text-white shadow-sm" : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon size={20} className={active ? "text-white" : "text-blue-200"} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="px-4 pb-4 shrink-0">
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-bold text-white bg-white/10 hover:bg-red-500 hover:shadow-md border border-white/20"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Área Principal (Independiente) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Superior */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-slate-200/80 shrink-0">
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
            <div className="hidden md:flex flex-col text-right mr-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                {currentTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <a 
              href="/" 
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md border border-blue-200"
            >
               <Globe size={16} /> Ver Sitio Web <ExternalLink size={14} className="opacity-50 ml-1" />
            </a>

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
            {activeTab === "productos" && <ProductsView />}
            {activeTab === "suscriptors" && (
              <TableView title="Email Suscriptores" category="suscriptors" data={suscriptors}
                columns={[
                  { key: "email", label: "Dirección de Correo", render: (v) => <span className="font-medium text-slate-800">{v}</span> },
                  { key: "createdAt", label: "Fecha Suscripción", render: (v) => <span>{new Date(v).toLocaleDateString()}</span> },
                ]}
              />
            )}
            {activeTab === "correos" && (
              <CorreosView
                suscriptors={suscriptors}
                adminToken={adminToken}
                showToast={showToast}
                onSesionExpirada={handleLogout}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
