"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCallback } from "react";

export interface Message {
  _id?: Id<"messages">;
  content: string;
  isUser: boolean;
  timestamp: string;
  isStreaming?: boolean;
}

export interface Chat {
  _id: Id<"chats">;
  userId: string;
  title: string;
  preview: string;
  createdAt: number;
  updatedAt: number;
}

export function useConvexChat() {
  const chats = useQuery(api.chats.getUserChats) ?? [];
  const createChatMutation = useMutation(api.chats.createChat);
  const deleteChatMutation = useMutation(api.chats.deleteChat);
  const addMessageMutation = useMutation(api.chats.addMessage);
  const updateMessageMutation = useMutation(api.chats.updateMessage);

  const createNewChat = useCallback(async () => {
    const chatId = await createChatMutation();
    return chatId;
  }, [createChatMutation]);

  const deleteChat = useCallback(async (chatId: Id<"chats">) => {
    await deleteChatMutation({ chatId });
  }, [deleteChatMutation]);

  const addMessage = useCallback(async (
    chatId: Id<"chats">,
    content: string,
    isUser: boolean
  ) => {
    const messageId = await addMessageMutation({ chatId, content, isUser });
    return messageId;
  }, [addMessageMutation]);

  const updateMessage = useCallback(async (
    messageId: Id<"messages">,
    content: string
  ) => {
    await updateMessageMutation({ messageId, content });
  }, [updateMessageMutation]);

  return {
    chats,
    createNewChat,
    deleteChat,
    addMessage,
    updateMessage,
  };
}

export function useChatMessages(chatId: Id<"chats"> | null) {
  const messages = useQuery(
    api.chats.getChatMessages,
    chatId ? { chatId } : "skip"
  ) ?? [];
  
  return messages;
}

export function useChatById(chatId: Id<"chats"> | null) {
  const chat = useQuery(
    api.chats.getChatById,
    chatId ? { chatId } : "skip"
  );
  
  return chat;
}
