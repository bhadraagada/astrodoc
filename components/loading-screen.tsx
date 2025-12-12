"use client"

import { motion } from "framer-motion"
import { Rocket } from "lucide-react"

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-deep-space flex items-center justify-center z-[100]">
      <div className="text-center">
        <motion.div
          className="inline-block"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          <Rocket size={60} className="text-stellar-cyan drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
        </motion.div>

        <motion.h2
          className="mt-6 text-2xl font-bold text-star-white font-space tracking-wider"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          Initializing AstroDoc
        </motion.h2>

        <motion.div
          className="mt-8 h-1 w-48 bg-gray-800 rounded-full overflow-hidden mx-auto border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-stellar-cyan to-cosmic-purple"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        </motion.div>

        <p className="mt-2 text-xs text-stellar-cyan/60 font-tech">ESTABLISHING ORBITAL UPLINK</p>
      </div>
    </div>
  )
}
