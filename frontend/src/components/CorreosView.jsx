import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Send, Save, Trash2, FileText, Eye, X, Search, CheckCircle,
  AlertTriangle, History, PenLine, Loader2, Plus
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL || ""

const ESTADOS = ["Pendiente", "En Proceso", "Completado", "Cancelado"]

// Variables que el backend sabe reemplazar por los datos del suscriptor
const VARIABLES = [
  { clave: "{{email}}", ayuda: "Correo del suscriptor" },
  { clave: "{{estado}}", ayuda: "Estado en la lista" },
  { clave: "{{fecha}}", ayuda: "Fecha en que se suscribió" },
]

const ESTADO_CHIP = {
  "Pendiente": "bg-amber-50 text-amber-800 border-amber-200",
  "En Proceso": "bg-blue-50 text-blue-800 border-blue-200",
  "Completado": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Cancelado": "bg-red-50 text-red-800 border-red-200",
}

export default function CorreosView({ suscriptors = [], adminToken, showToast, onSesionExpirada }) {
  const [vista, setVista] = useState("redactar")

  // Redacción
  const [asunto, setAsunto] = useState("")
  const [cuerpo, setCuerpo] = useState("")
  const cuerpoRef = useRef(null)

  // Plantillas
  const [plantillas, setPlantillas] = useState([])
  const [plantillaActiva, setPlantillaActiva] = useState("")
  const [guardando, setGuardando] = useState(false)

  // Destinatarios
  const [seleccionados, setSeleccionados] = useState([])
  const [filtroEstado, setFiltroEstado] = useState("Todos")
  const [busqueda, setBusqueda] = useState("")

  // Envío y previsualización
  const [enviando, setEnviando] = useState(false)
  const [preview, setPreview] = useState(null)
  const [cargandoPreview, setCargandoPreview] = useState(false)

  // Historial
  const [historial, setHistorial] = useState([])
  const [envioAbierto, setEnvioAbierto] = useState(null)

  // ── Peticiones autenticadas ────────────────────────────────────────────────
  const pedir = useCallback(async (ruta, opciones = {}) => {
    const res = await fetch(`${API_URL}/api/correos${ruta}`, {
      ...opciones,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
        ...opciones.headers,
      },
    })
    if (res.status === 401) {
      onSesionExpirada?.()
      throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.")
    }
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || "Error en el servidor")
    return data
  }, [adminToken, onSesionExpirada])

  const cargarPlantillas = useCallback(async () => {
    try {
      setPlantillas(await pedir("/plantillas"))
    } catch (e) {
      showToast?.(e.message)
    }
  }, [pedir, showToast])

  const cargarHistorial = useCallback(async () => {
    try {
      setHistorial(await pedir("/historial"))
    } catch (e) {
      showToast?.(e.message)
    }
  }, [pedir, showToast])

  useEffect(() => {
    cargarPlantillas()
    cargarHistorial()
  }, [cargarPlantillas, cargarHistorial])

  // ── Destinatarios visibles según filtros ───────────────────────────────────
  const visibles = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return suscriptors.filter(s => {
      const porEstado = filtroEstado === "Todos" || s.estado === filtroEstado
      const porTexto = !termino || s.email?.toLowerCase().includes(termino)
      return porEstado && porTexto
    })
  }, [suscriptors, filtroEstado, busqueda])

  const emailsVisibles = useMemo(() => visibles.map(s => s.email), [visibles])
  const todosMarcados = emailsVisibles.length > 0 && emailsVisibles.every(e => seleccionados.includes(e))

  const alternarTodos = () => {
    setSeleccionados(prev => todosMarcados
      ? prev.filter(e => !emailsVisibles.includes(e))
      : [...new Set([...prev, ...emailsVisibles])]
    )
  }

  const alternarUno = (email) => {
    setSeleccionados(prev => prev.includes(email)
      ? prev.filter(e => e !== email)
      : [...prev, email]
    )
  }

  // ── Plantillas ─────────────────────────────────────────────────────────────
  const aplicarPlantilla = (id) => {
    setPlantillaActiva(id)
    if (!id) return
    const plantilla = plantillas.find(p => p._id === id)
    if (plantilla) {
      setAsunto(plantilla.asunto)
      setCuerpo(plantilla.cuerpo)
    }
  }

  const guardarPlantilla = async () => {
    if (!asunto.trim() || !cuerpo.trim()) {
      return showToast?.("Escribe el asunto y el mensaje antes de guardar")
    }
    const nombre = window.prompt("Nombre de la plantilla:")
    if (!nombre?.trim()) return

    setGuardando(true)
    try {
      const data = await pedir("/plantillas", {
        method: "POST",
        body: JSON.stringify({ nombre: nombre.trim(), asunto, cuerpo }),
      })
      showToast?.(data.message)
      await cargarPlantillas()
      setPlantillaActiva(data.plantilla._id)
    } catch (e) {
      showToast?.(e.message)
    }
    setGuardando(false)
  }

  const actualizarPlantilla = async () => {
    if (!plantillaActiva) return
    setGuardando(true)
    try {
      const data = await pedir(`/plantillas/${plantillaActiva}`, {
        method: "PUT",
        body: JSON.stringify({ asunto, cuerpo }),
      })
      showToast?.(data.message)
      await cargarPlantillas()
    } catch (e) {
      showToast?.(e.message)
    }
    setGuardando(false)
  }

  const eliminarPlantilla = async () => {
    if (!plantillaActiva) return
    const plantilla = plantillas.find(p => p._id === plantillaActiva)
    if (!window.confirm(`¿Eliminar la plantilla "${plantilla?.nombre}"?`)) return

    try {
      const data = await pedir(`/plantillas/${plantillaActiva}`, { method: "DELETE" })
      showToast?.(data.message)
      setPlantillaActiva("")
      await cargarPlantillas()
    } catch (e) {
      showToast?.(e.message)
    }
  }

  // ── Insertar variable en la posición del cursor ────────────────────────────
  const insertarVariable = (clave) => {
    const campo = cuerpoRef.current
    if (!campo) return setCuerpo(prev => prev + clave)

    const { selectionStart: inicio, selectionEnd: fin } = campo
    setCuerpo(prev => prev.slice(0, inicio) + clave + prev.slice(fin))
    requestAnimationFrame(() => {
      campo.focus()
      campo.setSelectionRange(inicio + clave.length, inicio + clave.length)
    })
  }

  // ── Vista previa ───────────────────────────────────────────────────────────
  const previsualizar = async () => {
    if (!asunto.trim() || !cuerpo.trim()) {
      return showToast?.("Escribe el asunto y el mensaje para previsualizar")
    }
    setCargandoPreview(true)
    try {
      setPreview(await pedir("/previsualizar", {
        method: "POST",
        body: JSON.stringify({ asunto, cuerpo, email: seleccionados[0] }),
      }))
    } catch (e) {
      showToast?.(e.message)
    }
    setCargandoPreview(false)
  }

  // ── Envío ──────────────────────────────────────────────────────────────────
  const enviar = async () => {
    if (!asunto.trim() || !cuerpo.trim()) {
      return showToast?.("Escribe el asunto y el mensaje")
    }
    if (seleccionados.length === 0) {
      return showToast?.("Selecciona al menos un destinatario")
    }
    const confirmacion = seleccionados.length === 1
      ? `Se enviará el correo a ${seleccionados[0]}. ¿Continuar?`
      : `Se enviará el correo a ${seleccionados.length} suscriptores. ¿Continuar?`
    if (!window.confirm(confirmacion)) return

    setEnviando(true)
    try {
      const nombrePlantilla = plantillas.find(p => p._id === plantillaActiva)?.nombre || null
      const data = await pedir("/enviar", {
        method: "POST",
        body: JSON.stringify({ asunto, cuerpo, emails: seleccionados, plantilla: nombrePlantilla }),
      })
      showToast?.(data.message)
      await cargarHistorial()
      if (data.success) {
        setSeleccionados([])
        setVista("historial")
      }
    } catch (e) {
      showToast?.(e.message)
    }
    setEnviando(false)
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Sub-navegación */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { id: "redactar", label: "Redactar", icon: PenLine },
          { id: "historial", label: "Historial", icon: History },
        ].map(item => {
          const activo = vista === item.id
          return (
            <button
              key={item.id}
              onClick={() => setVista(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 -mb-px transition-colors ${
                activo
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <item.icon size={16} /> {item.label}
              {item.id === "historial" && historial.length > 0 && (
                <span className="text-[11px] bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
                  {historial.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {vista === "redactar" ? (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* ── Redacción ── */}
          <div className="xl:col-span-3 space-y-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              {/* Plantillas */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  Plantilla
                </label>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={plantillaActiva}
                    onChange={e => aplicarPlantilla(e.target.value)}
                    className="flex-1 min-w-48 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">— Redactar desde cero —</option>
                    {plantillas.map(p => (
                      <option key={p._id} value={p._id}>{p.nombre}</option>
                    ))}
                  </select>

                  <button
                    onClick={guardarPlantilla}
                    disabled={guardando}
                    title="Guardar lo escrito como una plantilla nueva"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
                  >
                    <Plus size={16} /> Guardar como nueva
                  </button>

                  {plantillaActiva && (
                    <>
                      <button
                        onClick={actualizarPlantilla}
                        disabled={guardando}
                        title="Sobrescribir la plantilla seleccionada"
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
                      >
                        <Save size={16} /> Actualizar
                      </button>
                      <button
                        onClick={eliminarPlantilla}
                        title="Eliminar la plantilla seleccionada"
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  Asunto
                </label>
                <input
                  value={asunto}
                  onChange={e => setAsunto(e.target.value)}
                  placeholder="Novedades de Proenergim"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Mensaje */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Mensaje
                  </label>
                  <span className="text-[11px] text-slate-400">{cuerpo.length} caracteres</span>
                </div>
                <textarea
                  ref={cuerpoRef}
                  value={cuerpo}
                  onChange={e => setCuerpo(e.target.value)}
                  rows={12}
                  placeholder={"Hola,\n\nTe escribimos para contarte..."}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Texto normal. Una línea en blanco separa párrafos; el correo se arma con el diseño de Proenergim.
                </p>
              </div>

              {/* Variables */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  Personalizar
                </label>
                <div className="flex flex-wrap gap-2">
                  {VARIABLES.map(v => (
                    <button
                      key={v.clave}
                      onClick={() => insertarVariable(v.clave)}
                      title={v.ayuda}
                      className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-md hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                    >
                      {v.clave}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Cada suscriptor recibe su propio valor en lugar de la variable.
                </p>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={previsualizar}
                  disabled={cargandoPreview}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                  {cargandoPreview ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                  Vista previa
                </button>

                <button
                  onClick={enviar}
                  disabled={enviando || seleccionados.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {enviando ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {enviando
                    ? "Enviando..."
                    : `Enviar a ${seleccionados.length} ${seleccionados.length === 1 ? "suscriptor" : "suscriptores"}`}
                </button>
              </div>
            </div>
          </div>

          {/* ── Destinatarios ── */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col max-h-[calc(100vh-16rem)]">
              <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">Destinatarios</h3>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5">
                    {seleccionados.length} de {suscriptors.length}
                  </span>
                </div>

                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    placeholder="Buscar correo..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {["Todos", ...ESTADOS].map(estado => (
                    <button
                      key={estado}
                      onClick={() => setFiltroEstado(estado)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md border transition-colors ${
                        filtroEstado === estado
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {estado}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={todosMarcados}
                    onChange={alternarTodos}
                    disabled={visibles.length === 0}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Seleccionar los {visibles.length} visibles
                </label>
              </div>

              <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                {visibles.length === 0 ? (
                  <p className="p-6 text-center text-sm text-slate-400">
                    No hay suscriptores que coincidan.
                  </p>
                ) : visibles.map(s => {
                  const marcado = seleccionados.includes(s.email)
                  return (
                    <label
                      key={s._id || s.email}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                        marcado ? "bg-blue-50/60" : "hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={marcado}
                        onChange={() => alternarUno(s.email)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
                      />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-slate-800 truncate">{s.email}</span>
                        <span className="block text-[11px] text-slate-400">
                          {s.createdAt ? new Date(s.createdAt).toLocaleDateString("es-PE") : ""}
                        </span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${ESTADO_CHIP[s.estado] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                        {s.estado}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Historial ── */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {historial.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Todavía no se ha enviado ningún correo.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-160">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">Fecha</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">Asunto</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">Plantilla</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">Resultado</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historial.map(envio => (
                    <tr key={envio._id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                        {new Date(envio.createdAt).toLocaleString("es-PE", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 max-w-xs truncate">
                        {envio.asunto}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {envio.plantilla || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                          <CheckCircle size={14} /> {envio.enviados}
                        </span>
                        {envio.fallidos > 0 && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 ml-3">
                            <AlertTriangle size={14} /> {envio.fallidos}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setEnvioAbierto(envio)}
                          className="text-xs font-bold text-blue-700 hover:text-blue-900"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Modal de vista previa ── */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 shrink-0">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Vista previa</p>
                <p className="text-sm font-bold text-slate-800 truncate">{preview.asunto}</p>
              </div>
              <button onClick={() => setPreview(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md">
                <X size={20} />
              </button>
            </div>
            <iframe
              title="Vista previa del correo"
              srcDoc={preview.html}
              sandbox=""
              className="flex-1 w-full min-h-96 border-0"
            />
            <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 shrink-0">
              <p className="text-[11px] text-slate-500">
                Datos de ejemplo: <span className="font-mono">{preview.datos?.email}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal de detalle del envío ── */}
      {envioAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 shrink-0">
              <p className="text-sm font-bold text-slate-800 truncate">{envioAbierto.asunto}</p>
              <button onClick={() => setEnvioAbierto(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-4">
              <p className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 border border-slate-100 rounded-lg p-3">
                {envioAbierto.cuerpo}
              </p>

              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  Entregados ({envioAbierto.enviados})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {envioAbierto.destinatarios?.map(email => (
                    <span key={email} className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 rounded px-2 py-0.5">
                      {email}
                    </span>
                  ))}
                </div>
              </div>

              {envioAbierto.fallidos > 0 && (
                <div>
                  <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">
                    Fallidos ({envioAbierto.fallidos})
                  </p>
                  <ul className="space-y-1.5">
                    {envioAbierto.errores?.map((error, i) => (
                      <li key={i} className="text-[11px] bg-red-50 border border-red-200 rounded px-2 py-1.5">
                        <span className="font-semibold text-red-800">{error.email}</span>
                        <span className="block text-red-600">{error.motivo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
