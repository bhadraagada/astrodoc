"use client";

import { useConvexChat } from "@/hooks/use-convex-chat";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ChatRedirect() {
  const router = useRouter();
  const { createNewChat } = useConvexChat();
  const hasCreated = useRef(false);

  useEffect(() => {
    // Only create once to prevent infinite loop
    if (hasCreated.current) return;
    hasCreated.current = true;

    // Create a new chat and redirect to it
    const create = async () => {
      const newChatId = await createNewChat();
      router.replace(`/chats/${newChatId}`);
    };
    create();
  }, [createNewChat, router]);

  // Simple loading - no ChatLayoutWrapper to avoid re-render issues
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Creating new chat...</p>
      </div>
    </div>
  );
}
