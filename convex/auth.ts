"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

export const getClerkUser = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity;
  },
});
