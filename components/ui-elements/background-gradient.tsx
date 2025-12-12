"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function BackgroundGradient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return

    // Set initial position to center of screen to avoid null values
    setMousePosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <>
      <div className="fixed inset-0 bg-deep-space transition-colors duration-500 z-0" />

      {/* Deep Space Gradient Overlay */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-nebula-blue/20 to-transparent z-0 opacity-60"
        animate={{
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="fixed bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-cosmic-purple/20 to-transparent z-0 opacity-50"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 2,
        }}
      />

      {/* Mouse Follower Nebula */}
      <motion.div
        className="fixed w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-stellar-cyan/10 to-cosmic-purple/10 blur-[100px] z-0 pointer-events-none"
        animate={{
          x: mousePosition.x ? mousePosition.x - 400 : 0,
          y: mousePosition.y ? mousePosition.y - 400 : 0,
        }}
        transition={{
          type: "spring",
          damping: 50,
          stiffness: 100,
          mass: 3,
        }}
      />

      {/* Stars/Noise Texture Overlay */}
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.03] z-0 pointer-events-none mix-blend-overlay"></div>
    </>
  )
}
