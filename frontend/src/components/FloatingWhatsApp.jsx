import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Trash2 } from "lucide-react"
import logoMobile from "../assets/logo-movile.webp"

const WHATSAPP = "51936954890"
const API_URL = import.meta.env.VITE_API_URL
const STORAGE_KEY = "proenergim_chat_v4"

// ─── Persistencia segura (no crashea en Safari privado) ───────────────────────
function saveState(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

// ─── Utilidades ───────────────────────────────────────────────────────────────
function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
}
function now() {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
}

// ─── Palabras que NO son nombres ──────────────────────────────────────────────
const NOT_A_NAME = new Set([
  "hola","holi","buenas","buenos","tardes","dias","noches","bien","mal",
  "gracias","ok","si","sí","no","claro","okey","hey","saludos","ola",
  "buen","dia","tarde","noche","genial","perfecto","exacto","correcto",
  "aja","aha","umm","excelente","muchas","mucho","gusto","placer",
  "encantado","encantada","es","de","desde","en","soy","me","llamo",
  "mi","nombre","un","una","quisiera","quiero","informacion","cotizacion",
  "precio","costo","paneles","solar","proyectos","chau","bye","adios",
  "tambien","también","aqui","aquí","alli","allí","por","favor","como",
  "cuando","donde","quien","que","cual","cuanto","cuál","cuánto"
])

function extractName(raw) {
  if (!raw || raw.trim().length < 2) return null
  const clean = raw.replace(/[^\p{L}\s]/gu, " ").replace(/\s+/g, " ").trim()
  const norm = normalize(clean)

  const patterns = [
    /(?:soy|me llamo|mi nombre es|llámame|llamame)\s+([a-záéíóúñü]{2,}(?:\s+[a-záéíóúñü]{2,})?)/i,
  ]
  for (const p of patterns) {
    const m = clean.match(p)
    if (m) {
      const w = normalize(m[1]).split(" ")[0]
      if (!NOT_A_NAME.has(w)) return m[1].replace(/\b\w/g, c => c.toUpperCase())
    }
  }

  const words = norm.split(" ").filter(w => w.length >= 2 && !NOT_A_NAME.has(w))
  if (words.length === 0) return null
  const candidate = words.slice(0, 2).join(" ")
  return candidate.replace(/\b\w/g, c => c.toUpperCase())
}

// ─── Departamentos Perú ───────────────────────────────────────────────────────
const DEPTS = [
  "Amazonas","Áncash","Apurímac","Arequipa","Ayacucho","Cajamarca",
  "Callao","Cusco","Huancavelica","Huánuco","Ica","Junín",
  "La Libertad","Lambayeque","Lima","Loreto","Madre de Dios",
  "Moquegua","Pasco","Piura","Puno","San Martín","Tacna",
  "Tumbes","Ucayali"
]
const LIMA_DISTRICTS = [
  "Miraflores","San Isidro","Surco","San Borja","La Molina",
  "San Juan de Lurigancho","Los Olivos","Comas","Ate","Barranco",
  "Chorrillos","Independencia","Jesús María","La Victoria","Lince",
  "Magdalena","Pueblo Libre","Rímac","San Miguel","Santa Anita",
  "San Martín de Porres","Villa El Salvador","Villa María del Triunfo",
  "San Juan de Miraflores","Callao"
]

function extractLocation(raw) {
  const norm = normalize(raw)
  for (const d of DEPTS) {
    if (norm.includes(normalize(d))) return d
  }
  return null
}
function extractDistrict(raw) {
  const norm = normalize(raw)
  const alias = { "sjl": "San Juan de Lurigancho", "smp": "San Martín de Porres", "sjm": "San Juan de Miraflores" }
  for (const [k, v] of Object.entries(alias)) {
    if (norm.includes(k)) return v
  }
  for (const d of LIMA_DISTRICTS) {
    if (norm.includes(normalize(d))) return d
  }
  return null
}

