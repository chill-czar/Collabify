import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    projectId: v.optional(v.string()),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"])
    .index("by_project", ["projectId", "parentDocument"]),
  board: defineTable({
    title: v.string(),
    createdBy: v.string(),
    projectId: v.string(),
    document: v.optional(v.string()),
    whiteboard: v.optional(v.string()),
    lastEdited: v.optional(v.number()),
    isArchived: v.boolean(),
  }).index("by_projectId", ["projectId"]),
});
