import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all chats for a user with message content for search
export const getUserChats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    
    const userId = identity.subject;
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user_updated", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    
    // Get all messages for each chat for search indexing
    const chatsWithMessages = await Promise.all(
      chats.map(async (chat) => {
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_chat_created", (q) => q.eq("chatId", chat._id))
          .collect();
        
        // Concatenate all message content for search
        const messageContent = messages.map(m => m.content).join(" ");
        
        return {
          ...chat,
          messageContent,
        };
      })
    );
    
    return chatsWithMessages;
  },
});

// Get a single chat by ID
export const getChatById = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== identity.subject) {
      return null;
    }
    
    return chat;
  },
});

// Get messages for a chat
export const getChatMessages = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    
    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== identity.subject) {
      return [];
    }
    
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat_created", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
    
    return messages;
  },
});

// Create a new chat
export const createChat = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const userId = identity.subject;
    const now = Date.now();
    
    const chatId = await ctx.db.insert("chats", {
      userId,
      title: "New Conversation",
      preview: "Start a conversation...",
      createdAt: now,
      updatedAt: now,
    });
    
    // Add initial welcome message
    await ctx.db.insert("messages", {
      chatId,
      userId,
      content: "Hello! I'm AstroDoc, your health assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: now,
    });
    
    return chatId;
  },
});

// Add a message to a chat
export const addMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
    isUser: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== identity.subject) {
      throw new Error("Chat not found");
    }
    
    const now = Date.now();
    
    // Add the message
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      userId: identity.subject,
      content: args.content,
      isUser: args.isUser,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: now,
    });
    
    // Update chat title and preview
    const title = args.isUser
      ? args.content.substring(0, 50) + (args.content.length > 50 ? "..." : "")
      : chat.title;
    
    const preview = args.content.substring(0, 60) + (args.content.length > 60 ? "..." : "");
    
    await ctx.db.patch(args.chatId, {
      title: args.isUser && chat.title === "New Conversation" ? title : chat.title,
      preview,
      updatedAt: now,
    });
    
    return messageId;
  },
});

// Update a message (for streaming)
export const updateMessage = mutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const message = await ctx.db.get(args.messageId);
    if (!message || message.userId !== identity.subject) {
      throw new Error("Message not found");
    }
    
    await ctx.db.patch(args.messageId, {
      content: args.content,
    });
    
    // Update chat preview
    const chat = await ctx.db.get(message.chatId);
    if (chat) {
      const preview = args.content.substring(0, 60) + (args.content.length > 60 ? "..." : "");
      await ctx.db.patch(message.chatId, {
        preview,
        updatedAt: Date.now(),
      });
    }
  },
});

// Delete a chat and its messages
export const deleteChat = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== identity.subject) {
      throw new Error("Chat not found");
    }
    
    // Delete all messages in the chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();
    
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    
    // Delete the chat
    await ctx.db.delete(args.chatId);
  },
});
