import { SimulationResult, TimelineChoice } from "@/utils/gemini-api";
import { AvatarImage } from "@radix-ui/react-avatar";
import { SendHorizontal, StopCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

type SymptomInputProps = {
  selectedCategory?: string | null;
  onSubmit?: (symptom: string) => void;
  onSimulationResult?: (result: ResultData) => void;
  isLoading?: boolean;
};

// Define the structure that matches result.json
interface Timeline {
  path: string;
  action: string;
  days: Array<{
    day: number;
    description: string;
  }>;
  riskPercentage: number;
  recoveryPercentage: number;
}

// Export the interface so it can be imported in other files
export interface ResultData {
  timelines: Timeline[];
  bestPath: {
    pathIndex: number;
    explanation: string;
  };
  disclaimer: string;
}

export default function SymptomInput({
  selectedCategory,
  onSubmit,
  onSimulationResult,
  isLoading: externalLoading = false,
}: SymptomInputProps) {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{
      content: string;
      isUser: boolean;
      timestamp: string;
      simulationData?: any;
    }>
  >([
    {
      content:
        "Systems Online. I'm AstroDoc, your mission health specialist. Report biometric status or symptoms.",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = externalLoading || isLocalLoading;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.parentElement;
      if (chatContainer) {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  const handleCancelSubmission = () => {
    toast.loading("Aborting transmission...");

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setIsLocalLoading(false);

    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (!lastMessage.isUser && lastMessage.content.includes("Processing")) {
        return prev.slice(0, -1);
      }
      return prev;
    });

    setMessages((prev) => [
      ...prev,
      {
        content: "Transmission aborted. Standby for new input.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      content: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    if (onSubmit) {
      onSubmit(input);
    }

    const symptomWithContext = selectedCategory
      ? `[Category: ${selectedCategory}] ${input}`
      : `[Category: General] ${input}`;

    setInput("");
    setIsLocalLoading(true);

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const processingMessage = {
        content: "Processing biometric data... Running predictive simulations...",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, processingMessage]);

      let result;
      try {
        result = await generateMedicalSimulationWithAbort(symptomWithContext, signal);

        // Format the simulation data into a chat message
        const resultMessage = {
          content: formatSimulationResult(result),
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          simulationData: result,
        };

        setMessages((prev) => [...prev.slice(0, -1), resultMessage]);

        if (result && 'timelines' in result && Array.isArray(result.timelines) && onSimulationResult) {
          onSimulationResult(result as unknown as ResultData);
        }

        toast.success("Analysis complete. Trajectories mapped.");
      } catch (apiError) {
        if (apiError instanceof Error && apiError.name === "AbortError") {
          console.log("Request was aborted");
          throw apiError;
        }
        console.error("API error:", apiError);
        toast.error("Transmission failed. Retrying suggested.");
        throw apiError;
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Error generating simulation:", error);

      const errorMessage = {
        content: `System Warning: Analysis algorithm encountered an unexpected error. ${error instanceof Error ? "Diagnostic: " + error.message : ""
          }`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLocalLoading(false);
      abortControllerRef.current = null;
    }
  };

  const formatSimulationResult = (result: any): string => {
    if (result && result.timelines && Array.isArray(result.timelines)) {
      const data = result as ResultData;
      let message = `**Analysis Complete. ${data.timelines.length} potential trajectories mapped:**\n\n`;

      data.timelines.forEach((timeline, index) => {
        const isBestPath = index === data.bestPath.pathIndex;
        message += `**${timeline.path}** ${isBestPath ? "✅ (Optimal)" : ""}\n`;
        message += `${timeline.action}\n`;
        message += `• Risk Probability: ${timeline.riskPercentage}%\n`;
        message += `• Recovery Probability: ${timeline.recoveryPercentage}%\n`;

        if (timeline.days && Array.isArray(timeline.days)) {
          message += `• Progression:\n`;
          timeline.days.forEach((day) => {
            message += `  - Cycle ${day.day}: ${day.description}\n`;
          });
        }
        message += `\n`;
      });

      if (data.bestPath && data.bestPath.explanation) {
        message += `**💡 Strategic Recommendation:**\n${data.bestPath.explanation}\n\n`;
      }

      if (data.disclaimer) {
        message += `_${data.disclaimer}_`;
      } else {
        message += `_Simulation data only. Not a substitute for professional medical directives._`;
      }

      return message;
    } else if (result && result.paths && Array.isArray(result.paths)) {
      const oldData = result as SimulationResult; // Using legacy type for fallback
      let message = `**Trajectories analyzed:**\n\n`;

      oldData.paths.forEach((path) => {
        message += `**${path.title || "Unknown Trajectory"}**\n`;
        message += `${path.description || "No data available"}\n`;
        message += `• Risk: ${path.riskScore !== undefined ? path.riskScore : "Unknown"}%\n`;
        message += `• Recovery: ${path.recoveryChance !== undefined ? path.recoveryChance : "Unknown"}%\n`;

        if (path.days && Array.isArray(path.days) && path.days.length > 0) {
          message += `• Timeline:\n`;
          path.days.forEach((day) => {
            message += `  - Cycle ${day.day || "?"}: ${day.event || "Unknown event"}\n`;
          });
        } else {
          message += `• Timeline: No temporal data\n`;
        }
        message += `\n`;
      });

      if (oldData.recommendation) {
        message += `**💡 Recommendation:**\n${oldData.recommendation}\n\n`;
      } else {
        message += `**💡 Recommendation:**\nConsult Flight Surgeon for directives.\n\n`;
      }

      const disclaimer = oldData.disclaimer || "Simulation data only. Not a substitute for professional medical directives.";
      message += `_${disclaimer}_`;

      return message;
    } else if (result && result.type === 'text') {
      return result.content;
    }

    return "**analysis_failed: data_structure_mismatch**\n\nRetry input with specific parameters.";
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-star-white mb-2 font-space">
          Command Console
        </h3>
        <p className="text-moon-silver mb-4 font-light font-tech">
          Input biometric data to generate predictive models.
        </p>
      </div>

      <div
        className={`bg-black/40 backdrop-blur-md rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border border-stellar-cyan/20 p-4 mb-4 overflow-y-auto transition-all duration-300 ease-in-out scrollbar-thin scrollbar-thumb-stellar-cyan/20 scrollbar-track-transparent ${messages.length <= 2
          ? "h-[350px]"
          : messages.length <= 4
            ? "h-[450px]"
            : "h-[650px]"
          }`}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-4 flex ${msg.isUser ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 shadow-lg transition-all duration-200 ${msg.isUser
                ? "bg-gradient-to-r from-stellar-cyan/20 to-nebula-blue/20 border border-stellar-cyan/30 text-star-white rounded-tr-none transform hover:scale-[1.01]"
                : "bg-deep-space/80 border border-moon-silver/10 text-moon-silver rounded-tl-none transform hover:scale-[1.01]"
                }`}
            >
              <div className="flex items-center mb-1">
                {msg.isUser && user && (
                  <Avatar className="h-6 w-6 mr-2 ring-1 ring-stellar-cyan/50">
                    <AvatarImage
                      src={user.imageUrl}
                      alt={user.fullName || "User"}
                    />
                    <div className="bg-gradient-to-br from-stellar-cyan to-nebula-blue h-full w-full rounded-full flex items-center justify-center text-xs font-medium text-deep-space">
                      {user.firstName?.[0] || "C"}
                    </div>
                  </Avatar>
                )}
                <span
                  className={`text-[10px] uppercase tracking-wider font-tech ${msg.isUser
                    ? "text-stellar-cyan"
                    : "text-moon-silver/60"
                    }`}
                >
                  {msg.isUser ? "Cmdr. " + (user?.firstName || "User") : "AstroDoc AI"} •{" "}
                  {msg.timestamp}
                </span>
              </div>
              <div
                className={`text-sm whitespace-pre-wrap leading-relaxed ${msg.isUser ? "font-light" : "font-light text-moon-silver"
                  }`}
              >
                {msg.content.split("\n").map((line, i) => {
                  const boldPattern = /\*\*(.*?)\*\*/g;
                  const processedLine = line.replace(
                    boldPattern,
                    "<strong class='font-medium text-lg block pt-2 text-stellar-cyan font-space'>$1</strong>"
                  );

                  const italicPattern = /_(.*?)_/g;
                  const finalProcessedLine = processedLine.replace(
                    italicPattern,
                    "<em class='text-moon-silver/60 italic text-xs block pt-2 border-t border-white/5 mt-2'>$1</em>"
                  );

                  const bulletPattern = /^• (.*)/g;
                  const withBullets = finalProcessedLine.replace(
                    bulletPattern,
                    "<span class='flex items-start py-0.5'><span class='text-stellar-cyan mr-2 mt-1 text-xs'>►</span><span>$1</span></span>"
                  );

                  return (
                    <p
                      key={i}
                      className="mb-1"
                      dangerouslySetInnerHTML={{ __html: withBullets }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-stellar-cyan/50 font-tech text-xs">{">"}</span>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter biometric data...`}
            className="w-full rounded-md border border-stellar-cyan/30 bg-black/40 pl-8 p-3 text-star-white shadow-inner focus:outline-none focus:ring-1 focus:ring-stellar-cyan focus:border-stellar-cyan font-tech transition-all duration-200 placeholder:text-moon-silver/30"
            disabled={isLoading}
          />
        </div>

        {isLoading ? (
          <Button
            type="button"
            onClick={handleCancelSubmission}
            className="bg-critical-red/20 border border-critical-red/50 text-critical-red hover:bg-critical-red/30 h-[46px] w-[46px] p-0 rounded-md transition-all duration-200 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
          >
            <div className="flex items-center justify-center w-full h-full">
              <StopCircleIcon
                size={20}
                className="animate-pulse"
              />
            </div>
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!input.trim()}
            className="bg-stellar-cyan/10 border border-stellar-cyan/50 text-stellar-cyan hover:bg-stellar-cyan/20 hover:text-white h-[46px] w-[46px] p-0 rounded-md transition-all duration-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          >
            <SendHorizontal
              size={20}
            />
          </Button>
        )}
      </form>
    </div>
  );
}

const generateMedicalSimulationWithAbort = async (
  symptom: string,
  signal?: AbortSignal,
  choices: TimelineChoice[] = [
    "do nothing",
    "seek medical attention",
    "self-medicate with over-the-counter remedies",
  ]
): Promise<any> => {
  try {
    const response = await fetch("/api/test-gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symptom,
        choices,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      return data.data;
    } else {
      throw new Error(data.message || "Failed to generate simulations");
    }
  } catch (error) {
    console.error("Error in generateMedicalSimulation:", error);
    throw error;
  }
};
