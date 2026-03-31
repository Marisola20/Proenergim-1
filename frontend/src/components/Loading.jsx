import { motion } from "framer-motion";
import iconPro from "../assets/icon-pro.webp";

const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]"
    >
      {/* Background Decorative Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] max-h-[800px] opacity-20">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-[120px] animate-pulse"></div>
        </div>
      </div>

      {/* Main Logo Container */}
      <div className="relative flex flex-col items-center gap-8">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-32 h-32 md:w-40 md:h-40"
        >
          {/* Logo Glow */}
          <div className="absolute inset-0 rounded-full bg-blue-800/20 blur-xl"></div>
          
          <img
            src={iconPro}
            alt="Proenergim Logo"
            loading="eager"
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          />
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white text-lg font-medium tracking-[0.2em] uppercase"
        >
          Cargando ...
        </motion.p>

        {/* Loading Progress Bar Container */}
        <div className="w-64 h-1.5 bg-black/20 rounded-full overflow-hidden relative mt-2 border border-white/10">
          <motion.div
            initial={{ width: "0%", left: "0%" }}
            animate={{ 
              width: ["0%", "100%", "0%"],
              left: ["0%", "0%", "100%"]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          />
          {/* Subtle pulse for the bar track */}
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-white/5"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;
