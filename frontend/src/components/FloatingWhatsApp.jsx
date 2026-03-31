import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Smile, Trash2 } from "lucide-react"
import logoMobile from "../assets/logo-movile.webp"

const WHATSAPP = "51936954890"
const STORAGE_KEY = "proenergim_chat_v3"

// ─── Utilidades de texto ──────────────────────────────────────────────────────
// Limpia emojis/símbolos y colapsa letras repetidas (holaaaa → hola)
function cleanText(raw) {
  return raw
    .replace(/[^\p{L}\s]/gu, " ")   // quita emojis y símbolos
    .replace(/(.)\1{2,}/g, "$1$1")  // colapsa: holaaaa → hola
    .replace(/\s+/g, " ")
    .trim()
}

function normalizeStr(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

// ─── Extracción inteligente del nombre ───────────────────────────────────────
const NOT_A_NAME = new Set([
  "hola","holi","hole","holis","buenas","buenos","tardes","dias","noches",
  "bien","gracias","ok","si","no","claro","okey","hey","saludos","ola",
  "buen","dia","tarde","noche","genial","perfecto","exacto","correcto",
  "aja","aha","umm","excelente","fantastico","buenisimo","mucho","gusto",
  "placer","encantado","encantada","es","de","desde","en","soy","me","llamo",
  "mi","nombre","un","una","quisiera","quiero","informacion","cotizacion",
  "precio","costo","paneles","solar","proyectos","chau","bye","adios"
])

// 1️⃣ Extractor simple (cuando preguntas por el nombre)
function extractSimpleName(raw) {
  if (!raw) return null
  const clean = cleanText(raw)
  const norm = normalizeStr(clean)
  const words = norm.split(/\s+/)

  // Probar primero patrones comunes
  const patterns = [
    /\bsoy\s+([a-záéíóúñ]{2,}(?:\s+[a-záéíóúñ]{2,})?)/i,
    /\bme\s+llamo\s+([a-záéíóúñ]{2,}(?:\s+[a-záéíóúñ]{2,})?)/i,
    /\bmi\s+nombre\s+es\s+([a-záéíóúñ]{2,}(?:\s+[a-záéíóúñ]{2,})?)/i,
  ]
  for (const pattern of patterns) {
    const match = clean.match(pattern)
    if (match) {
      const captured = match[1].trim()
      const firstWord = normalizeStr(captured).split(" ")[0]
      if (captured.length >= 2 && !NOT_A_NAME.has(firstWord)) {
        return captured.replace(/\b\w/g, c => c.toUpperCase())
      }
    }
  }

  // Si no hay patrón, tomar las primeras palabras que no sean saludos
  if (words.length >= 1) {
    const first = words[0]
    const second = words[1]
    if (!NOT_A_NAME.has(first)) {
      let name = first
      if (second && !NOT_A_NAME.has(second)) name = `${first} ${second}`
      return name.replace(/\b\w/g, c => c.toUpperCase())
    }
  }
  return null
}



// ─── Extracción Profesional de Locación (Perú) ───────────────────────────────
const PERU_DEPARTMENTS = [
  "amazonas","ancash","apurimac","arequipa","ayacucho","cajamarca",
  "callao","cusco","huancavelica","huanuco","ica","junin",
  "la libertad","lambayeque","lima","loreto","madre de dios",
  "moquegua","pasco","piura","puno","san martin","tacna",
  "tumbes","ucayali"
]

const PERU_CITIES = {
  "trujillo": "La Libertad", "chiclayo": "Lambayeque", "piura": "Piura",
  "arequipa": "Arequipa", "cusco": "Cusco", "huancayo": "Junín",
  "ica": "Ica", "tacna": "Tacna", "pucallpa": "Ucayali",
  "tarapoto": "San Martín", "cajamarca": "Cajamarca", "ayacucho": "Ayacucho",
  "huanuco": "Huánuco", "puno": "Puno", "tumbes": "Tumbes", "chimbote": "Ancash",
  "huaraz": "Ancash", "sullana": "Piura", "talara": "Piura", "moquegua": "Moquegua"
}

const LIMA_DISTRICTS = [
  "miraflores", "san isidro", "surco", "santiago de surco", "san borja",
  "la molina", "san juan de lurigancho", "los olivos", "comas", "ate",
  "villa el salvador", "villa maria del triunfo", "magdalena", "pueblo libre",
  "barranco", "rimac", "lince", "jesus maria", "independencia", "callao",
  "san martin de porres", "san miguel", "santa anita", "chorrillos",
  "san juan de miraflores", "la victoria"
]

const DISTRICT_ALIAS = {
  "sjl": "San Juan de Lurigancho", "smp": "San Martín de Porres",
  "sjm": "San Juan de Miraflores", "ves": "Villa El Salvador", "vmt": "Villa María del Triunfo"
}

function extractDepartment(text) {
  const clean = normalizeStr(text)
  for (const dept of PERU_DEPARTMENTS) {
    if (clean.includes(dept)) return dept.replace(/\b\w/g, c => c.toUpperCase())
  }
  return null
}

function extractCityOnly(text) {
  const clean = normalizeStr(text)
  for (const city in PERU_CITIES) {
    if (clean.includes(city)) return { city: city.replace(/\b\w/g, c => c.toUpperCase()), department: PERU_CITIES[city] }
  }
  return null
}

function extractDistrict(text) {
  const clean = normalizeStr(text)
  // Primero alias
  const words = clean.split(/\s+/)
  for (const w of words) {
    if (DISTRICT_ALIAS[w]) return DISTRICT_ALIAS[w]
  }
  for (const d of LIMA_DISTRICTS) {
    if (clean.includes(d)) return d.replace(/\b\w/g, c => c.toUpperCase())
  }
  return null
}

function extractLocation(text) {
  const cityData = extractCityOnly(text)
  const dept = extractDepartment(text)
  const district = extractDistrict(text)

  let finalDept = dept
  let finalCity = cityData?.city || null

  if (cityData && !finalDept) finalDept = cityData.department

  return { department: finalDept, city: finalCity, district }
}

// La nueva versión (Línea 147)
function extractFullInfo(raw) {
  const loc = extractLocation(raw) // Aquí detecta Ciudad/Dpto/Distrito
  return {
    name: extractSimpleName(raw), // <--- ¡Aquí usa la lógica de los "patterns" que mencionas!
    department: loc.department,
    city: loc.city,
    district: loc.district,
    intent: extractIntent(raw)
  }
}


// ─── Base de conocimiento ────────────────────────────────────────────────────
const KB = [
  {
    key: "servicios",
    label: "☀️ Servicios",
    waLabel: "consultar sobre los servicios",
    keywords: ["servicio","servicios","ofrecen","que hacen","que realizan","trabajan","oferta","actividad"],
    answer: (n) =>
      `✅ *Nuestros servicios:*\n\n• ☀️ *Instalación de paneles solares* — residencial, comercial e industrial\n• 💧 *Bombeo solar* — para riego y agua potable\n• 🔧 *Mantenimiento* — revisión, limpieza y diagnóstico técnico\n• 📊 *Asesoría técnica* — dimensionamiento y cotizaciones personalizadas\n• 🏗️ *Proyectos a medida* — desde hogares hasta grandes industrias\n\n${n ? `¿Cuál te interesa más, ${n}?` : "¿Cuál te interesa más?"} 😊`,
  },
  {
    key: "proyectos_realizados",
    label: "🏗️ Proyectos realizados",
    waLabel: "conocer los proyectos realizados",
    keywords: ["proyecto","proyectos","obra","han hecho","ejecutado","realizados","trabajos","experiencia","que han hecho"],
    answer: () =>
      `🏗️ *Proyectos destacados que hemos realizado:*\n\n• ⚡ Sistemas fotovoltaicos en *Lima, La Libertad, Piura y Selva Sur*\n• 💧 Bombeo solar en comunidades rurales de *Madre de Dios*\n• 🏭 Plantas de energía industrial en *Tumbes y Trujillo*\n• 🌱 Sistemas de riego tecnificado con energía solar en todo el Perú\n\n🎥 Visita la sección *Proyectos* del sitio web para ver videos y detalles en tiempo real.\n\n¿Te gustaría realizar un proyecto propio? Puedo orientarte con una cotización. 👇`,
  },
  {
    key: "nuevo_proyecto",
    label: "🚀 Quiero un proyecto",
    waLabel: "realizar un nuevo proyecto solar",
    keywords: ["quiero un proyecto","hacer un proyecto","nuevo proyecto","instalar","quiero instalar","necesito instalar","mi proyecto","para mi casa","para mi empresa","para mi negocio","para mi finca"],
    answer: (n) =>
      `🚀 *¡Excelente decisión${n ? `, ${n}` : ""}!*\n\nPara diseñar tu proyecto necesitamos conocer:\n\n• 📐 Tu consumo mensual de energía (kWh)\n• 🏠 Tipo de instalación: hogar, empresa o proyecto agrícola\n• 📍 Ubicación del proyecto\n• 💡 ¿Conexión a red o sistema autónomo?\n\nCon esos datos nuestro equipo técnico diseña la solución ideal para ti. ¡Toca el botón de WhatsApp y te cotizamos sin costo! 👇`,
  },
  {
    key: "cotizacion",
    label: "💰 Cotización",
    waLabel: "solicitar una cotización",
    keywords: ["precio","costo","cuanto","cuánto","cotizacion","cotización","presupuesto","vale","tarifa","cuánto cuesta","tiene precio","cobra"],
    answer: (n) =>
      `💰 *Cotización personalizada${n ? ` para ${n}` : ""}:*\n\nTe preparamos un presupuesto *sin costo ni compromiso.*\n\nNecesitamos saber:\n\n• 📐 Consumo mensual en kWh (está en tu recibo de luz)\n• 🏠 Tipo: hogar, empresa o proyecto agrícola\n• 📍 Ubicación del proyecto\n\n¡Un asesor te enviará la cotización en menos de 24 horas! Toca el botón de WhatsApp. 👇`,
  },
  {
    key: "sedes",
    label: "📍 Sedes",
    waLabel: "conocer las sedes",
    keywords: ["sede","sedes","oficina","oficinas","donde estan","donde están","ubicacion","sucursal","direccion","dirección"],
    answer: () =>
      `📍 *Nuestras sedes zonales:*\n\n• 🏙️ *Zonal Lima* — Costa central\n• 🌊 *Zonal La Libertad* — Trujillo\n• 🌞 *Zonal Piura - Tumbes* — Norte del Perú\n• 🌿 *Zonal Selva Sur* — Madre de Dios\n\nAtendemos proyectos en *todo el territorio nacional.* 🗺️`,
  },
  {
    key: "contacto",
    label: "📞 Contacto",
    waLabel: "obtener los datos de contacto",
    keywords: ["contacto","contactar","llamar","telefono","teléfono","correo","email","numero","número","celular","comunicar"],
    answer: () =>
      `📞 *Canales de contacto:*\n\n• 📱 *WhatsApp:* +51 936 954 890\n• 📧 *Correo:* waguilar@proenergim.com\n• 🌐 *Web:* proenergim.com\n\nPuedes usar el botón verde de abajo para abrir WhatsApp directamente. ¡Respondemos a la brevedad! 🙌`,
  },
  {
    key: "nosotros",
    label: "🌟 Quiénes somos",
    waLabel: "conocer más sobre Proenergim",
    keywords: ["quienes son","empresa","proenergim","historia","sobre","nosotros","años","fundada","trayectoria","vision","visión","mision","misión","valores"],
    answer: () =>
      `🌟 *¿Quiénes somos?*\n\n*Proenergim* es una empresa peruana especializada en soluciones de energía renovable con presencia nacional.\n\n🎯 *Misión:* Brindar soluciones energéticas sostenibles de alta calidad que mejoren la calidad de vida de nuestros clientes y contribuyan al desarrollo del Perú.\n\n👁️ *Visión:* Ser la empresa referente en energía renovable en el Perú, liderando la transición hacia un futuro más limpio y eficiente.\n\n✅ Equipo técnico certificado\n✅ Proyectos ejecutados en múltiples regiones\n✅ Atención personalizada y soporte post-venta\n✅ Comprometidos con la sostenibilidad 🌿\n\nConoce nuestra trayectoria en la sección *Nosotros* del sitio web. 🇵🇪`,
  },
  {
    key: "solar",
    label: null,
    waLabel: "saber sobre energía solar",
    keywords: ["solar","panel","fotovoltaico","energia solar","energía solar","placa","modulo","renovable"],
    answer: () =>
      `☀️ *Energía Solar con Proenergim:*\n\n• 🏠 *Residencial* — reduce tu factura eléctrica hasta un 90%\n• 🏭 *Industrial* — grandes plantas con alta potencia\n• 🌱 *Agrícola* — bombeo y riego solar eficiente\n• 🏘️ *Rural* — electrificación de comunidades sin red\n\nUsamos equipos *certificados* con garantía en mano de obra. 🛡️`,
  },
  {
    key: "garantia",
    label: null,
    waLabel: "saber sobre garantías",
    keywords: ["garantia","garantía","duracion","duración","vida util","años","tiempo","duran"],
    answer: () =>
      `🛡️ *Garantías y durabilidad:*\n\n• Vida útil de paneles: *25 a 30 años*\n• Garantía del fabricante en equipos: *10 a 25 años*\n• Garantía de mano de obra: *incluida*\n• Mantenimiento recomendado: *1 vez al año*\n\n¡Una inversión con retorno garantizado a largo plazo! 💚`,
  },
  {
    key: "bombeo",
    label: null,
    waLabel: "saber sobre bombeo solar",
    keywords: ["bombeo","bomba","riego","agua","pozo","irrigacion","irrigación","canal"],
    answer: () =>
      `💧 *Bombeo Solar:*\n\n• 🌱 *Riego tecnificado* — eficiencia y ahorro\n• 🏘️ *Agua potable rural* — sin necesidad de red eléctrica\n• 🐄 *Ganadería* — suministro confiable y continuo\n• 🌾 *Agricultura* — pozos y canales solares\n\nFuncionan incluso en días nublados. ¿Cuál es tu necesidad? 🤔`,
  },
]

// Opciones que aparecen como botones rápidos
const QUICK_OPTIONS = KB.filter(k => k.label).map(k => ({ key: k.key, label: k.label, waLabel: k.waLabel }))

const EMOJI_LIST = [
  "😊","👋","☀️","🔋","💡","✅","🏠","🌿","💚","❓",
  "👍","🚀","💰","📞","📍","🌎","⚡","🔧","📊","😄",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function now() {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
}

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function getBotResponse(userText) {
  const text = normalize(userText)
  // Priorizar "quiero un proyecto" antes que "proyectos"
  for (const entry of KB) {
    if (entry.keywords.some(k => text.includes(normalize(k)))) {
      return { answer: entry.answer, waLabel: entry.waLabel }
    }
  }
  if (text.includes("whatsapp") || text.includes("asesor") || text.includes("hablar") || text.includes("conectar")) {
    return {
      answer: () => `📱 Con gusto te conecto con un asesor.\n\nToca el botón verde de abajo para abrir WhatsApp directamente. ¡Te respondemos enseguida! 🙌`,
      waLabel: "recibir asesoría"
    }
  }
  return {
    answer: (n) => `🤔 ${n ? `*${n}*, no` : "No"} encontré información exacta sobre eso, pero un asesor puede ayudarte.\n\nPuedes elegir un tema de los botones o tocar el botón de WhatsApp. 👇`,
    waLabel: "consulta general"
  }
}

// Detecta intención desde texto libre (usa el KB por eso va aquí)
function extractIntent(raw) {
  const text = normalizeStr(cleanText(raw))
  for (const entry of KB) {
    if (entry.keywords.some(k => text.includes(normalizeStr(k)))) return entry
  }
  return null
}

// ─── Componentes ─────────────────────────────────────────────────────────────
const ChatPattern = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="wa-pat" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <rect x="10" y="10" width="8" height="14" rx="1.5" stroke="currentColor" fill="none" transform="rotate(-15 14 17)" />
        <path d="M40 20 h14 v10 l-4 -4 h-10 z" stroke="currentColor" fill="none" />
        <circle cx="80" cy="30" r="7" stroke="currentColor" fill="none" />
        <path d="M100 75 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5-4 l-4-1.5 l4-1.5 z" fill="currentColor" />
        <path d="M55 95 l4 4 l8-8" stroke="currentColor" fill="none" strokeWidth="1.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#wa-pat)" />
  </svg>
)

const TypingIndicator = () => (
  <div className="flex items-start relative z-10">
    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center border border-gray-100">
      {[0, 0.22, 0.44].map((delay, i) => (
        <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
      ))}
    </div>
  </div>
)

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

// ─── Estado de flujo ──────────────────────────────────────────────────────────
const STAGES = { NAME: "name", CITY: "city", DISTRICT: "district", FREE: "free" }

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

// ─── Componente principal ─────────────────────────────────────────────────────
function FloatingWhatsApp() {
  const saved = loadState()
  const [isOpen, setIsOpen]     = useState(false)
  const [stage, setStage]       = useState(saved?.stage || STAGES.NAME)
  const [userName, setUserName] = useState(saved?.userName || "")
  const [userCity, setUserCity] = useState(saved?.userCity || "")
  const [lastTopic, setLastTopic] = useState(saved?.lastTopic || "consulta general")
  const [messages, setMessages] = useState(saved?.messages || [])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojis, setShowEmojis] = useState(false)
  const [showCityList, setShowCityList] = useState(false)
  const chatRef   = useRef(null)
  const inputRef  = useRef(null)
  const initialized = useRef(!!saved)

  // Persistir
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ stage, userName, userCity, lastTopic, messages })) }
    catch {}
  }, [stage, userName, userCity, lastTopic, messages])

  const scrollToBottom = useCallback(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [])

  useEffect(() => {
    const t = setTimeout(scrollToBottom, 80)
    return () => clearTimeout(t)
  }, [messages, isTyping, isOpen, scrollToBottom])

  // Saludo inicial
  useEffect(() => {
    if (isOpen && !initialized.current) {
      initialized.current = true
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        addBotMsg(
          "👋 *¡Bienvenido/a a Proenergim!*\n\nSoy tu asistente virtual de energía solar. ☀️\n\nPara atenderte mejor, ¿cuál es tu nombre?",
          {}
        )
      }, 900)
    }
  }, [isOpen])

  function addBotMsg(text, extra = {}) {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: "bot", text, time: now(), ...extra }])
  }

  function addUserMsg(text) {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: "user", text, time: now() }])
  }

  function botReply(text, extraDelay = 0, extra = {}) {
    const d = Math.min(700 + text.length * 10, 2000) + extraDelay
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addBotMsg(text, extra)
    }, d)
  }

  const handleSend = useCallback((textOverride) => {
    const raw = (textOverride ?? inputValue).trim()
    if (!raw) return
    setInputValue("")
    setShowEmojis(false)
    setShowCityList(false)
    addUserMsg(raw)

    // ── ETAPA: Nombre ──
    if (stage === STAGES.NAME) {
      const info = extractFullInfo(raw)
      
      if (info.name && info.department) {
        setUserName(info.name)
        let locStr = info.department
        if (info.department === "Lima" && info.district) locStr = `Lima - ${info.district}`
        else if (info.city) locStr = `${info.city} (${info.department})`
        
        setUserCity(locStr)

        if (info.department === "Lima" && !info.district) {
          setStage(STAGES.DISTRICT)
          botReply(`¡Mucho gusto, *${info.name}*! 😊 Veo que estás en Lima. ¿En qué distrito te encuentras?`, 0)
        } else if (info.intent) {
          setStage(STAGES.FREE)
          setLastTopic(info.intent.waLabel)
          botReply(`¡Mucho gusto, *${info.name}*! 😊\n\n📍 *${locStr}*, anotado.\n\n${info.intent.answer(info.name)}`, 300, { showTopics: true })
        } else {
          setStage(STAGES.FREE)
          botReply(`¡Mucho gusto, *${info.name}*! 😊\n\n📍 *${locStr}*, perfecto.\n\n¿Sobre qué tema te puedo ayudar hoy?`, 300, { showTopics: true })
        }
        return
      }

      const nombre = info.name || extractSimpleName(raw)
      if (!nombre) {
        botReply(`😊 Disculpa, no pude captar tu nombre.\n\n¿Me puedes decir cómo te llamas?`, 0)
        return
      }

      setUserName(nombre)
      const loc = extractLocation(raw)
      
      if (loc.department) {
        let locStr = loc.department
        if (loc.department === "Lima" && loc.district) locStr = `Lima - ${loc.district}`
        else if (loc.city) locStr = `${loc.city} (${loc.department})`
        
        setUserCity(locStr)

        if (loc.department === "Lima" && !loc.district) {
          setStage(STAGES.DISTRICT)
          botReply(`¡Mucho gusto, *${nombre}*! 😊 Veo que estás en Lima. ¿En qué distrito te encuentras?`, 0)
        } else {
          setStage(STAGES.FREE)
          botReply(`¡Mucho gusto, *${nombre}*! 😊\n\n📍 *${locStr}*, anotado.\n\n¿Sobre qué tema te puedo ayudar hoy?`, 300, { showTopics: true })
        }
        return
      }

      setStage(STAGES.CITY)
      botReply(`¡Mucho gusto, *${nombre}*! 😊\n\n¿Desde qué ciudad o departamento del Perú nos escribes?`, 200, { showCityPicker: true })
      return
    }

    // ── ETAPA: Ciudad ──
    if (stage === STAGES.CITY) {
      const loc = extractLocation(raw)
      const finalLoc = loc.department || raw.replace(/\b\w/g, c => c.toUpperCase())
      
      if (finalLoc === "Lima" || finalLoc.includes("Lima")) {
        setUserCity("Lima")
        const dist = loc.district || extractDistrict(raw)
        if (dist) {
          setUserCity(`Lima - ${dist}`)
          setStage(STAGES.FREE)
          botReply(`📍 *Lima - ${dist}*, perfecto.\n\n*${userName}*, ¿sobre qué tema te puedo ayudar hoy? 😊`, 200, { showTopics: true })
        } else {
          setStage(STAGES.DISTRICT)
          botReply(`📍 *Lima*, anotado. ¿En qué distrito te encuentras?`, 0)
        }
        return
      }

      let displayLoc = finalLoc
      if (loc.city) displayLoc = `${loc.city} (${loc.department})`
      
      setUserCity(displayLoc)
      setStage(STAGES.FREE)
      botReply(`📍 *${displayLoc}*, anotado.\n\nPerfecto, *${userName}*! ¿Sobre qué tema te puedo ayudar? 😊`, 200, { showTopics: true })
      return
    }

    // ── ETAPA: Distrito (solo Lima) ──
    if (stage === STAGES.DISTRICT) {
      const dist = extractDistrict(raw) || raw.replace(/\b\w/g, c => c.toUpperCase())
      setUserCity(`Lima - ${dist}`)
      setStage(STAGES.FREE)
      botReply(`📍 *Lima - ${dist}*, ¡entendido!\n\n¿Sobre qué tema te puedo ayudar hoy, *${userName}*? 😊`, 200, { showTopics: true })
      return
    }

    // ── ETAPA: Chat libre ──
    const { answer, waLabel } = getBotResponse(raw)
    setLastTopic(waLabel)
    botReply(answer(userName || null), 0, { showTopics: true })
  }, [inputValue, stage, userName])

  const handleOptionClick = (label) => handleSend(label)
  const handleCityClick   = (city) => handleSend(city)
  const handleEmojiClick  = (em)   => { setInputValue(p => p + em); inputRef.current?.focus() }

  const clearAll = () => {
    setMessages([])
    setStage(STAGES.NAME)
    setUserName("")
    setUserCity("")
    setLastTopic("consulta general")
    setInputValue("")
    setShowCityList(false)
    initialized.current = true  // marcar como ya inicializado para evitar doble disparo
    localStorage.removeItem(STORAGE_KEY)
    // Si el chat ya estaba abierto, lanzar el saludo directamente
    if (isOpen) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages([{
          id: Date.now() + Math.random(),
          sender: "bot",
          text: "👋 *¡Bienvenido/a a Proenergim!*\n\nSoy tu asistente virtual de energía solar. ☀️\n\nPara atenderte mejor, ¿cuál es tu nombre?",
          time: now(),
        }])
      }, 900)
    }
  }

  const openWhatsApp = () => {
    // Línea de presentación
    const nombrePart = userName ? `*${userName}*` : "un visitante del sitio web"
    const ciudadPart = userCity ? ` desde *${userCity}*` : ""

    // Tema de consulta
    const lastUserMsg = [...messages].reverse().find(m => m.sender === "user")
    const tema = lastTopic !== "consulta general" && lastTopic
      ? lastTopic.charAt(0).toUpperCase() + lastTopic.slice(1)
      : lastUserMsg?.text || "Quisiera recibir más información."

    const msg =
      `👋 Hola, soy ${nombrePart}${ciudadPart}.\n` +
      `Me comuniqué desde el sitio web y quería consultar sobre:\n\n` +
      `❓ ${tema}`

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  const lastBotMsg = [...messages].reverse().find(m => m.sender === "bot")

  const inputPlaceholder =
    stage === STAGES.NAME ? "Escribe tu nombre..." :
    stage === STAGES.CITY ? "Escribe tu ciudad o departamento..." :
    "Escribe tu consulta..."

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="mb-4 w-[322px] sm:w-[390px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
            style={{ height: 560 }}
          >
            {/* ── Header ── */}
            <div className="bg-[#075e54] px-5 py-4 text-white shadow-md shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full p-0.5 shadow-inner shrink-0">
                    <img src={logoMobile} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm tracking-tight leading-none mb-1">Proenergim</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse shadow-[0_0_8px_#25D366]" />
                      <p className="text-[10px] font-bold opacity-90 uppercase tracking-widest leading-none">
                        {isTyping ? "Escribiendo..." : "En línea"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={clearAll} title="Nueva conversación" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all active:scale-90">
                    <Trash2 size={14} />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all active:scale-90">
                    <X size={16} />
                  </button>
                </div>
              </div>
              {(userName || userCity) && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {userName && <span className="text-[10px] bg-white/15 px-2.5 py-0.5 rounded-full font-bold">👤 {userName}</span>}
                  {userCity && <span className="text-[10px] bg-white/15 px-2.5 py-0.5 rounded-full font-bold">📍 {userCity}</span>}
                </div>
              )}
            </div>

            {/* ── Chat ── */}
            <div ref={chatRef} className="flex-1 relative bg-[#e5ddd5] px-4 py-4 overflow-y-auto scroll-smooth flex flex-col gap-2.5">
              <ChatPattern />

              {messages.length === 0 && !isTyping && (
                <div className="flex flex-col items-center justify-center h-full gap-3 relative z-10">
                  <div className="w-16 h-16 bg-white rounded-full p-1.5 shadow-md">
                    <img src={logoMobile} alt="Logo" className="w-full h-full object-contain opacity-50" />
                  </div>
                  <p className="text-xs text-gray-400 font-semibold">Iniciando conversación…</p>
                </div>
              )}

              {messages.map((msg) => {
                const isBot = msg.sender === "bot"
                const isLastBot = isBot && msg.id === lastBotMsg?.id
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col ${isBot ? "items-start" : "items-end"} relative z-10`}
                  >
                    <div className={`max-w-[90%] px-4 py-2.5 shadow-sm border text-[13px] leading-relaxed ${
                      isBot
                        ? "bg-white text-gray-800 rounded-2xl rounded-tl-none border-gray-100/80"
                        : "bg-[#d9fdd3] text-gray-800 rounded-2xl rounded-tr-none border-[#c5f0be]"
                    }`}>
                      {isBot && <p className="text-[9px] font-black text-[#075e54] mb-1 uppercase tracking-wider">Asesor Proenergim</p>}
                      <div className="font-medium whitespace-pre-wrap">{formatText(msg.text)}</div>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-0.5 px-1">{msg.time}</span>

                    {/* Selector de departamentos */}
                    {isLastBot && !isTyping && msg.showCityPicker && stage === STAGES.CITY && (
                      <div className="mt-2 w-full relative z-10">
                        <button
                          onClick={() => setShowCityList(p => !p)}
                          className="text-[11px] bg-white border border-gray-200 hover:border-[#25D366]/50 text-gray-600 font-bold px-4 py-2 rounded-full shadow-sm transition-all flex items-center gap-1.5"
                        >
                          📋 {showCityList ? "Ocultar lista" : "Ver departamentos"}
                        </button>
                        <AnimatePresence>
                          {showCityList && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden mt-2"
                            >
                              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-custom">
                                {DEPTS.map(d => (
                                  <button
                                    key={d}
                                    onClick={() => handleCityClick(d)}
                                    className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-[#dcf8c6] hover:border-[#25D366]/50 text-gray-700 transition-all shadow-sm active:scale-95"
                                  >
                                    {d}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Botones de temas */}
                    {isLastBot && !isTyping && msg.showTopics && stage === STAGES.FREE && (
                      <div className="mt-2 w-full relative z-10">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 px-0.5">
                          Selecciona un tema:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_OPTIONS.map(opt => (
                            <button
                              key={opt.key}
                              onClick={() => handleOptionClick(opt.label)}
                              className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-[#dcf8c6] hover:border-[#25D366]/50 text-[#075e54] transition-all shadow-sm active:scale-95"
                            >
                              {opt.label}
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
                  <TypingIndicator />
                </motion.div>
              )}
            </div>

            {/* ── Botón WhatsApp ── */}
            <div className="bg-white px-4 py-2 border-t border-gray-100 shrink-0">
              <button
                onClick={openWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BE5C] text-white font-black text-xs py-2.5 rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.15-1.265-.458-2.406-1.474-.89-.788-1.489-1.762-1.664-2.062-.175-.3-.019-.462.131-.611.136-.134.301-.349.45-.523.15-.174.2-.3.301-.497.101-.202.05-.376-.025-.525-.075-.15-.672-1.62-.924-2.215-.244-.58-.492-.501-.672-.51-.174-.008-.374-.008-.574-.008s-.525.074-.798.375c-.276.3-1.045 1.025-1.045 2.499s1.07 2.894 1.219 3.094c.15.195 2.109 3.238 5.106 4.536.713.31 1.267.495 1.701.633.714.227 1.365.195 1.88.118.575-.086 1.767-.721 2.016-1.42s.25-1.299.175-1.424c-.074-.125-.274-.2-.574-.35zM12.002 22C6.48 22 2 17.514 2 12S6.48 2 12.002 2c5.523 0 10.001 4.486 10.001 10s-4.478 10-10.001 10zM12.002 0C5.373 0 0 5.372 0 12c0 2.126.549 4.133 1.517 5.864L.015 24l6.305-1.654C8.016 23.364 9.944 24 12.002 24 18.631 24 24 18.628 24 12c0-6.628-5.369-12-11.998-12z" />
                </svg>
                Hablar con un asesor
              </button>
            </div>

            {/* ── Panel de emojis ── */}
            <AnimatePresence>
              {showEmojis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 border-t border-gray-100 px-4 py-2 overflow-hidden shrink-0"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {EMOJI_LIST.map(em => (
                      <button key={em} onClick={() => handleEmojiClick(em)} className="text-xl hover:scale-125 transition-transform active:scale-90 leading-none">
                        {em}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input ── */}
            <form
              onSubmit={e => { e.preventDefault(); handleSend() }}
              className="bg-[#f0f0f0] border-t border-gray-200 px-3 py-3 flex items-center gap-2 shrink-0"
            >
              <button
                type="button"
                onClick={() => setShowEmojis(p => !p)}
                className={`shrink-0 p-2 rounded-full transition-all ${showEmojis ? "bg-[#25D366]/20 text-[#075e54]" : "text-gray-400 hover:text-[#075e54] hover:bg-gray-200"}`}
              >
                <Smile size={20} />
              </button>
              <input
                ref={inputRef}
                type="text"
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 shadow-inner min-w-0"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="shrink-0 bg-[#25D366] disabled:bg-gray-300 text-white p-2.5 rounded-full shadow-md active:scale-90 disabled:opacity-50 transition-all"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Botón flotante ── */}
      <div className="relative group">
        {!isOpen && (
          <span className="absolute right-full mr-5 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs font-black px-5 py-2.5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-100 whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-x-2">
            ¿Cómo podemos ayudarte?
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-t border-r border-gray-100 rotate-45" />
          </span>
        )}
        <motion.button
          onClick={() => setIsOpen(p => !p)}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className={`${isOpen ? "bg-[#075e54]" : "bg-[#25D366] shadow-[0_8px_30px_rgb(37,211,102,0.4)]"} text-white p-4 flex items-center justify-center rounded-full transition-all duration-300 relative z-10`}
        >
          {isOpen ? <X size={26} strokeWidth={3} /> : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.15-1.265-.458-2.406-1.474-.89-.788-1.489-1.762-1.664-2.062-.175-.3-.019-.462.131-.611.136-.134.301-.349.45-.523.15-.174.2-.3.301-.497.101-.202.05-.376-.025-.525-.075-.15-.672-1.62-.924-2.215-.244-.58-.492-.501-.672-.51-.174-.008-.374-.008-.574-.008s-.525.074-.798.375c-.276.3-1.045 1.025-1.045 2.499s1.07 2.894 1.219 3.094c.15.195 2.109 3.238 5.106 4.536.713.31 1.267.495 1.701.633.714.227 1.365.195 1.88.118.575-.086 1.767-.721 2.016-1.42s.25-1.299.175-1.424c-.074-.125-.274-.2-.574-.35zM12.002 22C6.48 22 2 17.514 2 12S6.48 2 12.002 2c5.523 0 10.001 4.486 10.001 10s-4.478 10-10.001 10zM12.002 0C5.373 0 0 5.372 0 12c0 2.126.549 4.133 1.517 5.864L.015 24l6.305-1.654C8.016 23.364 9.944 24 12.002 24 18.631 24 24 18.628 24 12c0-6.628-5.369-12-11.998-12z" />
            </svg>
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default FloatingWhatsApp
