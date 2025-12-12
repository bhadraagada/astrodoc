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
    <div className="min-h-screen bg-deep-space flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-stellar-cyan/30 border-t-stellar-cyan rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stellar-cyan font-space tracking-wider animation-pulse">Initializing Comm-Link...</p>
      </div>
    </div>
  );
}
