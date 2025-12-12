"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: string;
  isStreaming?: boolean;
}

interface Chat {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messages: Message[];
}

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  createNewChat: () => string;
  deleteChat: (id: string) => void;
  getChatById: (id: string) => Chat | undefined;
  updateChat: (id: string, messages: Message[]) => void;
  setCurrentChatId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatIdState] = useState<string | null>(null);

  const setCurrentChatId = useCallback((id: string | null) => {
    setCurrentChatIdState(id);
  }, []);

  // Load chats from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("paradoc-chats");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const chatsWithDates = parsed.map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp),
        }));
        setChats(chatsWithDates);
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("paradoc-chats", JSON.stringify(chats));
    }
  }, [chats]);

  const createNewChat = useCallback((): string => {
    const newChatId = `chat-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const newChat: Chat = {
      id: newChatId,
      title: "New Conversation",
      preview: "Start a conversation...",
      timestamp: new Date(),
      messages: [
        {
          content:
            "Hello! I'm ParaDoc, your health assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    return newChatId;
  }, []);

  const deleteChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    setCurrentChatIdState((current) => (current === id ? null : current));
  }, []);

  const getChatById = useCallback(
    (id: string): Chat | undefined => {
      return chats.find((chat) => chat.id === id);
    },
    [chats]
  );

  const updateChat = useCallback((id: string, messages: Message[]) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === id) {
          // Extract title from first user message if available
          const firstUserMsg = messages.find((m) => m.isUser);
          const title = firstUserMsg
            ? firstUserMsg.content.substring(0, 50) +
              (firstUserMsg.content.length > 50 ? "..." : "")
            : "New Conversation";

          // Extract preview from last message
          const lastMsg = messages[messages.length - 1];
          const preview = lastMsg
            ? lastMsg.content.substring(0, 60) +
              (lastMsg.content.length > 60 ? "..." : "")
            : "Start a conversation...";

          return {
            ...chat,
            messages,
            title,
            preview,
            timestamp: new Date(),
          };
        }
        return chat;
      })
    );
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        createNewChat,
        deleteChat,
        getChatById,
        updateChat,
        setCurrentChatId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatHistory() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatHistory must be used within a ChatProvider");
  }
  return context;
}
