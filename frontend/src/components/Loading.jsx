import { motion } from "framer-motion";
import iconPro from "../assets/icon-pro.webp";

/**
 * Loading: A minimal and quick loader for route changes and small data fetches.
 * Designed to be fast and non-intrusive.
 */
const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/20 backdrop-blur-xl"
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Rapid Pulse Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-24 h-24"
        >
          <img
            src={iconPro}
            alt="Proenergim"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </motion.div>

        {/* Minimal High-End Progress Bar */}
        <div className="w-32 h-1 bg-black/5 rounded-full overflow-hidden relative">
          <motion.div 
            animate={{ 
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 h-full w-1/2 bg-gradient-to-r from-[#0ea5e1] to-[#1ed760]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;
