"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PenSquare, MessageSquare, Trash2, Search, X, ChevronLeft, Rocket } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";
import { UserButton, useUser } from "@clerk/nextjs";

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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 w-72 border-r border-white/10 bg-black/60 backdrop-blur-xl flex flex-col h-screen z-50 lg:z-10 transform transition-transform duration-300 shadow-[5px_0_30px_rgba(0,0,0,0.5)] ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Decorative orbit line */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-stellar-cyan/20 to-transparent"></div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-moon-silver"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <Button
            onClick={onNewChat}
            className="w-full bg-stellar-cyan/10 hover:bg-stellar-cyan/20 text-stellar-cyan border border-stellar-cyan/50 hover:border-stellar-cyan transition-all duration-300 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-stellar-cyan/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Rocket className="h-4 w-4 mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
            <span className="font-space tracking-wider relative z-10">INITIATE SESSION</span>
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 pt-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-moon-silver/50 group-focus-within:text-stellar-cyan transition-colors" />
            <Input
              type="text"
              placeholder="SEARCH LOGS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-deep-space/50 border-white/10 focus:border-stellar-cyan/50 text-moon-silver placeholder:text-moon-silver/30 font-tech tracking-wide h-9 transition-all duration-300"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-stellar-cyan/20">
          {groupedChats.today.length > 0 && (
            <div className="mb-6">
              <h3 className="px-3 py-2 text-[10px] font-bold text-stellar-cyan/70 uppercase tracking-[0.2em] font-space flex items-center">
                <span className="w-1 h-3 bg-stellar-cyan/50 mr-2 rounded-full"></span>
                Current Rotation
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
            <div className="mb-6">
              <h3 className="px-3 py-2 text-[10px] font-bold text-moon-silver/50 uppercase tracking-[0.2em] font-space flex items-center">
                <span className="w-1 h-3 bg-moon-silver/30 mr-2 rounded-full"></span>
                T-Minus 24H
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
            <div className="mb-6">
              <h3 className="px-3 py-2 text-[10px] font-bold text-moon-silver/50 uppercase tracking-[0.2em] font-space flex items-center">
                <span className="w-1 h-3 bg-moon-silver/30 mr-2 rounded-full"></span>
                Previous Cycle
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
            <div className="mb-6">
              <h3 className="px-3 py-2 text-[10px] font-bold text-moon-silver/50 uppercase tracking-[0.2em] font-space flex items-center">
                <span className="w-1 h-3 bg-moon-silver/30 mr-2 rounded-full"></span>
                Archived Logs
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
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Rocket className="h-8 w-8 text-moon-silver" />
              </div>
              <p className="text-sm text-moon-silver font-space tracking-wide">
                {searchQuery ? "NO LOGS FOUND" : "NO MISSION HISTORY"}
              </p>
              <p className="text-xs text-moon-silver/50 mt-1 font-tech">
                {searchQuery
                  ? "Refine parameters"
                  : "Initiate new simulation"}
              </p>
            </div>
          )}
        </div>

        {/* Footer - User Profile */}
        <div className="p-4 border-t border-white/10 relative bg-black/20 backdrop-blur-md">
          <div className="w-full flex items-center justify-center">
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  userButtonBox: "w-full",
                  userButtonTrigger:
                    "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10",
                  avatarBox: "w-10 h-10 flex-shrink-0 ring-2 ring-stellar-cyan/30",
                  userButtonOuterIdentifier: "hidden",
                  userButtonPopoverCard: "z-50 bg-deep-space border-white/10 text-white font-tech",
                  userButtonPopoverActionButton:
                    "hover:bg-white/10 text-white",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            />
            <div className="absolute top-1/2 left-16 -translate-y-1/2 flex-1 min-w-0 pointer-events-none pr-6 ">
              <p className="text-sm font-bold text-star-white truncate font-space tracking-wide">
                {user?.fullName || "Commander"}
              </p>
              <p className="text-[10px] text-stellar-cyan truncate font-mono uppercase">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center text-[10px] text-moon-silver/40 font-tech uppercase tracking-widest border-t border-white/5 pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2"></div>
            System Online
          </div>
        </div>
      </aside>
    </>
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
      className={`group relative flex items-start gap-3 px-3 py-3 rounded-r-none rounded-l-lg mb-1 transition-all duration-300 border-l-2 ${isActive
          ? "bg-stellar-cyan/10 border-stellar-cyan/80 shadow-[inset_10px_0_20px_rgba(6,182,212,0.1)]"
          : "hover:bg-white/5 border-transparent hover:border-white/20"
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`mt-0.5 transition-colors duration-300 ${isActive ? "text-stellar-cyan" : "text-moon-silver/50 group-hover:text-moon-silver"}`}>
        <MessageSquare className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate font-tech tracking-wide transition-colors ${isActive
              ? "text-star-white"
              : "text-moon-silver group-hover:text-white"
            }`}
        >
          {chat.title || "Untitled Simulation"}
        </p>
        <p className={`text-xs truncate font-mono transition-colors ${isActive ? "text-stellar-cyan/70" : "text-moon-silver/40"}`}>
          {chat.preview || "No data..."}
        </p>
      </div>

      {/* Date display or Delete action */}
      <div className="h-full flex items-center">
        {isHovered ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(chat.id);
            }}
            className="p-1.5 rounded-md hover:bg-red-500/20 text-moon-silver hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        ) : (
          <ChevronLeft className={`h-3 w-3 transition-opacity ${isActive ? "text-stellar-cyan opacity-100" : "opacity-0"}`} />
        )}
      </div>
    </Link>
  );
}
