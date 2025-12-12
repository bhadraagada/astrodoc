"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Radar, FileUp, ArrowRight, Calendar, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function InsightSummary() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.section
      ref={ref}
      className="relative"
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={container}
    >
      <motion.div
        className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-transparent to-stellar-cyan/30"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        variants={item}
        className="bg-deep-space/80 backdrop-blur-md rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)] p-8 border border-stellar-cyan/20 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <motion.div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-stellar-cyan/10 to-cosmic-purple/10 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0.5] }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-tr from-cosmic-purple/10 to-stellar-cyan/10 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.3] }}
          transition={{ duration: 2.5, delay: 0.8, repeat: Infinity, repeatType: "reverse" }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <motion.div
            className="flex items-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ rotate: 0, scale: 0.8 }}
              animate={{
                rotate: isInView ? [0, 15, 0, -15, 0] : 0,
                scale: [0.8, 1.1, 1]
              }}
              transition={{
                rotate: { delay: 0.5, duration: 1 },
                scale: { duration: 0.5 }
              }}
              className="mr-4 text-stellar-cyan bg-stellar-cyan/10 p-3 rounded-full border border-stellar-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            >
              <Radar className="h-8 w-8" />
            </motion.div>
            <div>
              <motion.div
                className="text-xs font-medium text-stellar-cyan/70 mb-1 uppercase tracking-wider font-tech"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Analysis Complete
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-stellar-cyan to-cosmic-purple bg-clip-text text-transparent font-space">
                Mission Directive
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="border-2 border-stellar-cyan text-stellar-cyan hover:bg-stellar-cyan/10 hover:text-white rounded-full px-5 py-2 font-medium shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 bg-transparent font-tech tracking-wide"
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>SYNC CALENDAR</span>
              <motion.span
                className="ml-1 inline-block"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              >→</motion.span>
            </Button>
          </motion.div>
        </div>

        <motion.div variants={item} className="space-y-8">
          <motion.div
            className="bg-gradient-to-r from-stellar-cyan/10 to-cosmic-purple/5 rounded-xl p-6 border border-stellar-cyan/20 relative overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(6, 182, 212, 0.1)" }}
          >
            <motion.div
              className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-stellar-cyan to-cosmic-purple"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />

            <p className="text-moon-silver leading-relaxed font-light">
              Based on biometric readings, we recommend initiating a secure transmission with <motion.span
                className="font-semibold text-stellar-cyan inline-block font-space"
                animate={{
                  scale: [1, 1.05, 1],
                  color: ["#06b6d4", "#38bdf8", "#06b6d4"]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >Mission Control</motion.span> within the next 24-48 hours. Early
              diagnostic procedures can prevent system degradation. Sustain current hydration levels and initiate sleep cycle protocols.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              variants={item}
              custom={0}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.3)" }}
              className="transition-all duration-300"
            >
              <Card className="border-critical-red/30 bg-black/40 h-full overflow-hidden group">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-critical-red/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <CardContent className="p-6 flex flex-col h-full relative">
                  <motion.div
                    className="rounded-full bg-critical-red/20 w-14 h-14 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300 border border-critical-red/30"
                    whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.05 }}
                  >
                    <Radio className="h-7 w-7 text-critical-red" />
                  </motion.div>
                  <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-critical-red/5 rounded-full blur-xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <h3 className="font-medium text-lg mb-2 text-star-white font-space">Emergency Protocol</h3>
                  <p className="text-sm text-moon-silver/70 flex-grow font-light">
                    If telemetry indicates critical failure before scheduled transmission, activate emergency beacon immediately.
                  </p>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 justify-start px-0 text-critical-red hover:text-critical-red/80 hover:bg-transparent group font-tech uppercase"
                    >
                      LocateBeacon
                      <motion.div
                        className="ml-1.5 h-4 w-4"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <ArrowRight />
                      </motion.div>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={item}
              custom={1}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.3)" }}
              className="transition-all duration-300"
            >
              <Card className="border-stellar-cyan/30 bg-black/40 h-full overflow-hidden group border-2 ring-1 ring-stellar-cyan/10">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-stellar-cyan/5 to-nebula-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                </motion.div>
                <CardContent className="p-6 flex flex-col h-full relative">
                  <motion.div
                    className="rounded-full bg-stellar-cyan/20 w-14 h-14 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 border border-stellar-cyan/30"
                    whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.05 }}
                  >
                    <Radar className="h-7 w-7 text-stellar-cyan" />
                  </motion.div>
                  <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-stellar-cyan/5 rounded-full blur-xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <h3 className="font-medium text-lg mb-2 text-star-white flex items-center font-space">
                    Mission Control
                    <motion.span
                      className="ml-2 text-xs px-1.5 py-0.5 bg-stellar-cyan/20 text-stellar-cyan rounded-full border border-stellar-cyan/30"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, duration: 0.3 }}
                    >
                      PRIORITY
                    </motion.span>
                  </h3>
                  <p className="text-sm text-moon-silver/70 flex-grow font-light">
                    Establish communication link with Flight Surgeon within 24-48 hours.
                  </p>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 justify-start px-0 text-stellar-cyan hover:text-stellar-cyan/80 hover:bg-transparent group font-tech uppercase"
                    >
                      Open Comms
                      <motion.div
                        className="ml-1.5 h-4 w-4"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <ArrowRight />
                      </motion.div>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={item}
              custom={2}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.3)" }}
              className="transition-all duration-300"
            >
              <Card className="border-cosmic-purple/30 bg-black/40 h-full overflow-hidden group">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <CardContent className="p-6 flex flex-col h-full relative">
                  <motion.div
                    className="rounded-full bg-cosmic-purple/20 w-14 h-14 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all duration-300 border border-cosmic-purple/30"
                    whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.05 }}
                  >
                    <FileUp className="h-7 w-7 text-cosmic-purple" />
                  </motion.div>
                  <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-cosmic-purple/5 rounded-full blur-xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <h3 className="font-medium text-lg mb-2 text-star-white font-space">Mission Report</h3>
                  <p className="text-sm text-moon-silver/70 flex-grow font-light">
                    Download encrypted flight logs and detailed biometric analysis for personal records.
                  </p>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 justify-start px-0 text-cosmic-purple hover:text-cosmic-purple/80 hover:bg-transparent group font-tech uppercase"
                    >
                      Download PDF
                      <motion.div
                        className="ml-1.5 h-4 w-4"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <ArrowRight />
                      </motion.div>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            variants={item}
            className="flex justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative"
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-stellar-cyan to-cosmic-purple rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
                animate={{
                  opacity: [0.2, 0.3, 0.2],
                  scale: [0.98, 1.01, 0.98]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <Button className="relative bg-gradient-to-r from-stellar-cyan to-cosmic-purple hover:from-stellar-cyan/90 hover:to-cosmic-purple/90 text-white px-8 py-6 rounded-xl text-lg font-medium transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-2 h-5 w-5"
                >
                  <FileUp />
                </motion.div>
                Download Mission Logs
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
