import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send } from "lucide-react"
import logoMobile from "../assets/logo-movile.webp"

const WHATSAPP = "51971812567"

const ChatPattern = ({ opacity = "opacity-[0.08]" }) => (
  <svg className={`absolute inset-0 w-full h-full pointer-events-none ${opacity}`} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="wa-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        {/* Phone */}
        <rect x="10" y="10" width="8" height="14" rx="1.5" stroke="currentColor" fill="none" transform="rotate(-15 14 17)" />
        {/* Message */}
        <path d="M40 20 h14 v10 l-4 -4 h-10 z" stroke="currentColor" fill="none" transform="rotate(10 47 25)" />
        {/* Clock */}
        <circle cx="80" cy="30" r="7" stroke="currentColor" fill="none" />
        <path d="M80 30 v-4 M80 30 h3" stroke="currentColor" fill="none" />
        {/* Camera */}
        <rect x="20" y="55" width="14" height="10" rx="2" stroke="currentColor" fill="none" />
        <circle cx="27" cy="60" r="2.5" stroke="currentColor" fill="none" />
        {/* Music note */}
        <path d="M60 65 v12 m0 -12 l6 -2.5 v12" stroke="currentColor" fill="none" />
        {/* Star */}
        <path d="M100 75 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5-4 l-4-1.5 l4-1.5 z" fill="currentColor" />
        {/* Wave */}
        <path d="M15 95 c6-6 12 6 18 0" stroke="currentColor" fill="none" strokeWidth="1.5" />
        {/* Check */}
        <path d="M55 95 l4 4 l8-8" stroke="currentColor" fill="none" strokeWidth="1.5" />
        {/* Heart */}
        <path d="M95 105 c-2.5-2.5-6.5 0-6.5 4 c0 4 6.5 9 6.5 9 s6.5-5 6.5-9 c0-4-4-6.5-6.5-4" fill="currentColor" />
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#wa-pattern)" />
  </svg>
)

const PREDEFINED_MESSAGES = [
  "Hola, me gustaría solicitar información",
  "Quisiera una cotización de paneles",
  "Necesito soporte técnico",
  "Hablar con un asesor comercial"
]

function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const openWhatsApp = (text) => {
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
    setMessage("")
    setIsOpen(false)
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    openWhatsApp(message)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[320px] sm:w-[380px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
          >
            {/* Header (Solid Dark Green) */}
            <div className="relative bg-[#075e54] p-5 text-white overflow-hidden shadow-sm">
               <div className="relative z-10 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center p-0.5 shadow-sm">
                     <img src={logoMobile} alt="Logo" className="w-8 h-auto object-contain" />
                   </div>
                   <div>
                     <h3 className="font-bold text-sm tracking-tight">Proenergim</h3>
                     <p className="text-[10px] opacity-80">En línea</p>
                   </div>
                 </div>
                 <button 
                   onClick={() => setIsOpen(false)}
                   className="bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors flex items-center justify-center"
                 >
                   <X size={15} />
                 </button>
               </div>
            </div>

            {/* Conversation Area (Beige with Pattern) */}
            <div className="relative bg-[#e5ddd5] p-4 flex flex-col gap-4 min-h-[220px] max-h-[400px] overflow-y-auto">
              <ChatPattern opacity="opacity-[0.08]" />
              
              {/* Agent Bubble */}
              <div className="relative z-10 flex flex-col gap-1 items-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-[13px] text-gray-800 leading-relaxed border border-gray-100/50">
                  <p className="font-bold text-[10px] text-[#075e54] mb-1 uppercase tracking-wider">Asesor Proenergim</p>
                  ¡Hola! 👋 Bienvenido a Proenergim. <br /> ¿En qué podemos ayudarte hoy?
                </div>
                <span className="text-[9px] text-gray-500 pl-1 font-medium">Justo ahora</span>
              </div>

              {/* Suggestions */}
              <div className="relative z-10 flex flex-col gap-2.5 mt-2">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1">Sugerencias rápidas:</p>
                <div className="flex flex-col gap-2">
                  {PREDEFINED_MESSAGES.map((btnText, idx) => (
                    <button
                      key={idx}
                      onClick={() => openWhatsApp(btnText)}
                      className="bg-[#dcf8c6] hover:bg-[#c9eeb0] text-[#064e40] text-[12px] font-semibold py-2.5 px-4 rounded-xl text-left transition-all duration-200 shadow-sm self-start border border-[#c6e9a7] hover:-translate-y-0.5"
                    >
                      {btnText}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input area */}
            <form 
              onSubmit={handleSend}
              className="p-3 bg-[#f0f0f0] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#25D366] transition-all shadow-inner"
              />
              <button
                type="submit"
                className="bg-[#25D366] hover:bg-[#20BE5C] text-white p-3 rounded-full transition-all duration-300 shadow-md group disabled:opacity-50"
                disabled={!message.trim()}
              >
                <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group flex items-center">
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-white text-gray-700 text-[13px] font-bold px-4 py-2 rounded-xl shadow-lg border border-gray-100 whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 after:content-[''] after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-[8px] after:border-transparent after:border-l-white">
            ¿Necesitas ayuda?
          </span>
        )}
        
        <div className="relative">
          {/* Anillo de latidos (Heartbeat pop effect) */}
          {!isOpen && (
            <motion.div 
              animate={{ 
                scale: [1, 1.25, 1.15, 1.35, 1], 
                opacity: [0, 0.4, 0.3, 0.45, 0] 
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                times: [0, 0.1, 0.2, 0.4, 1] 
              }}
              className="absolute inset-0 rounded-full bg-[#25D366] z-0"
              style={{ willChange: "transform, opacity" }}
            />
          )}

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            animate={!isOpen ? {
              scale: [1, 1.05, 1.02, 1.08, 1],
              transition: { 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                times: [0, 0.1, 0.2, 0.4, 1] 
              }
            } : { scale: 1 }}
            className="bg-[#25D366] text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center relative z-10"
            style={{ willChange: "transform" }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={16} />
                </motion.div>
              ) : (
                <motion.div
                  key="wa"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.15-1.265-.458-2.406-1.474-.89-.788-1.489-1.762-1.664-2.062-.175-.3-.019-.462.131-.611.136-.134.301-.349.45-.523.15-.174.2-.3.301-.497.101-.202.05-.376-.025-.525-.075-.15-.672-1.62-.924-2.215-.244-.58-.492-.501-.672-.51-.174-.008-.374-.008-.574-.008s-.525.074-.798.375c-.276.3-1.045 1.025-1.045 2.499s1.07 2.894 1.219 3.094c.15.195 2.109 3.238 5.106 4.536.713.31 1.267.495 1.701.633.714.227 1.365.195 1.88.118.575-.086 1.767-.721 2.016-1.42s.25-1.299.175-1.424c-.074-.125-.274-.2-.574-.35zM12.002 22C6.48 22 2 17.514 2 12S6.48 2 12.002 2c5.523 0 10.001 4.486 10.001 10s-4.478 10-10.001 10zM12.002 0C5.373 0 0 5.372 0 12c0 2.126.549 4.133 1.517 5.864L.015 24l6.305-1.654C8.016 23.364 9.944 24 12.002 24 18.631 24 24 18.628 24 12c0-6.628-5.369-12-11.998-12z" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default FloatingWhatsApp
