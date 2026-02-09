"use client"

import { motion } from "framer-motion"

const itemVariants = {
  hidden: { opacity: 0.3 },
  visible: (i) => ({
    opacity: 1,
    transition: {
      delay: i * 0.08,
      repeat: Infinity,
      repeatType: "reverse",
      duration: 1.2,
    },
  }),
}

export default function LoadingSkeleton({ theme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-6 rounded-xl border overflow-hidden ${theme === "dark" ? "bg-[hsl(var(--card))] border-gray-700" : "bg-[hsl(var(--card))] border-gray-200"}`}
    >
      <motion.div
        custom={0}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className={`h-6 w-24 mb-4 rounded ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}
      />
      <motion.div
        custom={1}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className={`h-10 w-32 rounded ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}
      />
      <motion.div
        custom={2}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className={`h-16 w-full mt-4 rounded ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}
      />
    </motion.div>
  )
}
