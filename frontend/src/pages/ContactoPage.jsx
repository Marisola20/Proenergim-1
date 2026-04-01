import Contacto from "../sections/Contacto"
import HeroBanner from "../components/HeroBanner"

function ContactoPage() {
  return (
    <main>
      <HeroBanner 
        subtitle="Estamos para ayudarte"
        title="Asesoría"
        highlight="personalizada"
        description="Recibe asesoría en cada etapa de tu proyecto."
        patternId="contacto"
      />
      <Contacto mostrarBloqueProveedores={true} />
    </main>
  )
}

export default ContactoPage