// ─── Temas de consulta ────────────────────────────────────────────────────────
const TEMAS = [
  { key: "cotizacion",    label: "💰 Cotización",          msg: "solicitar una cotización" },
  { key: "bombeo",        label: "💧 Bombeo Solar",         msg: "saber sobre bombeo solar" },
  { key: "riego",         label: "🌱 Riego tecnificado",    msg: "saber sobre riego tecnificado" },
  { key: "electrifica",   label: "⚡ Electrificación",      msg: "saber sobre electrificación solar" },
  { key: "industrial",    label: "🏭 Industrial",           msg: "proyectos industriales" },
  { key: "mantenimiento", label: "🔧 Mantenimiento",        msg: "servicio de mantenimiento" },
  { key: "otros",         label: "❓ Otra consulta",        msg: "una consulta general" },
]

// ─── Flujo de etapas ──────────────────────────────────────────────────────────
const STAGE = { WELCOME: "welcome", NAME: "name", LOCATION: "location", DISTRICT: "district", TOPIC: "topic", DONE: "done" }

// ─── Formateo de texto con negrita ────────────────────────────────────────────
function formatText(text) {
  return text.split("\n").map((line, li) => (
    <span key={li} className="block">
      {line.split(/(\*[^*]+\*)/g).map((part, pi) =>
        part.startsWith("*") && part.endsWith("*")
          ? <strong key={pi}>{part.slice(1, -1)}</strong>
          : part
      )}
    </span>
  ))
}

// ─── Indicador de escritura ───────────────────────────────────────────────────
const TypingDots = () => (
  <div className="flex items-start">
    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex gap-1.5 items-center">
      {[0, 0.22, 0.44].map((delay, i) => (
        <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay }}
          className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
      ))}
    </div>
  </div>
)

// ─── Patrón decorativo del fondo ─────────────────────────────────────────────
const ChatBg = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="cp" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <circle cx="30" cy="30" r="1" fill="currentColor"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#cp)"/>
  </svg>
)

// ─── Icono WhatsApp ───────────────────────────────────────────────────────────
const WAIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.15-1.265-.458-2.406-1.474-.89-.788-1.489-1.762-1.664-2.062-.175-.3-.019-.462.131-.611.136-.134.301-.349.45-.523.15-.174.2-.3.301-.497.101-.202.05-.376-.025-.525-.075-.15-.672-1.62-.924-2.215-.244-.58-.492-.501-.672-.51-.174-.008-.374-.008-.574-.008s-.525.074-.798.375c-.276.3-1.045 1.025-1.045 2.499s1.07 2.894 1.219 3.094c.15.195 2.109 3.238 5.106 4.536.713.31 1.267.495 1.701.633.714.227 1.365.195 1.88.118.575-.086 1.767-.721 2.016-1.42s.25-1.299.175-1.424c-.074-.125-.274-.2-.574-.35zM12.002 22C6.48 22 2 17.514 2 12S6.48 2 12.002 2c5.523 0 10.001 4.486 10.001 10s-4.478 10-10.001 10zM12.002 0C5.373 0 0 5.372 0 12c0 2.126.549 4.133 1.517 5.864L.015 24l6.305-1.654C8.016 23.364 9.944 24 12.002 24 18.631 24 24 18.628 24 12c0-6.628-5.369-12-11.998-12z"/>
  </svg>
)

