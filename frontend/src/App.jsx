import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
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
import Productos from "./pages/Productos"
import Novedades from "./sections/Novedades"
import Loading from "./components/Loading"
import FloatingWhatsApp from "./components/FloatingWhatsApp"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])
  return null
}

function AppContent() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [prevPath, setPrevPath] = useState(location.pathname)

  // Trigger loading immediately when the path changes, before the next render commit
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname)
    setIsLoading(true)
  }

  useEffect(() => {
    // This effect runs after the render where isLoading was set to true
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000) // 1000ms for a more premium, slower feel
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Loading key="loader" />}
      </AnimatePresence>
      
      <ScrollToTop />
      <div className={isLoading ? "opacity-0 invisible h-screen overflow-hidden" : "opacity-100 visible transition-opacity duration-500"}>
        <Navbar />
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/soluciones" element={<Soluciones />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
          <Route path="/proyectos" element={<ProyectosPage />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/proyecto/:id" element={<ProyectoDetalle />} />
        </Routes>
        <Novedades />
        <Footer />
        <FloatingWhatsApp />
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App