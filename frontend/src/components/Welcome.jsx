import { motion } from "framer-motion";
import iconPro from "../assets/icon-pro.webp";

/**
 * Welcome: A cinematic introduction screen for initial load.
 * Only shown once per session for high-end presentation.
 */
const Welcome = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--color-primary-dark)] border-4 border-[#0ea5e9]/10"
    >
      {/* Decorative Elements from "Sedes" cards scale up */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Top-Right Green Bloom */}
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px]" />
        
        {/* Bottom-Left Blue Bloom */}
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-[#0ea5e1]/10 rounded-full blur-[120px]" />
        
        {/* Center Grainy Gradient for texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,105,161,0.4)_100%)]" />
      </div>

      <div className="relative flex flex-col items-center gap-12 text-center px-6">
        
        {/* Animated Icon Reveal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-40 h-40 md:w-52 md:h-52"
        >
          {/* Pulse Effect similar to Sedes icon container */}
          <div className="absolute inset-0 rounded-full bg-green-500/20 blur-3xl animate-[pulse_4s_infinite]"></div>
          <img
            src={iconPro}
            alt="Proenergim Logo"
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_40px_rgba(30,215,96,0.3)]"
          />
        </motion.div>

        {/* Welcome Message Reveal */}
        <div className="flex flex-col gap-5">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-white text-4xl md:text-6xl font-black tracking-tight"
          >
            Bienvenidos a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffee0c] to-[#1ed760] drop-shadow-sm">Proenergim</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-white/80 text-base md:text-xl font-medium tracking-[0.4em] uppercase"
          >
            Energía solar que transforma tu mundo
          </motion.p>
        </div>

        {/* Minimal Progress Line - Matching the accent colors */}
        <div className="w-64 h-[4px] bg-white/10 rounded-full overflow-hidden relative mt-4 border border-white/5">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2.5,
              ease: "linear",
            }}
            onAnimationComplete={onComplete}
            className="absolute h-full bg-gradient-to-r from-[#0ea5e1] to-[#1ed760] shadow-[0_0_20px_rgba(30,215,96,0.6)]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Welcome;
