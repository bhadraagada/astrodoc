"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PenSquare, MessageSquare, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";

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
}

export function ChatSidebar({
  chats,
  onNewChat,
  onDeleteChat,
}: ChatSidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

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
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex flex-col h-screen">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white"
        >
          <PenSquare className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 px-2 overflow-y-auto">
        {groupedChats.today.length > 0 && (
          <div className="mb-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Today
            </h3>
            {groupedChats.today.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={pathname === `/chats/${chat.id}`}
                onDelete={onDeleteChat}
              />
            ))}
          </div>
        )}

        {groupedChats.yesterday.length > 0 && (
          <div className="mb-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Yesterday
            </h3>
            {groupedChats.yesterday.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={pathname === `/chats/${chat.id}`}
                onDelete={onDeleteChat}
              />
            ))}
          </div>
        )}

        {groupedChats.lastWeek.length > 0 && (
          <div className="mb-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Previous 7 Days
            </h3>
            {groupedChats.lastWeek.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={pathname === `/chats/${chat.id}`}
                onDelete={onDeleteChat}
              />
            ))}
          </div>
        )}

        {groupedChats.older.length > 0 && (
          <div className="mb-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Older
            </h3>
            {groupedChats.older.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={pathname === `/chats/${chat.id}`}
                onDelete={onDeleteChat}
              />
            ))}
          </div>
        )}

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? "No chats found" : "No chat history yet"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {searchQuery
                ? "Try a different search"
                : "Start a new conversation"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          ParaDoc Health Assistant
        </p>
      </div>
    </aside>
  );
}

function ChatItem({
  chat,
  isActive,
  onDelete,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/chats/${chat.id}`}
      className={`group relative flex items-start gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
        isActive
          ? "bg-white dark:bg-gray-800 shadow-sm"
          : "hover:bg-white dark:hover:bg-gray-800/50"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MessageSquare className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            isActive
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {chat.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {chat.preview}
        </p>
      </div>
      {isHovered && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(chat.id);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </Link>
  );
}
