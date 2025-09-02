import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Id, Doc } from "./_generated/dataModel";

export const createBoard = mutation({
  args: {
    title: v.string(),
    projectId: v.string(),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const board = await context.db.insert("board", {
      title: args.title,
      createdBy: userId,
      projectId: args.projectId,
      isArchived: false,
      lastEdited: Date.now(),
      document: ""
    });

    return board;
  },
});

export const getProjectBoard = query({
  args: {
    projectId: v.string(),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const boards = await context.db
      .query("board")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return boards;
  },
});
export const getBoardById = query({
  args: { currentBoardId: v.id("board") },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();
    const document = await context.db.get(args.currentBoardId);
    if (!document) {
      throw new Error("Not found");
    }
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return document;
  },
});
export const updateBoard = mutation({
  args: {
    id: v.id("board"),
    title: v.optional(v.string()),
    document: v.optional(v.string()),
    whiteboard: v.optional(v.string()),
    lastEdited: v.optional(v.number()),
    isArchived: v.optional(v.boolean()),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const { id, ...rest } = args;

    const existingDocument = await context.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }
    const board = await context.db.patch(args.id, {
      ...rest,
    });
    return board;
  },
});
