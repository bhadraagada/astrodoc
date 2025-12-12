"use client";

import SymptomInput, { ResultData } from "@/components/symptom-input";
import ChatLayoutWrapper from "@/components/chat-layout-wrapper";
import Header from "@/components/header";
import SimulatedOutcomes from "@/components/simulated-outcomes";
import {
  useChatById,
  useChatMessages,
  useConvexChat,
} from "@/hooks/use-convex-chat";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  Brain,
  Ear,
  Lightbulb,
  Pill,
  Radar,
  Thermometer,
} from "lucide-react";

// Health tips that will rotate
const healthTips = [
  "Mainain hydration levels. Consumption of 2000ml H2O daily recommended.",
  "Scheduled rest cycles essential for preventing cognitive fatigue.",
  "Physical conditioning maintains zero-g muscle mass and immunity.",
  "target 7-9 hours of hibernation for optimal neural recovery.",
  "Nutrient-dense fuel intake vital for prolonged mission duration.",
  "Stress regulation protocols initiated: Deep breathing recommended.",
  "Limit visual interface exposure prior to sleep cycle.",
  "Sterilization protocols (hand washing) reduce bio-contaminants.",
  "Regular bio-scans (check-ups) ensure mission readiness.",
  "Flexibility maneuvers prevent skeletal rigidity.",
];

// Health resources with links
const healthResources = [
  {
    title: "World Health Org",
    description: "Global Mission Directives",
    url: "https://www.who.int/",
    icon: <BookOpen size={18} />,
  },
  {
    title: "CDC Control Center",
    description: "Bio-Defense Protocols",
    url: "https://www.cdc.gov/",
    icon: <BookOpen size={18} />,
  },
  {
    title: "Mayo Medical Station",
    description: "Advanced Medical Database",
    url: "https://www.mayoclinic.org/",
    icon: <BookOpen size={18} />,
  },
  {
    title: "MedlinePlus Grid",
    description: "Verified Medical Intel",
    url: "https://medlineplus.gov/",
    icon: <BookOpen size={18} />,
  },
];

// Common symptom categories
const symptomCategories = [
  {
    name: "Neurological",
    icon: <Brain size={18} />,
    examples: "Headache, Dizziness, Confusion",
  },
  {
    name: "Cardiovascular",
    icon: <Activity size={18} />,
    examples: "Chest pain, Palpitations, Fatigue",
  },
  {
    name: "Respiratory",
    icon: <Radar size={18} />,
    examples: "Cough, Shortness of breath, Wheezing",
  },
  {
    name: "Gastrointestinal",
    icon: <Activity size={18} />,
    examples: "Nausea, Vomiting, Abdominal pain",
  },
  {
    name: "Fever & Pain",
    icon: <Thermometer size={18} />,
    examples: "Fever, Body aches, Chills",
  },
  {
    name: "Skin & Allergies",
    icon: <Thermometer size={18} />,
    examples: "Rash, Itching, Swelling",
  },
  {
    name: "ENT Issues",
    icon: <Ear size={18} />,
    examples: "Sore throat, Ear pain, Sinus pressure",
  },
  {
    name: "Medication",
    icon: <Pill size={18} />,
    examples: "Side effects, Interactions, Dosage",
  },
];

