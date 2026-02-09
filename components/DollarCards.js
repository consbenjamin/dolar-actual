"use client"

import { motion, AnimatePresence } from "framer-motion"
import DollarCard from "@/components/DollarCard"
import LoadingSkeleton from "@/components/LoadingSkeleton"

export default function DollarCards({
  dollarRates,
  loading,
  error,
  onRetry,
  theme,
  activeTypes,
  toggleDollarType,
  generateMiniChartData,
  calculateChange,
  getMiniChartMinMax,
  dollarTypeColors,
}) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {[0, 1, 2].map((index) => (
          <LoadingSkeleton key={index} theme={theme} />
        ))}
      </motion.div>
    )
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`p-6 mb-6 rounded-xl border ${theme === "dark" ? "bg-red-950/30 border-red-800 text-red-200" : "bg-red-50 border-red-200 text-red-800"}`}
          >
            <p className="mb-3 font-medium">{error}</p>
            <motion.button
              onClick={() => typeof onRetry === "function" && onRetry()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-lg font-medium ${theme === "dark" ? "bg-red-800 hover:bg-red-700" : "bg-red-600 hover:bg-red-700"} text-white transition-colors`}
            >
              Reintentar
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05, delayChildren: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {dollarRates.map((rate, index) => (
              <DollarCard
                key={rate.casa}
                rate={rate}
                theme={theme}
                isSelected={activeTypes.includes(rate.casa)}
                toggleDollarType={toggleDollarType}
                miniChartData={generateMiniChartData(rate.casa)}
                change={calculateChange(rate.casa)}
                minMax={getMiniChartMinMax(generateMiniChartData(rate.casa))}
                dollarTypeColors={dollarTypeColors}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
