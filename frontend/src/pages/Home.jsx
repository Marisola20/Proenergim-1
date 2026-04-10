import Hero from "../components/Hero"
import Servicios from "../sections/Servicios"
import Trayectoria from "../sections/Trayectoria"
import Clientes from "../sections/Clientes"
import Proyectos from "../sections/Proyectos"
import Proveedores from "../sections/Proveedores"
import Contacto from "../sections/Contacto"

function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <Hero />
      <Servicios />
      <Trayectoria />
      <Clientes />
      <Proyectos />
      <Proveedores />
      <Contacto />
    </div>
  )
}

export default Home