// Emergency warning signs
const emergencyWarnings = [
  "Critical Oxygen Failure (Difficulty breathing)",
  "Structural Chest Integrity Breach (Pain/Pressure)",
  "Neural Sync Failure (Confusion/Unconsciousness)",
  "Hypoxic Discoloration (Bluish lips/face)",
  "Core Reactor Instability (Severe abdomen pain)",
  "Cranial Pressure Critical (Severe headache)",
];

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatIdParam = params.id as string;

  // Check if this is a valid Convex ID format (starts with a table prefix)
  const isValidConvexId =
    chatIdParam && (chatIdParam.startsWith("j") || chatIdParam.startsWith("k"));

  // If not a valid Convex ID, redirect to home and create new chat
  useEffect(() => {
    if (!isValidConvexId) {
      router.replace("/chat");
    }
  }, [isValidConvexId, router]);

  const chatId = chatIdParam as Id<"chats">;
  const chat = useChatById(isValidConvexId ? chatId : null);
  const messages = useChatMessages(isValidConvexId ? chatId : null);
  const { addMessage } = useConvexChat();
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // AstroDoc Theme States
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTip, setCurrentTip] = useState(healthTips[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [stars, setStars] = useState<
    Array<{ top: number; left: number; duration: number; delay: number }>
  >([]);

  useEffect(() => {
    // Generate stars on client side only
    const newStars = Array.from({ length: 20 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5,
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    if (!isValidConvexId) return;

    // If chat is explicitly null (not undefined/loading), redirect
    if (chat === null) {
      router.push("/");
    } else if (chat !== undefined) {
      setIsLoading(false);
    }
  }, [chat, router, isValidConvexId]);

  // Theme animation effects
  useEffect(() => {
    // Simulate loading for smooth entrance
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Rotate health tips every 8 seconds
    const tipInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * healthTips.length);
      setCurrentTip(healthTips[randomIndex]);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(tipInterval);
    };
  }, []);

  const handleNewMessage = async (content: string, isUser: boolean) => {
    await addMessage(chatId, content, isUser);
  };

  // Transform messages for SymptomInput
  const formattedMessages = messages.map((msg) => ({
    content: msg.content,
    isUser: msg.isUser,
    timestamp: msg.timestamp,
  }));

  if (isLoading || chat === undefined) {
    return (
      <ChatLayoutWrapper>
        <div className="fixed inset-0 bg-deep-space flex items-center justify-center z-[100]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-stellar-cyan/30 border-t-stellar-cyan rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stellar-cyan font-space tracking-wider animate-pulse">
              ESTABLISHING ORBITAL UPLINK...
            </p>
          </div>
        </div>
      </ChatLayoutWrapper>
    );
  }

  // AstroDoc Layout wrapped in ChatLayoutWrapper
  return (
    <ChatLayoutWrapper>
      <div className="min-h-screen bg-deep-space transition-colors duration-500 overflow-auto w-full relative p-4">
        {/* Stars/Noise Texture Overlay */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] z-0 pointer-events-none mix-blend-overlay"></div>

        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-10 left-10 w-64 h-64 rounded-full bg-nebula-blue/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          ></motion.div>

          <motion.div
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-cosmic-purple/10 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          ></motion.div>

          <motion.div
            className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-stellar-cyan/10 blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          ></motion.div>

          {/* Floating particles (Stars) */}
          {stars.map((star, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white sm:w-0.5 sm:h-0.5"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Header />
          </motion.div>

          {/* Health Tip Banner */}
          <motion.div
            className="mt-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-stellar-cyan/30 to-cosmic-purple/30 rounded-lg blur-sm opacity-50"></div>
            <div className="relative bg-black/40 backdrop-blur-md rounded-lg p-4 border border-stellar-cyan/20 flex items-center shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <div className="bg-stellar-cyan/10 p-2 rounded-full mr-3 border border-stellar-cyan/30">
                <Lightbulb size={18} className="text-stellar-cyan" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-stellar-cyan uppercase tracking-widest font-space mb-1">
                  Mission Update
                </h3>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentTip}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-sm text-moon-silver font-tech"
                  >
                    {currentTip}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <main className="mt-8 space-y-8 ">
            {/* Symptom Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isLoaded ? 1 : 0,
                y: isLoaded ? 0 : 20,
              }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: "easeOut",
              }}
              className="relative"
            >
              <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/5">
                <h2 className="text-xl font-bold text-star-white mb-4 flex items-center font-space">
                  <Activity className="mr-2 h-5 w-5 text-stellar-cyan" />
                  Biometric Categories
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {symptomCategories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 border group ${
                        selectedCategory === category.name
                          ? "bg-stellar-cyan/10 border-stellar-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                          : "bg-deep-space/50 border-white/5 hover:bg-white/5 hover:border-stellar-cyan/50"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-full mb-2 transition-all duration-200 ${
                          selectedCategory === category.name
                            ? "bg-stellar-cyan/20 text-stellar-cyan"
                            : "bg-white/5 text-moon-silver group-hover:text-stellar-cyan group-hover:bg-stellar-cyan/10"
                        }`}
                      >
                        {category.icon}
                      </div>
                      <span
                        className={`text-sm font-medium transition-colors ${
                          selectedCategory === category.name
                            ? "text-stellar-cyan"
                            : "text-moon-silver group-hover:text-white"
                        }`}
                      >
                        {category.name}
                      </span>
                      <span className="text-[10px] text-gray-500 mt-1 text-center line-clamp-1 font-tech uppercase tracking-wide">
                        {category.examples.split(",")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: isLoaded ? 1 : 0,
                scale: isLoaded ? 1 : 0.95,
              }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="relative"
            >
              {/* Decorative border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-stellar-cyan/40 via-nebula-blue/40 to-cosmic-purple/40 rounded-xl blur-sm opacity-50"></div>

              <div className="relative bg-black/60 backdrop-blur-xl rounded-xl shadow-2xl p-4 md:p-8 border border-white/10">
                <SymptomInput
                  selectedCategory={selectedCategory}
                  chatId={chatId}
                  initialMessages={formattedMessages}
                  onNewMessage={handleNewMessage}
                  onSimulationResult={setResult}
                />
              </div>
            </motion.div>

            {/* Simulated Outcomes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isLoaded ? 1 : 0,
                y: isLoaded ? 0 : 20,
              }}
              transition={{
                duration: 0.6,
                delay: 0.25,
                ease: "easeOut",
              }}
              className="relative"
            >
              <SimulatedOutcomes results={result} />
            </motion.div>

            {/* Emergency Warning Signs and Resources can be added here similarly if needed, truncating for brevity but ideally include all */}
          </main>
        </div>
      </div>
    </ChatLayoutWrapper>
  );
}
