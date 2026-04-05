import { z } from "zod";

export const objectIdSchema = z.string().min(24).max(24);

export const registerSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(64)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const updateMeSchema = z.object({
  displayName: z.string().min(2).max(64).optional(),
  customStatus: z.string().max(120).optional(),
  status: z.enum(["online", "idle", "dnd", "invisible"]).optional(),
  banner: z.string().url().optional(),
  avatar: z.string().url().optional()
});

export const createServerSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(512).optional()
});

export const updateServerSchema = createServerSchema.partial().extend({
  icon: z.string().url().optional(),
  banner: z.string().url().optional()
});

export const createChannelSchema = z.object({
  name: z.string().min(1).max(64),
  topic: z.string().max(512).optional(),
  type: z.enum(["TEXT", "VOICE", "ANNOUNCEMENT"]).default("TEXT"),
  position: z.number().int().min(0).default(0),
  categoryName: z.string().max(64).optional(),
  isPrivate: z.boolean().default(false),
  slowMode: z.number().int().min(0).max(21600).default(0)
});

export const updateChannelSchema = createChannelSchema.partial();

export const messageAttachmentSchema = z.object({
  url: z.string().url(),
  filename: z.string().min(1),
  size: z.number().int().min(0),
  type: z.string().min(1)
});

export const sendMessageSchema = z.object({
  content: z.string().max(4000).default(""),
  replyTo: objectIdSchema.optional(),
  mentions: z.array(objectIdSchema).optional(),
  attachments: z.array(messageAttachmentSchema).optional()
});

export const updateMessageSchema = z.object({
  content: z.string().min(1).max(4000)
});

export const inviteSchema = z.object({
  serverId: objectIdSchema
});

export const paginationSchema = z.object({
  before: objectIdSchema.optional(),
  limit: z.coerce.number().int().min(1).max(50).default(50)
});

export const friendRequestSchema = z.object({
  status: z.enum(["pending", "accepted", "blocked"])
});

export const createDmSchema = z.object({
  userId: objectIdSchema
});

export const dmMessageSchema = z.object({
  content: z.string().max(4000),
  replyTo: objectIdSchema.optional(),
  attachments: z.array(messageAttachmentSchema).optional()
});
