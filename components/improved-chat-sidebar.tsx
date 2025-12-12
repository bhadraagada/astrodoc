"use client";

import * as React from "react";
import {
  PenSquare,
  Search,
  Trash2,
  MessageCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserButton, useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

interface Chat {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  chats: Chat[];
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({
  chats,
  onNewChat,
  onDeleteChat,
  isOpen,
  onClose,
}: ChatSidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupChatsByDate = (chats: Chat[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
      today: [] as Chat[],
      yesterday: [] as Chat[],
      lastWeek: [] as Chat[],
      older: [] as Chat[],
    };

    chats.forEach((chat) => {
      const chatDate = new Date(chat.timestamp);
      chatDate.setHours(0, 0, 0, 0);
      const todayDate = new Date(today);
      todayDate.setHours(0, 0, 0, 0);
      const yesterdayDate = new Date(yesterday);
      yesterdayDate.setHours(0, 0, 0, 0);

      if (chatDate.getTime() === todayDate.getTime()) {
        groups.today.push(chat);
      } else if (chatDate.getTime() === yesterdayDate.getTime()) {
        groups.yesterday.push(chat);
      } else if (chatDate > lastWeek) {
        groups.lastWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  };

  const groupedChats = groupChatsByDate(filteredChats);

  return (
    <Sidebar className="bg-[#0a0e1a] border-r border-white/10">
      <SidebarHeader className="bg-[#0a0e1a] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-rose-600">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
            AstroDoc
          </span>
        </div>
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white mt-2"
          size="sm"
        >
          <PenSquare className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="bg-[#0a0e1a]">
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-black/40 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-4 px-2 py-2">
            {groupedChats.today.length > 0 && (
              <div>
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Today
                </h3>
                {groupedChats.today.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={pathname === `/chats/${chat.id}`}
                    onDelete={onDeleteChat}
                    isHovered={hoveredChatId === chat.id}
                    onHover={() => setHoveredChatId(chat.id)}
                    onHoverEnd={() => setHoveredChatId(null)}
                  />
                ))}
              </div>
            )}

            {groupedChats.yesterday.length > 0 && (
              <div>
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Yesterday
                </h3>
                {groupedChats.yesterday.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={pathname === `/chats/${chat.id}`}
                    onDelete={onDeleteChat}
                    isHovered={hoveredChatId === chat.id}
                    onHover={() => setHoveredChatId(chat.id)}
                    onHoverEnd={() => setHoveredChatId(null)}
                  />
                ))}
              </div>
            )}

            {groupedChats.lastWeek.length > 0 && (
              <div>
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Previous 7 Days
                </h3>
                {groupedChats.lastWeek.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={pathname === `/chats/${chat.id}`}
                    onDelete={onDeleteChat}
                    isHovered={hoveredChatId === chat.id}
                    onHover={() => setHoveredChatId(chat.id)}
                    onHoverEnd={() => setHoveredChatId(null)}
                  />
                ))}
              </div>
            )}

            {groupedChats.older.length > 0 && (
              <div>
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Older
                </h3>
                {groupedChats.older.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={pathname === `/chats/${chat.id}`}
                    onDelete={onDeleteChat}
                    isHovered={hoveredChatId === chat.id}
                    onHover={() => setHoveredChatId(chat.id)}
                    onHoverEnd={() => setHoveredChatId(null)}
                  />
                ))}
              </div>
            )}

            {filteredChats.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageCircle className="h-12 w-12 text-gray-700 mb-3" />
                <p className="text-sm text-gray-400">
                  {searchQuery ? "No chats found" : "No chat history yet"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {searchQuery
                    ? "Try a different search"
                    : "Start a new conversation"}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="bg-[#0a0e1a] border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-auto py-3 hover:bg-white/5">
              <div className="flex items-center gap-3 w-full">
                <UserButton
                  afterSignOutUrl="/sign-in"
                  appearance={{
                    elements: {
                      userButtonTrigger: "w-10 h-10 flex-shrink-0",
                      avatarBox: "w-10 h-10",
                      userButtonPopoverCard: "z-[100]",
                      userButtonPopoverActionButton:
                        "text-white hover:text-white",
                      userButtonPopoverActionButtonText: "text-white",
                      userButtonPopoverFooter: "hidden",
                    },
                  }}
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.fullName || user?.firstName || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.primaryEmailAddress?.emailAddress || ""}
                  </p>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function ChatItem({
  chat,
  isActive,
  onDelete,
  isHovered,
  onHover,
  onHoverEnd,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (id: string) => void;
  isHovered: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <Link
      href={`/chats/${chat.id}`}
      className={`group relative flex items-start gap-2 px-2 py-2 rounded-lg mb-1 transition-all ${
        isActive
          ? "bg-rose-950/30 border-l-2 border-rose-500"
          : "hover:bg-white/5"
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
    >
      <MessageCircle
        className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
          isActive ? "text-rose-500" : "text-gray-400"
        }`}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            isActive ? "text-rose-300" : "text-gray-300"
          }`}
        >
          {chat.title}
        </p>
        <p className="text-xs text-gray-400 truncate">{chat.preview}</p>
      </div>
      {isHovered && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(chat.id);
          }}
          className="flex-shrink-0 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </Link>
  );
}
