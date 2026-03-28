import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
    /** UTC ms since epoch when the todo is due (optional reminder). */
    dueAt: v.optional(v.number()),
  }),
});
