"use client"

import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, X } from "lucide-react"

export default function HelpTooltip({ theme, showHelp, setShowHelp }) {
  return (
    <AnimatePresence>
      {showHelp && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`overflow-hidden rounded-xl flex items-start gap-3 border ${theme === "dark" ? "bg-blue-900/30 text-blue-100 border-blue-800" : "bg-blue-50 text-blue-800 border-blue-200"}`}
        >
          <div className="p-4 flex items-start gap-3 w-full">
            <HelpCircle className="flex-shrink-0 mt-0.5" size={18} />
            <div className="flex-1 min-w-0">
              <p className="font-medium mb-1">Consejo</p>
              <p className="text-sm">
                Haz clic en las tarjetas para mostrar u ocultar ese tipo de dólar en el gráfico histórico. El borde
                coloreado indica que está seleccionado.
              </p>
            </div>
            <motion.button
              onClick={() => setShowHelp(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`ml-auto p-1.5 rounded-full shrink-0 ${theme === "dark" ? "hover:bg-blue-800/50" : "hover:bg-blue-100"}`}
              aria-label="Cerrar ayuda"
            >
              <X size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
