"use client";

import { ChatSidebar } from "@/components/improved-chat-sidebar";
import { useConvexChat } from "@/hooks/use-convex-chat";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export default function ChatLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const { chats, createNewChat, deleteChat } = useConvexChat();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNewChat = async () => {
    const newChatId = await createNewChat();
    router.push(`/chats/${newChatId}`);
  };

  const handleDeleteChat = async (id: string) => {
    if (confirm("Are you sure you want to delete this chat?")) {
      await deleteChat(id as Id<"chats">);
      router.push("/");
    }
  };

  // Transform chats for sidebar (convert Convex format to sidebar format)
  const sidebarChats = chats.map((chat) => ({
    id: chat._id,
    title: chat.title,
    preview: chat.preview,
    timestamp: new Date(chat.updatedAt),
    messageContent: (chat as any).messageContent,
  }));

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-deep-space text-moon-silver font-sans">
        <ChatSidebar
          chats={sidebarChats}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto relative w-full h-full scrollbar-thin scrollbar-thumb-stellar-cyan/20 scrollbar-track-transparent">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
