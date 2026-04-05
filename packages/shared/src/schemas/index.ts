import { z } from "zod";
import { ChannelType, UserStatus } from "../types";

const objectIdRegex = /^[a-f\d]{24}$/i;
const usernameRegex = /^[a-zA-Z0-9_]+$/;

export const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(usernameRegex, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const updateUserSchema = z.object({
  displayName: z.string().min(1).max(64).optional(),
  customStatus: z.string().max(120).optional(),
  status: z.nativeEnum(UserStatus).exclude([UserStatus.OFFLINE]).optional()
});

export const createServerSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(512).optional()
});

export const updateServerSchema = createServerSchema.partial();

export const createChannelSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.nativeEnum(ChannelType).optional(),
  categoryName: z.string().max(64).optional(),
  topic: z.string().max(1024).optional(),
  position: z.number().int().min(0).optional()
});

export const updateChannelSchema = createChannelSchema.partial().extend({
  slowMode: z.number().int().min(0).max(21600).optional()
});

export const attachmentSchema = z.object({
  url: z.string().url(),
  filename: z.string().min(1),
  size: z.number().int().min(0),
  type: z.string().min(1)
});

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  replyTo: z.string().regex(objectIdRegex, "Invalid message id").optional(),
  attachments: z.array(attachmentSchema).optional()
});

export const editMessageSchema = z.object({
  content: z.string().min(1).max(2000)
});

export const createRoleSchema = z.object({
  name: z.string().min(1).max(64),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  permissions: z.array(z.string()).default([])
});

export const joinServerSchema = z.object({
  inviteCode: z.string().min(1)
});

export const paginationSchema = z.object({
  before: z.string().regex(objectIdRegex, "Invalid cursor").optional(),
  limit: z.number().int().min(1).max(50).optional()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateServerInput = z.infer<typeof createServerSchema>;
export type UpdateServerInput = z.infer<typeof updateServerSchema>;
export type CreateChannelInput = z.infer<typeof createChannelSchema>;
export type UpdateChannelInput = z.infer<typeof updateChannelSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type EditMessageInput = z.infer<typeof editMessageSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type JoinServerInput = z.infer<typeof joinServerSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
