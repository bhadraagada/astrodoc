"use client";

import { ChatSidebar } from "@/components/chat-sidebar";
import Header from "@/components/header";
import { useConvexChat } from "@/hooks/use-convex-chat";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  }));

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar
        chats={sidebarChats}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-30">
          <Button
            onClick={() => setIsSidebarOpen(true)}
            variant="outline"
            size="icon"
            className="bg-white dark:bg-gray-800 shadow-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <Header />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
