"use client";

import SymptomInput from "@/components/symptom-input";
import ChatLayoutWrapper from "@/components/chat-layout-wrapper";
import {
  useChatById,
  useChatMessages,
  useConvexChat,
} from "@/hooks/use-convex-chat";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ResultData } from "@/components/symptom-input";
import { Id } from "@/convex/_generated/dataModel";

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

  useEffect(() => {
    if (!isValidConvexId) return;

    // If chat is explicitly null (not undefined/loading), redirect
    if (chat === null) {
      router.push("/");
    } else if (chat !== undefined) {
      setIsLoading(false);
    }
  }, [chat, router, isValidConvexId]);

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
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading chat...</p>
          </div>
        </div>
      </ChatLayoutWrapper>
    );
  }

  return (
    <ChatLayoutWrapper>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <SymptomInput
          chatId={chatId}
          initialMessages={formattedMessages}
          onNewMessage={handleNewMessage}
          onSimulationResult={setResult}
        />
      </div>
    </ChatLayoutWrapper>
  );
}
