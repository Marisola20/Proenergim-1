import Contacto from "../sections/Contacto"
import { motion } from "framer-motion"

function ContactoPage() {
  return (
    <main className="pt-20">
      <div className="bg-[var(--color-primary-dark)] py-16 px-6 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Contáctanos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-md md:text-xl opacity-90 max-w-2xl mx-auto"
        >
          Estamos aquí para responder tus consultas y ofrecerte las mejores soluciones de energía para tu empresa.
        </motion.p>
      </div>
      <Contacto mostrarBloqueProveedores={true} />
    </main>
  )
}

export default ContactoPage
