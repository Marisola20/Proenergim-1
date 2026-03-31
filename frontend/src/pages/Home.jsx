import Hero from "../components/Hero"
import Servicios from "../sections/Servicios"
import Trayectoria from "../sections/Trayectoria"
import Clientes from "../sections/Clientes"
import Proyectos from "../sections/Proyectos"
import Proveedores from "../sections/Proveedores"
import Contacto from "../sections/Contacto"

function Home() {
  return (
    <>
      <Hero />
      <Servicios />
      <Trayectoria />
      <Clientes />
      <Proyectos />
      <Proveedores />
      <Contacto />
    </>
  )
}

export default Home
