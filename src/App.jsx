import { useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Nosotros from "./pages/Nosotros"
import Soluciones from "./pages/Soluciones"
import ContactoPage from "./pages/ContactoPage"
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad"
import TerminosCondiciones from "./pages/TerminosCondiciones"
import ProyectosPage from "./pages/ProyectosPage"
import ProyectoDetalle from "./pages/ProyectoDetalle"
import Novedades from "./sections/Novedades"
import FloatingWhatsApp from "./components/FloatingWhatsApp"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/soluciones" element={<Soluciones />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
          <Route path="/proyectos" element={<ProyectosPage />} />
          <Route path="/proyecto/:id" element={<ProyectoDetalle />} />
        </Routes>
        <Novedades />
        <Footer />
        <FloatingWhatsApp />
      </div>
    </BrowserRouter>
  )
}

export default App