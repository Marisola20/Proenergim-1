import { motion } from "framer-motion"
import { Headset, MapPin } from "lucide-react"
import Contacto from "../sections/Contacto"
import HeroBanner from "../components/HeroBanner"
import ImpactSection from "../components/ImpactSection"

function ContactoPage() {
  return (
    <main className="bg-white">
      <HeroBanner 
        subtitle="Estamos para ayudarte"
        title="Asesoría"
        highlight="personalizada"
        description="Recibe asesoría en cada etapa de tu proyecto."
        patternId="contacto"
      />

      <div className="bg-[var(--color-bg-soft)]">
        <ImpactSection
          title={<>Siempre listos.</>}
          highlight="En todo el Perú."
          points={[
            {
              icon: Headset,
              label: "Equipo Técnico",
              text: "Expertos listos para resolver tus dudas técnicas y optimizar tu proyecto.",
              color: "#7ad7ff"
            },
            {
              icon: MapPin,
              label: "Cobertura Nacional",
              text: "4 sedes, un solo compromiso: estar donde nos necesitas.",
              color: "#3cf57c"
            }
          ]}
        />
        <Contacto mostrarBloqueProveedores={true} />
      </div>
    </main>
  )
}

export default ContactoPage
