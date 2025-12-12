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

export default function ChatLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const { chats, createNewChat, deleteChat } = useConvexChat();
  const router = useRouter();

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
    <div className="flex h-screen overflow-hidden bg-deep-space text-moon-silver font-sans">
      <ChatSidebar
        chats={sidebarChats}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={false}
        onClose={() => {}}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <Button
            onClick={() => setIsSidebarOpen(true)}
            variant="outline"
            size="icon"
            className="bg-black/60 backdrop-blur-md border-stellar-cyan/50 text-stellar-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-stellar-cyan/20"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* We don't need Header here as it is included in the page content for better control over animations */}
        {/* <Header /> */}

        <main className="flex-1 overflow-y-auto relative w-full h-full scrollbar-thin scrollbar-thumb-stellar-cyan/20 scrollbar-track-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
