"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Rocket } from "lucide-react"

export default function Header() {
  return (
    <motion.header
      className="text-center py-12 relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-center mb-3">
        <Link href="/" aria-label="Go to landing page">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="relative inline-block cursor-pointer"
          >
            <Rocket size={48} className="text-stellar-cyan dark:text-stellar-cyan" />
            <motion.div
              className="absolute inset-0 bg-stellar-cyan/20 dark:bg-stellar-cyan/30 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
          </motion.div>
        </Link>
      </div>

      <motion.h1
        className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-stellar-cyan to-cosmic-purple bg-clip-text text-transparent dark:from-stellar-cyan dark:to-cosmic-purple"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Link href="/" className="inline-block" aria-label="Go to landing page">
          AstroDoc
        </Link>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-star-white/80 dark:text-star-white/80 mt-3 max-w-lg mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Mission-critical health tracking for space explorers.
      </motion.p>
    </motion.header>
  )
}
