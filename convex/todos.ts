import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("todos").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    text: v.string(),
    dueAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const trimmed = args.text.trim();
    if (trimmed.length === 0) {
      throw new Error("Todo text cannot be empty");
    }
    if (args.dueAt !== undefined && !Number.isFinite(args.dueAt)) {
      throw new Error("Invalid due date");
    }
    return await ctx.db.insert("todos", {
      text: trimmed,
      completed: false,
      ...(args.dueAt !== undefined ? { dueAt: args.dueAt } : {}),
    });
  },
});

export const setDueAt = mutation({
  args: {
    id: v.id("todos"),
    /** Pass `null` to clear the reminder. */
    dueAt: v.union(v.number(), v.null()),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (args.dueAt !== null && !Number.isFinite(args.dueAt)) {
      throw new Error("Invalid due date");
    }
    if (args.dueAt === null) {
      await ctx.db.patch(args.id, { dueAt: undefined });
    } else {
      await ctx.db.patch(args.id, { dueAt: args.dueAt });
    }
  },
});

export const toggle = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    await ctx.db.patch(args.id, { completed: !todo.completed });
  },
});

export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
