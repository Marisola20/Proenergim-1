"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, CheckCircle } from "lucide-react";

const EFFECTS = {
  shimmer: ({ href, children, className, onClick }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      onClick={onClick}
      className={`group relative inline-flex items-center gap-2 overflow-hidden bg-[#25D366] hover:bg-[#20BE5C] text-white font-black px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
      {children}
    </a>
  ),

  ripple: ({ href, children, className, onClick }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(e) => {
        const btn = e.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;
        const rect = btn.getBoundingClientRect();
        circle.style.cssText = `
          width:${diameter}px;height:${diameter}px;
          left:${e.clientX - rect.left - radius}px;
          top:${e.clientY - rect.top - radius}px;
          position:absolute;border-radius:50%;
          background:rgba(255,255,255,0.35);
          transform:scale(0);animation:ripple 600ms linear;
          pointer-events:none;
        `;
        btn.appendChild(circle);
        circle.addEventListener("animationend", () => circle.remove());
        if (onClick) onClick(e);
      }}
      className={`relative inline-flex items-center gap-2 overflow-hidden bg-[#25D366] hover:bg-[#20BE5C] text-white font-black px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
    >
      {children}
    </a>
  ),

  magnetic: ({ href, children, className, onClick }) => {
    const ref = useRef(null);
    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        onMouseEnter={() => { if (ref.current) ref.current.style.transition = "transform 0.1s ease"; }}
        onMouseMove={(e) => {
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
          ref.current.style.transform = `translate(${x}px, ${y}px)`;
        }}
        onMouseLeave={() => {
          if (!ref.current) return;
          ref.current.style.transition = "transform 0.4s ease";
          ref.current.style.transform = "translate(0,0)";
        }}
        className={`inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BE5C] text-white font-black px-8 py-4 rounded-full shadow-lg hover:shadow-xl ${className}`}
      >
        {children}
      </a>
    );
  },

  pulse: ({ href, children, className, onClick }) => (
    <span className="relative inline-flex">
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        onClick={onClick}
        className={`relative z-10 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BE5C] text-white font-black px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
      >
        {children}
      </a>
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
    </span>
  ),
};

const WAIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function ActionSection({
  icon,
  title,
  description,
  buttonLabel,
  buttonHref,
  buttonEffect = "magnetic",
  accentFrom = "#38bdf8",
  accentTo = "#1ed760",
  isProveedores = false,
}) {
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, success
  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "" });
  
  const ButtonComponent = EFFECTS[buttonEffect];

  const handleProveedorSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.correo || !form.telefono) return;
    
    setStatus("success");
    
    // Armar el mensaje dinámico
    const lineas = [
      "Hola, me interesa unirme a su red de proveedores y aliados estratégicos.",
      "",
      "*Datos del contacto:*",
      "*Nombre/Empresa:* " + form.nombre,
      "*Correo:* " + form.correo,
      "*Celular:* " + form.telefono,
      "",
      "Quedo atento a su respuesta. ¡Saludos!",
    ];
    const mensaje = encodeURIComponent(lineas.join("\n"));
    const phone = buttonHref.match(/\d{9,15}/)?.[0] || "51936954890";
    const waUrl = `https://wa.me/${phone}?text=${mensaje}`;

    // Flujo solicitado: 
    // 1. Mostrar éxito inmediatamente.
    // 2. A los 2 segundos abrir WhatsApp.
    // 3. Mantener el mensaje de éxito 5 segundos más (total 7s) y resetear "suavecito".
    setTimeout(() => {
      window.open(waUrl, "_blank");
      
      // Resetear suavemente tras 5 segundos adicionales
      setTimeout(() => {
        setStatus("idle");
        setShowForm(false);
        setForm({ nombre: "", correo: "", telefono: "" });
      }, 5000);
    }, 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-[var(--color-primary-dark)] text-white text-center p-12 md:p-16"
    >
      {/* Círculos decorativos */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      
      {/* Patrón de puntos */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative z-10 font-montserrat">
        {/* Ícono */}
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
          {icon}
        </div>

        {/* Título */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 tracking-tight">
          {typeof title === "function" ? title({ accentFrom, accentTo }) : title}
        </h2>

        {/* Descripción */}
        <p className="text-white/80 text-base md:text-lg font-medium mb-8 max-w-lg mx-auto leading-relaxed">
          {description}
        </p>

        {/* Botón / Formulario */}
        {!isProveedores ? (
          <ButtonComponent href={buttonHref}>
            <WAIcon />
            {buttonLabel}
          </ButtonComponent>
        ) : (
          <div className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success-msg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col md:flex-row items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <PartyPopper size={24} className="text-[#1ed760]" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-white text-lg leading-tight">¡Solicitud preparada!</p>
                    <p className="text-white/70 text-sm">Abriendo WhatsApp con tus datos en unos segundos...</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <CheckCircle size={18} className="text-[#1ed760] animate-pulse" />
                  </div>
                  
                  {/* Botón de cierre manual */}
                  <button
                    onClick={() => {
                      setStatus("idle");
                      setShowForm(false);
                      setForm({ nombre: "", correo: "", telefono: "" });
                    }}
                    className="ml-auto text-white/40 hover:text-white transition-colors"
                    title="Cerrar y volver"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </motion.div>
              ) : !showForm ? (
                <motion.div
                  key="initial-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ButtonComponent
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForm(true);
                    }}
                  >
                    <WAIcon />
                    {buttonLabel}
                  </ButtonComponent>
                </motion.div>
              ) : (
                <motion.form
                  key="provider-form"
                  onSubmit={handleProveedorSubmit}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-3"
                >
                  <input
                    required
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Nombre o empresa"
                    className="flex-1 w-full border border-white/30 rounded-full px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/15 text-white placeholder-white/60 transition-all focus:bg-white/20"
                  />
                  <input
                    required
                    type="email"
                    value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                    placeholder="Correo electrónico"
                    className="flex-1 w-full border border-white/30 rounded-full px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/15 text-white placeholder-white/60 transition-all focus:bg-white/20"
                  />
                  <input
                    required
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="Celular"
                    className="w-full md:w-44 border border-white/30 rounded-full px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/15 text-white placeholder-white/60 transition-all focus:bg-white/20"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BE5C] text-white font-bold py-3.5 px-8 rounded-full transition-all duration-400 shadow-sm hover:shadow-xl hover:-translate-y-0.5 w-full md:w-auto active:scale-95"
                  >
                    <WAIcon />
                    Enviar solicitud
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.section>
  );
}
