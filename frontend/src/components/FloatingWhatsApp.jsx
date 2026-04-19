import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Trash2, Clock, RefreshCcw, MessageSquarePlus, ExternalLink } from "lucide-react"
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

const TEMAS = [
  { 
    key: "cotizacion",    label: "💰 Cotización", msg: "solicitar una cotización", autoWA: true,
    info: "Ofrecemos cotizaciones personalizadas y a medida garantizando el mayor beneficio para tu proyecto."
  },
  { 
    key: "productos",     label: "📦 Nuestros Productos", msg: "información de productos", autoWA: true,
    info: "Ofrecemos venta directa de paneles solares, baterías, inversores y luminarias de alta gama.",
    link: "/productos", linkLabel: "Ir a Catálogo de Productos"
  },
  { 
    key: "servicios",     label: "🛠️ Nuestros Servicios", msg: "información sobre sus servicios",
    info: "Brindamos servicios de ingeniería, instalación y soporte técnico especializado para sistemas solares fotovoltaicos.",
    link: "/soluciones", linkLabel: "Ver todos los Servicios"
  },
  { 
    key: "bombeo",        label: "💧 Bombeo Solar", msg: "saber sobre bombeo solar", autoWA: true,
    info: "Instalamos sistemas de bombeo con paneles solares ideales para agricultura, reduciendo tus costos operativos al máximo.",
    link: "/soluciones", linkLabel: "Ver Soluciones de Bombeo"
  },
  { 
    key: "riego",         label: "🌱 Riego tecnificado", msg: "saber sobre riego tecnificado", autoWA: true,
    info: "Nuestras soluciones de riego eficiente están energizadas 100% con energía solar fotovoltaica.",
    link: "/soluciones", linkLabel: "Explorar Riego Solar"
  },
  { 
    key: "electrifica",   label: "⚡ Electrificación", msg: "saber sobre electrificación solar", autoWA: true,
    info: "Diseñamos sistemas solares integrales para hogares, comercios e industrias con equipos europeos garantizados.",
    link: "/soluciones", linkLabel: "Nuestras Soluciones"
  },
  { 
    key: "industrial",    label: "🏭 Industrial", msg: "proyectos industriales", autoWA: true,
    info: "Para la industria ejecutamos proyectos fotovoltaicos a gran escala para asegurar tu autonomía energética."
  },
  { 
    key: "mantenimiento", label: "🔧 Mantenimiento", msg: "servicio de mantenimiento",
    info: "Brindamos planes de mantenimiento y reparación preventiva/correctiva de sistemas solares y electrobombas."
  },
  { 
    key: "contacto",      label: "📞 Contacto Directo", msg: "comunicarse con un asesor", autoWA: true,
    info: "Te conectaremos de inmediato con uno de nuestros especialistas para atender tu solicitud."
  },
  { 
    key: "quienes",       label: "👥 Quienes somos", msg: "saber sobre quienes somos",
    info: "Somos Proenergim, líderes en soluciones de energía renovable en el Perú con amplia experiencia en todo el país.",
    link: "/nosotros", linkLabel: "Conocer más de nosotros"
  },
  { 
    key: "trabaja",       label: "💼 Trabaja con nosotros", msg: "saber sobre trabajar con nosotros", autoWA: true,
    info: "Buscamos a los mejores talentos apasionados por la energía limpia. Puedes adjuntar tu CV directamente por WhatsApp."
  },
  { 
    key: "alianzas",      label: "🤝 Alianzas", msg: "saber sobre alianzas", autoWA: true,
    info: "Construimos alianzas empresariales sostenibles y estratégicas para expandir la cobertura renovable."
  },
  { 
    key: "otros",         label: "❓ Otra consulta", msg: "una consulta general", autoWA: true,
    info: "Cuéntanos brevemente qué necesitas y te conectaremos con el área encargada."
  }
]

function getThemeObj(key) {
   let f = TEMAS.find(t => t.key === key);
   if (f) return f;
   for (let m of TEMAS) {
      if (m.subtopics) {
         let sub = m.subtopics.find(s => s.key === key);
         if (sub) return sub;
      }
   }
   return null;
}

