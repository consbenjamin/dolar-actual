"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export default function Toast({ message, visible, onDismiss, theme = "light" }) {
  useEffect(() => {
    if (!visible || !onDismiss) return
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [visible, onDismiss])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-200 text-gray-900"}`}
          role="alert"
        >
          <CheckCircle2 size={20} className="text-green-500 shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
