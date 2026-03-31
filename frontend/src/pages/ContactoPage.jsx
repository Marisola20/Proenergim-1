import Contacto from "../sections/Contacto"
import HeroBanner from "../components/HeroBanner"

function ContactoPage() {
  return (
    <main>
      <HeroBanner 
        title="Contáctanos"
        description="Estamos aquí para responder tus consultas y ofrecerte las mejores soluciones de energía para tu empresa."
        patternId="contacto"
      />
      <Contacto mostrarBloqueProveedores={true} />
    </main>
  )
}

export default ContactoPage