// ─── Flujo de etapas ──────────────────────────────────────────────────────────
const STAGE = { WELCOME: "welcome", NAME: "name", PHONE: "phone", LOCATION: "location", DISTRICT: "district", TOPIC: "topic", SUBTOPIC: "subtopic", DONE: "done" }

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
  const navigate = useNavigate()
  const saved = loadState()
  const [isOpen, setIsOpen] = useState(false)
  const [stage, setStage] = useState(saved?.stage || STAGE.WELCOME)
  const [userName, setUserName] = useState(saved?.userName || "")
  const [userPhone, setUserPhone] = useState(saved?.userPhone || "")
  const [userLocation, setUserLocation] = useState(saved?.userLocation || "")
  const [userTopic, setUserTopic] = useState(saved?.userTopic || "")
  const [messages, setMessages] = useState(saved?.messages || [])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showDistrictList, setShowDistrictList] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [topicModal, setTopicModal] = useState(null)
  const [historyList, setHistoryList] = useState([])
  const chatRef = useRef(null)
  const inputRef = useRef(null)
  const initialized = useRef(!!saved?.messages?.length)

  // Persistir estado
  useEffect(() => {
    saveState({ stage, userName, userPhone, userLocation, userTopic, messages })
  }, [stage, userName, userPhone, userLocation, userTopic, messages])

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
          "☀️ *¡Bienvenido a Proenergim!*\n\nSomos especialistas en energía solar en todo el Perú. Estoy aquí para ayudarte.\n\n¿Cuál es tu nombre?"
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
  async function sendFinalLead(name, location, topicKey, skipWaOpen = false) {
    const topicObj = getThemeObj(topicKey);
    const topicLabel = topicObj?.msg || topicKey;

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

    // Abrir WhatsApp directamente SIN setTimeout para evitar que el navegador bloquee la ventana pop-up (popup blocker)
    if (!skipWaOpen) {
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}`, "_blank")
    }

    // Guardar en MongoDB
    try {
      await fetch(`${API_URL}/api/chat-leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: `${name} (${userPhone})`, ciudad: location, tema: topicLabel, origen: "chat_flotante" })
      })
    } catch {}

    // Enviar email
    try {
      await fetch(`${API_URL}/api/chat-leads/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: `${name} (${userPhone})`, ubicacion: location, tema: topicLabel })
      })
    } catch {}
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
      const extracted = extractName(raw) || raw.replace(/\b\w/g, c => c.toUpperCase())
      setUserName(extracted)
      setStage(STAGE.PHONE)
      botReply(`¡Mucho gusto, ${extracted}! 😊\n\nPor favor, indícanos tu número de celular o teléfono para registrar tu consulta.`, 400)
      return
    }

    // ETAPA: Celular
    if (stage === STAGE.PHONE) {
      const match = raw.match(/\d/g);
      if (!match || match.length < 6) {
        botReply(`Por favor, ingresa un número de teléfono válido (por ejemplo: 987654321).`, 0);
        return;
      }
      setUserPhone(raw);
      setStage(STAGE.LOCATION)
      botReply(`¡Anotado!\n\n¿Desde qué departamento del Perú nos escribes o se realizaría tu proyecto?`, 400, { showDepts: true })
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

    // ETAPA: Tema o texto libre final
    if (stage === STAGE.TOPIC || stage === STAGE.SUBTOPIC) {
      handleTopicSelected("otros")
      return;
    }

    if (stage === STAGE.DONE) {
      const isSales = getThemeObj(userTopic)?.autoWA;
      if (isSales) {
        setUserTopic(raw);
        botReply(`Anotado. Haz clic en el botón de abajo para enviar tu solicitud exacta al asesor: "${raw}".`, 0);
      } else {
        setStage(STAGE.TOPIC);
        botReply(`¡Entendido! ¿Sobre qué otro tema te gustaría consultar ahora, ${userName}?`, 300, { showTopics: true });
      }
    }
  }, [inputValue, stage, userName, userLocation, userPhone])

  function handleTopicSelected(key) {
    const tema = getThemeObj(key)
    if (!tema) return;
    
    // Almacena el mensaje del usuario visualmente en el chat
    addUserMsg(tema.label)

    if (tema.subtopics) {
      setStage(STAGE.SUBTOPIC)
      botReply(`Entiendo. ¿Cuál de estas opciones describe mejor tu consulta, ${userName}?`, 200, { showSubtopicsFor: tema.key })
      return
    }

    setUserTopic(key)
    setStage(STAGE.DONE)

    const loc = userLocation || "(no especificada)"
    const name = userName || "visitante"

    // Concatenamos la info que sacamos de la página con la respuesta confirmatoria
    let infoPrefix = tema.info ? `${tema.info}\n\n` : "";
    let confirmMsg = `${infoPrefix}✅ *¡Perfecto, ${name}!*\n\n`;

    if (tema.link) {
      confirmMsg += `Tenemos una sección dedicada para *${tema.label}*. En un momento verás las opciones disponibles 🔍`;
    } else if (tema.autoWA) {
      confirmMsg += `*Resumen de lo solicitado:*\n• *Tema:* ${tema.msg}\n\nTe comunicaremos con un asesor. En breve se abrirá WhatsApp. 🚀`;
    } else {
      confirmMsg += `*Resumen de lo solicitado:*\n• *Tema:* ${tema.msg}\n\nHaz clic abajo para contactar a un asesor cuando lo desees. 👇`;
    }
    
    // Escribimos el mensaje inmediatamente con toda la info
    botReply(confirmMsg, 0);

    if (tema.link) {
      // Si el tema tiene un link asociado, interceptamos para mostrar el Modal Interactivo
      setTimeout(() => {
        setTopicModal({ ...tema, name, loc, key });
      }, 1500); // 1.5s delay para que pueda leer la primera línea del bot
      return;
    }
    
    // Si no tiene link, seguimos el flujo regular de ventas
    const shouldSkipWa = !tema.autoWA;
    
    if (!shouldSkipWa) {
      // Damos 5.5 segundos para que puedan leer el párrafo informativo tranquilamente
      setTimeout(() => {
        sendFinalLead(name, loc, key, false);
      }, 5500);
    }
  }

  function deleteHistoryItem(id) {
    const updated = historyList.filter(x => x.id !== id)
    setHistoryList(updated)
    const toSave = [...updated].reverse()
    localStorage.setItem('proenergim_chat_hist_v1', JSON.stringify(toSave))
  }

  function saveCurrentToHistory() {
    const hasUserInteraction = messages.some(m => m.sender === 'user');
    if (hasUserInteraction) {
      const hist = JSON.parse(localStorage.getItem('proenergim_chat_hist_v1') || '[]')
      hist.push({ id: Date.now(), date: new Date().toLocaleDateString(), time: now(), messages, userName, userPhone, userLocation, userTopic, stage })
      localStorage.setItem('proenergim_chat_hist_v1', JSON.stringify(hist))
    }
  }

  function loadHistoryItem(h) {
    saveCurrentToHistory()
    // Remover el que estamos cargando del historial y actualizar
    const currentHist = JSON.parse(localStorage.getItem('proenergim_chat_hist_v1') || '[]')
    const updated = currentHist.filter(x => x.id !== h.id)
    localStorage.setItem('proenergim_chat_hist_v1', JSON.stringify(updated))
    setHistoryList(updated.reverse())

    // Sobreescribir estado local
    setMessages(h.messages || [])
    setUserName(h.userName || "")
    setUserPhone(h.userPhone || "")
    setUserLocation(h.userLocation || "")
    setUserTopic(h.userTopic || "")
    setStage(h.stage || STAGE.DONE)
    setShowHistory(false)
  }

  function clearAll(wipeHistory = false) {
    if (wipeHistory) {
      localStorage.removeItem('proenergim_chat_hist_v1')
      setHistoryList([])
    } else {
      const hasUserInteraction = messages.some(m => m.sender === 'user');
      
      // Si ya estamos en una conversación nueva (sin interacción de usuario)
      if (!hasUserInteraction) {
         setShowHistory(false)
         return; 
      }
      saveCurrentToHistory()
    }

    setShowDeleteModal(false)
    setShowHistory(false)
    setMessages([])
    setStage(STAGE.WELCOME)
    setUserName("")
    setUserPhone("")
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
    stage === STAGE.PHONE    ? "Escribe tu celular..." :
    stage === STAGE.LOCATION ? "Escribe tu departamento..." :
    stage === STAGE.DISTRICT ? "Escribe tu distrito..." :
    stage === STAGE.TOPIC    ? "Describe tu consulta..." :
    "Escribe aquí..."

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="mb-3 w-[300px] h-[460px] sm:mb-4 sm:w-[380px] sm:h-[540px] max-h-[82vh] bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative"
          >
            {/* ── Header ── */}
            <div className="bg-[#075e54] px-4 py-3 sm:px-5 sm:py-4 text-white shrink-0">
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
                  <button onClick={() => {
                    const hist = JSON.parse(localStorage.getItem('proenergim_chat_hist_v1') || '[]')
                    setHistoryList(hist.reverse())
                    setShowHistory(!showHistory)
                  }} title="Historial"
                    className={`bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all active:scale-90 ${showHistory ? "bg-white/30 shadow-inner" : ""}`}>
                    <Clock size={14}/>
                  </button>
                  <button onClick={() => setShowDeleteModal(true)} title="Eliminar todo el historial"
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all active:scale-90">
                    <Trash2 size={14}/>
                  </button>
                  <button onClick={() => setIsOpen(false)}
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all active:scale-90">
                    <X size={16}/>
                  </button>
                </div>
              </div>

              {/* ── Modal de Confirmación para Delete ── */}
              <AnimatePresence>
                {showDeleteModal && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 z-50 rounded-[2rem] flex items-center justify-center p-6 backdrop-blur-[2px]">
                     <motion.div 
                        initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 5 }}
                        className="bg-white rounded-3xl p-5 text-center shadow-xl flex flex-col gap-3 w-full relative overflow-hidden">
                        <div className="mx-auto w-10 h-10 bg-red-100/50 rounded-full flex items-center justify-center mb-1 relative z-10">
                           <Trash2 className="text-red-500" size={20}/>
                        </div>
                        <h4 className="font-black text-gray-800 tracking-tight text-[15px] relative z-10">Vaciar Todo</h4>
                        <p className="text-[11px] text-gray-500 mb-2 leading-relaxed relative z-10 px-2">
                          ¿Estás seguro de eliminar tu historial actual y reiniciar tu chat? Esta acción borrará todas las charlas.
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-1 relative z-10">
                           <button onClick={() => setShowDeleteModal(false)}
                                   className="py-2.5 rounded-xl font-bold text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-95">
                              Cancelar
                           </button>
                           <button onClick={() => clearAll(true)}
                                   className="py-2.5 rounded-xl font-bold text-xs bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 transition-all active:scale-95">
                              Sí, vaciar
                           </button>
                        </div>
                     </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Modal Contextual de Rutas ── */}
              <AnimatePresence>
                {topicModal && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 z-50 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center p-6 backdrop-blur-[2px]">
                     <motion.div 
                        initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 5 }}
                        className="bg-white rounded-3xl p-5 text-center shadow-xl flex flex-col gap-3 w-full relative overflow-hidden">
                        
                        <div className="mx-auto w-10 h-10 bg-[#075e54]/10 rounded-full flex items-center justify-center mb-1 relative z-10">
                           <ExternalLink className="text-[#075e54]" size={20}/>
                        </div>
                        <h4 className="font-black text-gray-800 tracking-tight text-[15px] relative z-10">Más Detalles</h4>
                        <p className="text-[12px] text-gray-500 mb-2 leading-relaxed relative z-10 px-1">
                          Tenemos una sección donde explicamos más sobre <strong>{topicModal.label}</strong>. ¿Qué quieres hacer ahora?
                        </p>
                        
                        <div className="flex flex-col gap-2 mt-1 relative z-10">
                           <button onClick={() => {
                                 const link = topicModal.link;
                                 setTopicModal(null);
                                 setIsOpen(false);
                                 navigate(link);
                               }}
                               className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#075e54] text-white hover:bg-[#064e46] shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                              {topicModal.linkLabel || "Visitar Página"}
                           </button>
                           {topicModal.autoWA ? (
                             <button onClick={() => {
                                   const tm = topicModal;
                                   setTopicModal(null);
                                   setIsTyping(true);
                                   setTimeout(() => {
                                     setIsTyping(false);
                                     botReply(`⏳ *Preparando conexión...*\n\nConectando tu solicitud sobre *${tm.msg}* con nuestro especialista. Se abrirá WhatsApp en unos segundos 🚀`, 0);
                                     setTimeout(() => {
                                       sendFinalLead(tm.name, tm.loc, tm.key, false);
                                     }, 4500);
                                   }, 800);
                                 }}
                                 className="w-full py-2.5 rounded-xl font-bold text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                                Continuar a WhatsApp
                             </button>
                           ) : (
                             <button onClick={() => {
                                   setTopicModal(null);
                                   setStage(STAGE.TOPIC);
                                   botReply(`¡Claro! ¿Sobre qué otro tema te puedo ayudar, ${userName}?`, 300, { showTopics: true });
                                 }}
                                 className="w-full py-2.5 rounded-xl font-bold text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                                Realizar otra consulta
                             </button>
                           )}
                        </div>
                     </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progreso */}
              {(userName || userLocation) && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {userName     && <span className="text-[10px] bg-white/15 px-2.5 py-0.5 rounded-full font-bold">👤 {userName}</span>}
                  {userLocation && <span className="text-[10px] bg-white/15 px-2.5 py-0.5 rounded-full font-bold">📍 {userLocation}</span>}
                </div>
              )}
            </div>

            {/* ── Chat o Historial ── */}
            <div ref={chatRef}
              className="flex-1 relative bg-[#e5ddd5] px-4 py-4 overflow-y-auto scroll-smooth flex flex-col gap-2.5">
              <ChatBg/>

              {showHistory ? (
                <div className="relative z-10 flex flex-col gap-2 h-full">
                  <h4 className="text-[11px] font-bold text-center text-gray-400 mb-0 mt-1 uppercase tracking-widest">Tus Charlas</h4>
                  
                  {messages.length > 0 && (
                    <div className="bg-white/90 p-3.5 rounded-2xl shadow-sm border-[1.5px] border-[#25D366]/60 hover:bg-white flex flex-col gap-1 cursor-pointer transition-all relative group"
                         onClick={() => setShowHistory(false)} title="Volver al chat actual">
                         <div className="absolute top-3 right-3 flex items-center gap-1.5">
                           <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"/>
                           <span className="text-[9px] text-[#075e54] font-black uppercase tracking-widest">Activo</span>
                         </div>
                         <div className="text-xs font-bold text-gray-800 pr-12">
                           {userName ? `👤 ${userName}` : "Nueva conversación..."}
                         </div>
                         <div className="text-[11px] text-gray-500 font-medium">
                           {messages.length} mensajes recientes
                         </div>
                    </div>
                  )}

                  {historyList.filter(h => h.id !== "current").map(h => (
                      <div key={h.id} className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow-md flex flex-col gap-1.5 transition-all cursor-pointer relative group"
                           onClick={() => loadHistoryItem(h)} title="Cargar este chat">
                         <button onClick={(e) => { e.stopPropagation(); deleteHistoryItem(h.id); }} 
                                 title="Eliminar charla"
                                 className="absolute top-2.5 right-2 text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all active:scale-90 opacity-0 group-hover:opacity-100">
                            <Trash2 size={14}/>
                         </button>
                         <div className="flex items-center gap-1.5 border-b border-gray-50 pb-2 mb-0.5">
                           <span className="text-[10px] font-semibold text-gray-400">{h.date} • {h.time}</span>
                           <span className="text-[9px] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-bold">{h.messages?.length} msgs</span>
                         </div>
                         <div className="text-[13px] font-bold text-gray-800 pr-8">
                           {h.userName ? `👤 ${h.userName}` : "👤 Anónimo"}
                         </div>
                         <div className="text-[11px] text-gray-600 font-medium bg-gray-50 px-2.5 py-1 rounded-lg self-start mt-0.5">
                           {h.userTopic ? `📌 ${getThemeObj(h.userTopic)?.label || h.userTopic}` : "📌 No finalizado"}
                         </div>
                      </div>
                  ))}

                  {messages.length === 0 && historyList.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-6 opacity-60">
                      <MessageSquarePlus size={24} className="text-gray-400 mb-2"/>
                      <p className="text-center text-xs font-semibold text-gray-500">No hay historial</p>
                    </div>
                  )}

                  <div className="mt-auto pt-2 border-t border-[#e5ddd5]/50">
                    <button onClick={() => { clearAll(); setShowHistory(false); }} 
                            className="text-[12px] font-bold text-white bg-gray-900 hover:bg-black py-3 w-full rounded-2xl transition-all shadow-md active:scale-95 flex justify-center items-center gap-1.5">
                       <MessageSquarePlus size={14}/> Nuevo chat
                    </button>
                  </div>
                </div>
              ) : (
                <>
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

                    {/* Botones de subtemas */}
                    {isLast && !isTyping && msg.showSubtopicsFor && stage === STAGE.SUBTOPIC && (
                      <div className="mt-2 w-full relative z-10">
                        <div className="flex flex-wrap gap-1.5">
                          {(TEMAS.find(t => t.key === msg.showSubtopicsFor)?.subtopics || []).map(sub => (
                            <button key={sub.key} onClick={() => handleTopicSelected(sub.key)}
                              className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-[#dcf8c6] hover:border-[#25D366]/50 text-[#075e54] transition-all shadow-sm active:scale-95">
                              {sub.label}
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
                </>
              )}
            </div>

            {/* ── Botones Finales ── */}
            <div className="bg-white px-4 py-2 border-t border-gray-100 shrink-0 flex flex-col gap-1.5">
              {!showHistory && isDone && (
                <button onClick={() => {
                  setStage(STAGE.TOPIC)
                  botReply(`¡Claro! ¿Sobre qué otro tema te puedo ayudar, ${userName}?`, 300, { showTopics: true })
                }} className="w-full flex items-center justify-center gap-1.5 font-bold text-[11px] py-1.5 rounded-full transition-all shadow-sm bg-gray-50 hover:bg-gray-100 text-gray-600 active:scale-95 border border-gray-200">
                  <RefreshCcw size={12}/> Realizar otra consulta
                </button>
              )}
              <button 
                disabled={showHistory || !isDone}
                onClick={() => {
                  const key = userTopic;
                  const name = userName || "visitante";
                  const loc = userLocation || "(no especificada)";
                  const msgName = getThemeObj(key)?.msg || key;
                  
                  setIsTyping(true);
                  setTimeout(() => {
                    setIsTyping(false);
                    botReply(`⏳ *Preparando conexión...*\n\nConectando tu solicitud sobre *${msgName}* con nuestro especialista. Se abrirá WhatsApp en unos segundos 🚀`, 0);
                    setTimeout(() => {
                      sendFinalLead(name, loc, key, false);
                    }, 4500);
                  }, 800);
                }}
                className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-2.5 rounded-full transition-all shadow-sm ${
                  isDone && !showHistory
                    ? "bg-[#25D366] hover:bg-[#20BE5C] text-white active:scale-95 cursor-pointer" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}>
                <WAIcon size={13}/>
                Comunicarme con un asesor
              </button>
            </div>

            {/* ── Input ── */}
            {!showHistory && (
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
          className={`${isOpen ? "bg-[#075e54]" : "bg-[#25D366] shadow-[0_8px_30px_rgb(37,211,102,0.4)]"} text-white p-3.5 sm:p-4 flex items-center justify-center rounded-full transition-all duration-300 relative z-10`}>
          {isOpen ? <X size={26} strokeWidth={3}/> : <WAIcon size={26}/>}
        </motion.button>
      </div>
    </div>
  )
}
