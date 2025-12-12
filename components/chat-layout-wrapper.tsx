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
    <SidebarProvider>
      <ChatSidebar
        chats={sidebarChats}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={false}
        onClose={() => {}}
      />
      <SidebarInset>
        <div className="flex h-full flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
