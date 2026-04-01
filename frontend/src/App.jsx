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
import Welcome from "./components/Welcome"
import FloatingWhatsApp from "./components/FloatingWhatsApp"

function ScrollToTop({ location }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [location?.pathname])
  return null
}

function AppContent() {
  const location = useLocation()
  
  // Lógica para diferenciar entre Bienvenida Inicial y Carga de Rutas
  const [isFirstLoad, setIsFirstLoad] = useState(() => {
    // Solo mostrar Bienvenida una vez por sesión del navegador
    return !sessionStorage.getItem("proenergim-welcomed")
  })
  
  const [displayLocation, setDisplayLocation] = useState(location)
  const [isLoading, setIsLoading] = useState(false)

  // Manejo de Carga entre Rutas posteriores a la Bienvenida
  useEffect(() => {
    if (!isFirstLoad && location.pathname !== displayLocation.pathname) {
      setIsLoading(true)
      
      // Delay para cambiar el contenido real de la ruta (esperar a que el loader se vea)
      const transitionTimer = setTimeout(() => {
        setDisplayLocation(location)
        
        // Mantener el loading un poco más para cubrir el renderizado inicial de la nueva página
        const revealTimer = setTimeout(() => {
          setIsLoading(false)
        }, 500)
        
        return () => clearTimeout(revealTimer)
      }, 350) // Tiempo para que el Loader entre y cubra la pantalla
      
      return () => clearTimeout(transitionTimer)
    }
  }, [location, displayLocation, isFirstLoad])

  const handleWelcomeComplete = () => {
    sessionStorage.setItem("proenergim-welcomed", "true")
    setIsFirstLoad(false)
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isFirstLoad ? (
          <Welcome key="welcome" onComplete={handleWelcomeComplete} />
        ) : (
          isLoading && <Loading key="loader" />
        )}
      </AnimatePresence>
      
      <ScrollToTop location={displayLocation} />
      
      {/* Contenido principal: Solo ocultar si es la Bienvenida Inicial */}
      <div className={isFirstLoad ? "opacity-0 invisible h-screen overflow-hidden" : "opacity-100 visible transition-opacity duration-700"}>
        <Navbar />
        <Routes location={displayLocation} key={displayLocation.pathname}>
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