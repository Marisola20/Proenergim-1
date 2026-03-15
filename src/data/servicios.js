import { Sun, Zap, Wrench, ShieldCheck, Droplets, BarChart2 } from "lucide-react"

const imgBase = "https://images.unsplash.com"

export const servicios = [
  {
    icon: Sun,
    iconBg: "#f59e0b",   // ámbar/dorado — sol
    nombre: "Bombeo Solar",
    descripcion: "Instalación de sistemas de bombeo con paneles solares para agricultura y riego tecnificado.",
    imagen: `${imgBase}/photo-1508514177221-188b1cf16e9d?w=600&q=80`,
  },
  {
    icon: Zap,
    iconBg: "#3b82f6",   // azul eléctrico
    nombre: "Electrificación Solar",
    descripcion: "Sistemas solares para hogares, comercios e industrias. Paneles, inversores y baterías.",
    imagen: `${imgBase}/photo-1509391366360-2e959784a276?w=600&q=80`,
  },
  {
    icon: Droplets,
    iconBg: "#06b6d4",   // cyan — agua
    nombre: "Riego Tecnificado",
    descripcion: "Soluciones de riego eficiente energizadas 100% con energía solar fotovoltaica.",
    imagen: `${imgBase}/photo-1574943320219-553eb213f72d?w=600&q=80`,
  },
  {
    icon: Wrench,
    iconBg: "#f97316",   // naranja — mantenimiento/herramientas
    nombre: "Mantenimiento",
    descripcion: "Mantenimiento y reparación de sistemas solares, electrobombas y variadores de frecuencia.",
    imagen: `${imgBase}/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80`,
  },
  {
    icon: ShieldCheck,
    iconBg: "#8b5cf6",   // violeta — protección/respaldo
    nombre: "Sistemas de Respaldo",
    descripcion: "UPS, grupos electrógenos y baterías solares AGM, Gel y Litio para respaldo de energía.",
    imagen: `${imgBase}/photo-1593941707882-a5bba14938c7?w=600&q=80`,
  },
  {
    icon: BarChart2,
    iconBg: "#10b981",   // esmeralda — análisis/auditoría
    nombre: "Auditorías Energéticas",
    descripcion: "Análisis de calidad de energía, evaluación de subestaciones y centros de control.",
    imagen: `${imgBase}/photo-1558618666-fcd25c85cd64?w=600&q=80`,
  },
]