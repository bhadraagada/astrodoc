"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FloatingActionButtonProps {
  icon: ReactNode
  tooltip: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  onClick?: () => void
  className?: string
}

export default function FloatingActionButton({
  icon,
  tooltip,
  position = "bottom-right",
  onClick,
  className = "",
}: FloatingActionButtonProps) {
  const positionClasses = {
    "bottom-right": "fixed bottom-6 right-6",
    "bottom-left": "fixed bottom-6 left-6",
    "top-right": "fixed top-6 right-6",
    "top-left": "fixed top-6 left-6",
  }

  return (
    <div className={`${positionClasses[position]} z-50`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              className={`bg-gradient-to-r from-stellar-cyan to-cosmic-purple text-star-white p-4 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all border border-stellar-cyan/30 ${className}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 1,
              }}
              onClick={onClick}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  repeatDelay: 3,
                }}
              >
                {icon}
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-full bg-white"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.2, 0],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  repeatDelay: 3,
                }}
              />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
