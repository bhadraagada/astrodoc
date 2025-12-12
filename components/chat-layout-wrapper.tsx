"use client";

import { ChatSidebar } from "@/components/chat-sidebar";
import Header from "@/components/header";
import { useConvexChat } from "@/hooks/use-convex-chat";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Id } from "@/convex/_generated/dataModel";

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
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar
        chats={sidebarChats}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