// ─── Componente principal ─────────────────────────────────────────────────────
export default function FloatingWhatsApp() {
  const saved = loadState()
  const [isOpen, setIsOpen] = useState(false)
  const [stage, setStage] = useState(saved?.stage || STAGE.WELCOME)
  const [userName, setUserName] = useState(saved?.userName || "")
  const [userLocation, setUserLocation] = useState(saved?.userLocation || "")
  const [userTopic, setUserTopic] = useState(saved?.userTopic || "")
  const [messages, setMessages] = useState(saved?.messages || [])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showDistrictList, setShowDistrictList] = useState(false)
  const chatRef = useRef(null)
  const inputRef = useRef(null)
  const initialized = useRef(!!saved?.messages?.length)

  // Persistir estado
  useEffect(() => {
    saveState({ stage, userName, userLocation, userTopic, messages })
  }, [stage, userName, userLocation, userTopic, messages])

  // Scroll al fondo
  useEffect(() => {
    const t = setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
    }, 80)
    return () => clearTimeout(t)
  }, [messages, isTyping, isOpen])

  // Saludo inicial al abrir por primera vez
  useEffect(() => {
    if (isOpen && !initialized.current) {
      initialized.current = true
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        addBotMsg(
          "☀️ *¡Bienvenido a Proenergim!*\n\nSomos especialistas en energía solar en todo el Perú. Estoy aquí para ayudarte a encontrar la solución ideal para tu proyecto.\n\n¿Cuál es tu nombre?"
        )
        setStage(STAGE.NAME)
      }, 1000)
    }
  }, [isOpen])

  function addBotMsg(text, extra = {}) {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: "bot", text, time: now(), ...extra }])
  }
  function addUserMsg(text) {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: "user", text, time: now() }])
  }
  function botReply(text, delay = 0, extra = {}) {
    const d = Math.min(600 + text.length * 8, 1800) + delay
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addBotMsg(text, extra)
    }, d)
  }

  // ─── Armado y envío del mensaje final ───────────────────────────────────────
  async function sendFinalLead(name, location, topicKey) {
    const topicLabel = TEMAS.find(t => t.key === topicKey)?.msg || topicKey

    // Guardar en MongoDB
    try {
      await fetch(`${API_URL}/api/chat-leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: name, ciudad: location, tema: topicLabel, origen: "chat_flotante" })
      })
    } catch {}

    // Enviar email
    try {
      await fetch(`${API_URL}/api/chat-leads/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: name, ubicacion: location, tema: topicLabel })
      })
    } catch {}

    // Armar mensaje WhatsApp
    const waMsg = [
      `Hola, me comunico desde el sitio web de Proenergim.`,
      ``,
      `*Mis datos:*`,
      `*Nombre:* ${name}`,
      `*Ubicación del proyecto:* ${location}`,
      `*Consulta:* Quiero ${topicLabel}`,
      ``,
      `Quedo atento a su asesoría. ¡Gracias!`
    ].join("\n")

    // Abrir WhatsApp después de 2 seg (para que el usuario lea el resumen)
    setTimeout(() => {
      const link = document.createElement("a")
      link.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}`
      link.target = "_blank"
      link.rel = "noreferrer"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 2000)
  }

  // ─── Manejo de envío de mensajes ─────────────────────────────────────────────
  const handleSend = useCallback((textOverride) => {
    const raw = (textOverride ?? inputValue).trim()
    if (!raw) return
    setInputValue("")
    setShowDistrictList(false)
    addUserMsg(raw)

    // ETAPA: Nombre
    if (stage === STAGE.NAME) {
      const name = extractName(raw)
      if (!name) {
        botReply(`Disculpa, no pude captar tu nombre. ¿Me puedes decir cómo te llamas?`)
        return
      }
      setUserName(name)
      setStage(STAGE.LOCATION)
      botReply(
        `¡Mucho gusto, *${name}*! 😊\n\n¿En qué departamento del Perú se realizaría el proyecto?`,
        200,
        { showDepts: true }
      )
      return
    }

    // ETAPA: Departamento
    if (stage === STAGE.LOCATION) {
      const dept = extractLocation(raw)
      if (!dept) {
        botReply(`No reconocí ese departamento. ¿Puedes elegir uno de la lista o escribirlo nuevamente?`, 0, { showDepts: true })
        return
      }
      if (dept === "Lima") {
        setUserLocation("Lima")
        setStage(STAGE.DISTRICT)
        botReply(`📍 *Lima*, anotado.\n\n¿En qué distrito de Lima se ubicaría el proyecto?`, 200, { showDistricts: true })
        return
      }
      setUserLocation(dept)
      setStage(STAGE.TOPIC)
      botReply(
        `📍 *${dept}*, perfecto.\n\n*${userName}*, ¿sobre qué tema te puedo ayudar hoy?`,
        300,
        { showTopics: true }
      )
      return
    }

    // ETAPA: Distrito (Lima)
    if (stage === STAGE.DISTRICT) {
      const dist = extractDistrict(raw) || raw.replace(/\b\w/g, c => c.toUpperCase())
      const loc = `Lima - ${dist}`
      setUserLocation(loc)
      setStage(STAGE.TOPIC)
      botReply(
        `📍 *${loc}*, ¡entendido!\n\n*${userName}*, ¿sobre qué tema te puedo ayudar?`,
        200,
        { showTopics: true }
      )
      return
    }

    // ETAPA: Tema (texto libre → categorizar como "otros")
    if (stage === STAGE.TOPIC) {
      handleTopicSelected("otros")
    }
  }, [inputValue, stage, userName, userLocation])

  function handleTopicSelected(key) {
    const tema = TEMAS.find(t => t.key === key)
    setUserTopic(key)
    setStage(STAGE.DONE)

    const loc = userLocation || "(no especificada)"
    const name = userName || "visitante"

    const confirmMsg =
      `✅ *¡Perfecto, ${name}!*\n\nResumen de tu consulta:\n• *Nombre:* ${name}\n• *Ubicación:* ${loc}\n• *Tema:* ${tema?.msg || key}\n\nEn unos segundos abriremos WhatsApp con tu información. ¡Un asesor te contactará pronto! 🚀`

    botReply(confirmMsg, 0)
    sendFinalLead(name, loc, key)
  }

  function clearAll() {
    setMessages([])
    setStage(STAGE.WELCOME)
    setUserName("")
    setUserLocation("")
    setUserTopic("")
    setInputValue("")
    setShowDistrictList(false)
    initialized.current = true
    saveState(null)
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addBotMsg(
        "☀️ *¡Bienvenido a Proenergim!*\n\nSomos especialistas en energía solar en todo el Perú. Estoy aquí para ayudarte.\n\n¿Cuál es tu nombre?"
      )
      setStage(STAGE.NAME)
    }, 800)
  }

  const lastBotMsg = [...messages].reverse().find(m => m.sender === "bot")
  const isDone = stage === STAGE.DONE
  const inputPlaceholder =
    stage === STAGE.NAME     ? "Escribe tu nombre..." :
    stage === STAGE.LOCATION ? "Escribe tu departamento..." :
    stage === STAGE.DISTRICT ? "Escribe tu distrito..." :
    stage === STAGE.TOPIC    ? "Describe tu consulta..." :
    "Escribe aquí..."

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="mb-4 w-[322px] sm:w-[380px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
            style={{ height: 540 }}
          >
            {/* ── Header ── */}
            <div className="bg-[#075e54] px-5 py-4 text-white shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full p-0.5 shadow-inner shrink-0">
                    <img src={logoMobile} alt="Logo" className="w-full h-full object-contain"/>
                  </div>
                  <div>
                    <h3 className="font-black text-sm tracking-tight leading-none mb-1">Proenergim</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse"/>
                      <p className="text-[10px] font-bold opacity-90 uppercase tracking-widest leading-none">
                        {isTyping ? "Escribiendo..." : "En línea"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={clearAll} title="Nueva conversación"
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all active:scale-90">
                    <Trash2 size={14}/>
                  </button>
                  <button onClick={() => setIsOpen(false)}
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all active:scale-90">
                    <X size={16}/>
                  </button>
                </div>
              </div>

              {/* Progreso */}
              {(userName || userLocation) && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {userName     && <span className="text-[10px] bg-white/15 px-2.5 py-0.5 rounded-full font-bold">👤 {userName}</span>}
                  {userLocation && <span className="text-[10px] bg-white/15 px-2.5 py-0.5 rounded-full font-bold">📍 {userLocation}</span>}
                </div>
              )}
            </div>

            {/* ── Chat ── */}
            <div ref={chatRef}
              className="flex-1 relative bg-[#e5ddd5] px-4 py-4 overflow-y-auto scroll-smooth flex flex-col gap-2.5">
              <ChatBg/>

              {messages.length === 0 && !isTyping && (
                <div className="flex flex-col items-center justify-center h-full gap-3 relative z-10 opacity-40">
                  <img src={logoMobile} alt="Logo" className="w-12 h-12 object-contain"/>
                  <p className="text-xs text-gray-500 font-semibold">Iniciando...</p>
                </div>
              )}

              {messages.map((msg) => {
                const isBot = msg.sender === "bot"
                const isLast = isBot && msg.id === lastBotMsg?.id
                return (
                  <motion.div key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col ${isBot ? "items-start" : "items-end"} relative z-10`}
                  >
                    <div className={`max-w-[88%] px-4 py-2.5 shadow-sm text-[13px] leading-relaxed ${
                      isBot
                        ? "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100"
                        : "bg-[#d9fdd3] text-gray-800 rounded-2xl rounded-tr-none border border-[#c5f0be]"
                    }`}>
                      {isBot && <p className="text-[9px] font-black text-[#075e54] mb-1 uppercase tracking-wider">Proenergim</p>}
                      <div className="font-medium whitespace-pre-wrap">{formatText(msg.text)}</div>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-0.5 px-1">{msg.time}</span>

                    {/* Botones de departamentos */}
                    {isLast && !isTyping && msg.showDepts && stage === STAGE.LOCATION && (
                      <div className="mt-2 w-full relative z-10">
                        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                          {DEPTS.map(d => (
                            <button key={d} onClick={() => handleSend(d)}
                              className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-[#dcf8c6] hover:border-[#25D366]/50 text-gray-700 transition-all shadow-sm active:scale-95">
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botones de distritos */}
                    {isLast && !isTyping && msg.showDistricts && stage === STAGE.DISTRICT && (
                      <div className="mt-2 w-full relative z-10">
                        <button onClick={() => setShowDistrictList(p => !p)}
                          className="text-[11px] bg-white border border-gray-200 hover:border-[#25D366]/50 text-gray-600 font-bold px-4 py-2 rounded-full shadow-sm transition-all flex items-center gap-1.5 mb-2">
                          📋 {showDistrictList ? "Ocultar distritos" : "Ver distritos de Lima"}
                        </button>
                        {showDistrictList && (
                          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                            {LIMA_DISTRICTS.map(d => (
                              <button key={d} onClick={() => handleSend(d)}
                                className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-[#dcf8c6] hover:border-[#25D366]/50 text-gray-700 transition-all shadow-sm active:scale-95">
                                {d}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Botones de temas */}
                    {isLast && !isTyping && msg.showTopics && stage === STAGE.TOPIC && (
                      <div className="mt-2 w-full relative z-10">
                        <div className="flex flex-wrap gap-1.5">
                          {TEMAS.map(t => (
                            <button key={t.key} onClick={() => handleTopicSelected(t.key)}
                              className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-[#dcf8c6] hover:border-[#25D366]/50 text-[#075e54] transition-all shadow-sm active:scale-95">
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <TypingDots/>
                </motion.div>
              )}
            </div>

            {/* ── Botón WhatsApp directo ── */}
            <div className="bg-white px-4 py-2 border-t border-gray-100 shrink-0">
              <button onClick={() => {
                  const msg = userName
                    ? `Hola, soy *${userName}*${userLocation ? ` desde *${userLocation}*` : ""}. Quiero información sobre energía solar.`
                    : "Hola, quiero información sobre soluciones de energía solar."
                  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank")
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BE5C] text-white font-black text-xs py-2.5 rounded-full transition-all shadow-sm active:scale-95">
                <WAIcon size={13}/>
                Hablar directamente con un asesor
              </button>
            </div>

            {/* ── Input ── */}
            {!isDone && (
              <form onSubmit={e => { e.preventDefault(); handleSend() }}
                className="bg-[#f0f0f0] border-t border-gray-200 px-3 py-3 flex items-center gap-2 shrink-0">
                <input ref={inputRef} type="text" placeholder={inputPlaceholder}
                  value={inputValue} onChange={e => setInputValue(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 shadow-inner min-w-0"/>
                <button type="submit" disabled={!inputValue.trim()}
                  className="shrink-0 bg-[#25D366] disabled:bg-gray-300 text-white p-2.5 rounded-full active:scale-90 disabled:opacity-50 transition-all">
                  <Send size={16}/>
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Botón flotante ── */}
      <div className="relative group">
        {!isOpen && (
          <span className="absolute right-full mr-5 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs font-black px-5 py-2.5 rounded-2xl shadow-lg border border-gray-100 whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-x-2">
            ¿Cómo podemos ayudarte?
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-t border-r border-gray-100 rotate-45"/>
          </span>
        )}
        <motion.button onClick={() => setIsOpen(p => !p)}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className={`${isOpen ? "bg-[#075e54]" : "bg-[#25D366] shadow-[0_8px_30px_rgb(37,211,102,0.4)]"} text-white p-4 flex items-center justify-center rounded-full transition-all duration-300 relative z-10`}>
          {isOpen ? <X size={26} strokeWidth={3}/> : <WAIcon size={28}/>}
        </motion.button>
      </div>
    </div>
  )
}
