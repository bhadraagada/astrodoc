"use client";

import CircularProgress from "@/components/ui-elements/circular-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, useInView } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

// Define types that match the result.json structure
interface TimelineDay {
  day: number;
  description: string;
}

interface Timeline {
  path: string;
  action: string;
  days: TimelineDay[];
  riskPercentage: number;
  recoveryPercentage: number;
}

interface ResultData {
  timelines: Timeline[];
  bestPath: {
    pathIndex: number;
    explanation: string;
  };
  disclaimer: string;
}

// Define the Path type used in the component
type Path = {
  id: string;
  title: string;
  description: string;
  days: { day: number; event: string }[];
  riskScore: number;
  recoveryChance: number;
  tag: { text: string; icon: React.ReactNode; color: string; bgColor: string };
};

// Define props for the component
interface SimulatedOutcomesProps {
  results?: ResultData | null;
}

export default function SimulatedOutcomes({ results }: SimulatedOutcomesProps) {
  const [activeTab, setActiveTab] = useState("path-0");
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });

  // Convert API results to the format expected by the component
  const convertResultsToPaths = (results: ResultData | null): Path[] => {
    if (!results || !results.timelines || !Array.isArray(results.timelines)) {
      // Return default paths if no results
      return defaultPaths;
    }

    return results.timelines.map((timeline, index) => {
      // Determine tag based on risk percentage
      let tag = {
        text: "Moderate Risk",
        icon: <Activity className="h-4 w-4" />,
        color: "text-warning-amber",
        bgColor: "bg-warning-amber/20 border border-warning-amber/30",
      };

      if (timeline.riskPercentage > 60) {
        tag = {
          text: "Critical Risk",
          icon: <AlertTriangle className="h-4 w-4" />,
          color: "text-critical-red",
          bgColor: "bg-critical-red/20 border border-critical-red/30",
        };
      } else if (timeline.riskPercentage < 30) {
        tag = {
          text: "Optimal Path",
          icon: <CheckCircle className="h-4 w-4" />,
          color: "text-vitals-green",
          bgColor: "bg-vitals-green/20 border border-vitals-green/30",
        };
      }

      // If this is the best path according to the API, override the tag
      if (results.bestPath && results.bestPath.pathIndex === index) {
        tag = {
          text: "Optimal Path",
          icon: <CheckCircle className="h-4 w-4" />,
          color: "text-vitals-green",
          bgColor: "bg-vitals-green/20 border border-vitals-green/30",
        };
      }

      return {
        id: `path-${index}`,
        title: timeline.path,
        description: timeline.action,
        days: timeline.days.map((day) => ({
          day: day.day,
          event: day.description,
        })),
        riskScore: timeline.riskPercentage,
        recoveryChance: timeline.recoveryPercentage,
        tag,
      };
    });
  };

  // Default paths to use when no results are provided
  const defaultPaths: Path[] = [
    {
      id: "path-a",
      title: "No Intervention",
      description:
        "By Day 5, the astronaut experiences severe physiological degradation due to untreated environmental stress, leading to mission failure probabilities.",
      days: [
        { day: 1, event: "Minor vital fluctuations detected" },
        { day: 2, event: "Oxygen saturation drops by 2%" },
        { day: 3, event: "Cognitive performance declines" },
        { day: 4, event: "Severe muscle density loss warnings" },
        { day: 5, event: "Critical system alert: Cardiac stress" },
        { day: 6, event: "Mission capability compromised" },
        { day: 7, event: "Emergency life support activation required" },
      ],
      riskScore: 75,
      recoveryChance: 45,
      tag: {
        text: "High Risk",
        icon: <AlertTriangle className="h-4 w-4" />,
        color: "text-critical-red",
        bgColor: "bg-critical-red/20 border border-critical-red/30",
      },
    },
    // ... existing code ...
  ];

  // Use the converted paths or default paths
  const paths = results ? convertResultsToPaths(results) : [];

  // Check if we have any paths to display
  const hasData = paths.length > 0;

  // Set the active tab to the best path if results are provided
  useEffect(() => {
    if (results && results.bestPath !== undefined) {
      setActiveTab(`path-${results.bestPath.pathIndex}`);
    }
  }, [results]);

  // Auto-advance days for demo purposes, but limit to prevent performance issues
  useEffect(() => {
    if (!isInView) return;

    // Limit the number of animations to prevent performance issues
    let count = 0;
    const maxCycles = 3;

    const timer = setInterval(() => {
      setCurrentDay((prev) => {
        const newDay = prev >= 7 ? 1 : prev + 1;

        // Increment count when we complete a cycle
        if (newDay === 1) {
          count++;
        }

        // Clear interval after maxCycles
        if (count >= maxCycles) {
          clearInterval(timer);
        }

        return newDay;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isInView]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
      ref={containerRef}
      className="space-y-8"
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={container}
    >
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-stellar-cyan to-cosmic-purple flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <Activity className="h-5 w-5 text-deep-space" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-stellar-cyan to-cosmic-purple bg-clip-text text-transparent font-space">
            Simulated Trajectories
          </h2>
        </div>

        {hasData && (
          <div className="flex items-center space-x-3 bg-deep-space/60 p-1.5 rounded-full shadow-sm backdrop-blur-sm border border-stellar-cyan/20">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDay((prev) => Math.max(1, prev - 1))}
              className="rounded-full h-9 w-9 transition-all duration-200 border-none bg-stellar-cyan/10 text-stellar-cyan hover:bg-stellar-cyan/20 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <motion.div
              className="bg-deep-space px-4 py-1.5 rounded-full flex items-center shadow-inner border border-stellar-cyan/10"
              animate={{
                scale: [1, 1.05, 1],
                borderColor:
                  currentDay > 5
                    ? ["rgba(239, 68, 68, 0.3)", "rgba(239, 68, 68, 0.8)", "rgba(239, 68, 68, 0.3)"]
                    : undefined,
              }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <span className="text-sm font-medium text-star-white font-tech">Cycle {currentDay}</span>
              {currentDay > 5 && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 bg-critical-red/20 text-critical-red rounded-full animate-pulse border border-critical-red/30">
                  Critical
                </span>
              )}
            </motion.div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDay((prev) => Math.min(7, prev + 1))}
              className="rounded-full h-9 w-9 transition-all duration-200 border-none bg-stellar-cyan/10 text-stellar-cyan hover:bg-stellar-cyan/20 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </motion.div>

      {!hasData ? (
        <motion.div
          variants={item}
          className="bg-deep-space/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-stellar-cyan/20 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center py-10">
            <motion.div
              className="w-20 h-20 rounded-full bg-nebula-blue/20 flex items-center justify-center mb-6 border border-nebula-blue/30"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
                boxShadow: ["0 0 0px rgba(6,182,212,0)", "0 0 20px rgba(6,182,212,0.3)", "0 0 0px rgba(6,182,212,0)"]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Activity className="h-10 w-10 text-stellar-cyan" />
            </motion.div>

            <h3 className="text-xl font-semibold text-star-white mb-3 font-space">
              No Missions Simulated
            </h3>

            <p className="text-moon-silver max-w-md mb-6 font-light">
              Input health parameters in the command console above to generate predictive mission outcomes.
            </p>

            <div className="flex items-center justify-center space-x-2 text-sm text-stellar-cyan/60">
              <span className="inline-block w-2 h-2 rounded-full bg-stellar-cyan animate-pulse"></span>
              <span className="font-tech tracking-wide">Awaiting biometric data stream...</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={item}
          className="relative flex flex-col space-y-8 md:space-y-0 md:flex-row-reverse"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs
            defaultValue={paths.length > 0 ? paths[0].id : "path-0"}
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full "
          >
            <TabsList className="flex gap-2 mb-8 bg-black/40 backdrop-blur-md rounded-xl shadow-sm border border-stellar-cyan/10 overflow-x-auto py-2 px-1">
              {paths.map((path) => (
                <TabsTrigger
                  key={path.id}
                  value={path.id}
                  className="flex-none min-w-[140px] relative px-3 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-stellar-cyan/10 data-[state=active]:to-cosmic-purple/10 data-[state=active]:text-stellar-cyan data-[state=active]:font-medium hover:bg-stellar-cyan/5 group rounded-lg flex justify-center items-center"
                >
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-stellar-cyan to-cosmic-purple rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{
                      scaleX: activeTab === path.id ? 1 : 0,
                      opacity: activeTab === path.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                    <div className="relative z-10 flex items-center justify-center gap-2 py-2 px-2">
                    <motion.div
                      className={`flex items-center justify-center rounded-full ${path.tag.bgColor} shadow-sm p-1.5`}
                      initial={{ scale: 0.8 }}
                      animate={{
                        scale: activeTab === path.id ? 1 : 0.8,
                        rotate: activeTab === path.id ? [0, 5, -5, 0] : 0,
                      }}
                      transition={{
                        duration: 0.5,
                        rotate: { duration: 0.3, delay: 0.2 },
                      }}
                    >
                      {path.tag.icon}
                    </motion.div>
                    <span className="font-medium items-center flex justify-center text-sm truncate max-w-[80px] sm:max-w-none text-moon-silver group-data-[state=active]:text-stellar-cyan transition-colors">
                      {path.title}
                    </span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative mt-14">
              {paths.map((path) => (
                <TabsContent
                  key={path.id}
                  value={path.id}
                  className="mt-0"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-deep-space/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-stellar-cyan/20 ring-1 ring-stellar-cyan/10"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                        <div className="md:w-1/3 space-y-6">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-semibold text-star-white flex items-center font-space">
                                {path.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={`${path.tag.bgColor} ${path.tag.color} flex justify-center items-center rounded-full gap-1.5 px-2.5 text-[0.7rem] py-1.5 shadow-sm border-none`}
                              >
                                {path.tag.icon}
                                {path.tag.text}
                              </Badge>
                            </div>

                            <p className="text-moon-silver mb-6 leading-relaxed font-light border-l-2 border-stellar-cyan/30 pl-4">
                              {path.description}
                            </p>
                          </motion.div>

                          <div className="grid grid-cols-2 gap-6">
                            <motion.div
                              className="space-y-2 bg-black/40 p-4 rounded-xl shadow-inner border border-stellar-cyan/10"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: 0.3 }}
                              whileHover={{ y: -2, borderColor: "rgba(6, 182, 212, 0.4)" }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-moon-silver font-tech">
                                  Risk Level
                                </span>
                                <motion.span
                                  className={`text-sm font-bold ${path.riskScore > 60
                                      ? "text-critical-red drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
                                      : path.riskScore > 30
                                        ? "text-warning-amber drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]"
                                        : "text-vitals-green drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]"
                                    }`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.4, delay: 0.6 }}
                                >
                                  {path.riskScore}%
                                </motion.span>
                              </div>
                              <div className="flex items-center justify-center">
                                <CircularProgress
                                  value={path.riskScore}
                                  size={100}
                                  strokeWidth={10}
                                  color={
                                    path.riskScore > 60
                                      ? "#ef4444"
                                      : path.riskScore > 30
                                        ? "#f59e0b"
                                        : "#10b981"
                                  }
                                  bgColor="rgba(255,255,255,0.05)"
                                  animate={isInView}
                                />
                              </div>
                            </motion.div>

                            <motion.div
                              className="space-y-2 bg-black/40 p-4 rounded-xl shadow-inner border border-stellar-cyan/10"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: 0.4 }}
                              whileHover={{ y: -2, borderColor: "rgba(124, 58, 237, 0.4)" }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-moon-silver font-tech">
                                  Recovery
                                </span>
                                <motion.span
                                  className={`text-sm font-bold ${path.recoveryChance > 70
                                      ? "text-vitals-green drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]"
                                      : path.recoveryChance > 40
                                        ? "text-warning-amber drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]"
                                        : "text-critical-red drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
                                    }`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.4, delay: 0.7 }}
                                >
                                  {path.recoveryChance}%
                                </motion.span>
                              </div>
                              <div className="flex items-center justify-center">
                                <CircularProgress
                                  value={path.recoveryChance}
                                  size={100}
                                  strokeWidth={10}
                                  color={
                                    path.recoveryChance > 70
                                      ? "#10b981"
                                      : path.recoveryChance > 40
                                        ? "#f59e0b"
                                        : "#ef4444"
                                  }
                                  bgColor="rgba(255,255,255,0.05)"
                                  animate={isInView}
                                />
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        <motion.div
                          className="md:w-2/3 border-t md:border-t-0 md:border-l border-stellar-cyan/20 pt-6 md:pt-0 md:pl-10 relative"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-stellar-cyan/5 to-transparent pointer-events-none" />

                          <h4 className="text-lg font-medium text-star-white mb-6 flex items-center font-space relative z-10">
                            <motion.div
                              className="w-6 h-6 rounded-full bg-stellar-cyan/20 flex items-center justify-center mr-2 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <span className="w-2 h-2 rounded-full bg-stellar-cyan"></span>
                            </motion.div>
                            Temporal Progression
                          </h4>

                          <div className="relative z-10">
                            <motion.div
                              className="absolute top-0 bottom-0 left-4 w-0.5 bg-gradient-to-b from-stellar-cyan/50 to-cosmic-purple/50"
                              initial={{ height: 0 }}
                              animate={{ height: "100%" }}
                              transition={{ duration: 0.8, delay: 0.5 }}
                            />

                            <div className="space-y-8">
                              {path.days.map((day, index) => {
                                const isCurrentDay = day.day === currentDay;
                                const isPastDay = day.day < currentDay;
                                const isSelected = selectedDay === day.day;

                                return (
                                  <motion.div
                                    key={day.day}
                                    className="relative pl-12"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      duration: 0.4,
                                      delay: 0.2 + index * 0.1,
                                    }}
                                    whileHover={{ x: 3 }}
                                  >
                                    <motion.div
                                      className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-10 ${isCurrentDay
                                          ? "bg-stellar-cyan text-deep-space shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                                          : isPastDay
                                            ? "bg-nebula-blue/30 text-stellar-cyan/70 border border-stellar-cyan/30"
                                            : "bg-deep-space text-moon-silver/50 border border-moon-silver/20"
                                        } ${isSelected
                                          ? "ring-2 ring-cosmic-purple shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                                          : ""
                                        }`}
                                      onClick={() =>
                                        setSelectedDay(
                                          selectedDay === day.day
                                            ? null
                                            : day.day
                                        )
                                      }
                                      whileHover={{ scale: 1.1 }}
                                      animate={{
                                        scale: isCurrentDay ? [1, 1.1, 1] : 1,
                                        transition: {
                                          duration: isCurrentDay ? 1.5 : 0.2,
                                          repeat: isCurrentDay
                                            ? Infinity
                                            : undefined,
                                          repeatDelay: 2,
                                        },
                                      }}
                                    >
                                      <span className="text-xs font-bold font-tech">
                                        {day.day}
                                      </span>
                                    </motion.div>

                                    <div
                                      className={`glass-panel p-4 rounded-lg shadow-sm border ${isCurrentDay
                                          ? "border-stellar-cyan/40 bg-stellar-cyan/5 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                                          : "border-stellar-cyan/10 bg-black/20"
                                        } ${isSelected
                                          ? "ring-1 ring-cosmic-purple/50 bg-cosmic-purple/5"
                                          : ""
                                        } transition-all duration-300 hover:border-stellar-cyan/30`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <h5
                                          className={`text-sm font-medium font-tech tracking-wide ${isCurrentDay
                                              ? "text-stellar-cyan"
                                              : "text-moon-silver"
                                            }`}
                                        >
                                          CYCLE {day.day}
                                        </h5>
                                        {isCurrentDay && (
                                          <span className="px-2 py-0.5 bg-stellar-cyan/10 text-stellar-cyan text-[10px] uppercase tracking-wider rounded-sm border border-stellar-cyan/20">
                                            Active
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-moon-silver/80 mt-1 text-sm font-light">
                                        {day.event}
                                      </p>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Add recommendation footer if needed */}
                    {results?.bestPath &&
                      results.bestPath.pathIndex ===
                      parseInt(path.id.split("-")[1]) && (
                        <div className="bg-gradient-to-r from-vitals-green/10 to-nebula-blue/10 p-4 border-t border-vitals-green/20">
                          <div className="flex items-start">
                            <div className="bg-vitals-green/20 p-2 rounded-full mr-3 border border-vitals-green/30">
                              <CheckCircle className="h-5 w-5 text-vitals-green shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                            </div>
                            <div>
                              <h5 className="font-medium text-vitals-green font-space">
                                Optimal Mission Strategy
                              </h5>
                              <p className="text-sm text-moon-silver mt-1">
                                {results.bestPath.explanation ||
                                  "This trajectory minimizes physiological risk while maximizing recovery probability."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </motion.div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </motion.div>
      )}
    </motion.section>
  );
}
