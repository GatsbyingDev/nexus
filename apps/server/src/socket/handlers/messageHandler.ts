import type { Server } from "socket.io";
import { z } from "zod";
import { ChannelModel } from "../../models/Channel";
import { MessageModel } from "../../models/Message";
import { ServerModel } from "../../models/Server";
import { channelRoom } from "../../utils/room";
import type { NexusSocket } from "../middleware/socketAuth";

const sendMessageSchema = z.object({
  channelId: z.string(),
  content: z.string().min(1).max(2000),
  replyTo: z.string().optional(),
  attachments: z
    .array(
      z.object({
        url: z.string().url(),
        filename: z.string().min(1),
        size: z.number().int().min(0),
        type: z.string().min(1)
      })
    )
    .optional()
    .default([])
});

const editMessageSchema = z.object({
  messageId: z.string(),
  content: z.string().min(1).max(2000)
});

const deleteMessageSchema = z.object({
  messageId: z.string()
});

const typingSchema = z.object({
  channelId: z.string()
});

const canDeleteAsAdmin = async (messageChannelId: string, userId: string): Promise<boolean> => {
  const channel = await ChannelModel.findById(messageChannelId).select("serverId");
  if (!channel) {
    return false;
  }

  const server = await ServerModel.findById(channel.serverId).select("ownerId");
  if (!server) {
    return false;
  }

  return server.ownerId.toString() === userId;
};

export const handleSendMessage = async (
  io: Server,
  socket: NexusSocket,
  payload: unknown
): Promise<void> => {
  const userId = socket.data.user?.userId;
  if (!userId) {
    return;
  }

  const parsed = sendMessageSchema.parse(payload);

  const message = await MessageModel.create({
    channelId: parsed.channelId,
    authorId: userId,
    content: parsed.content,
    replyTo: parsed.replyTo,
    attachments: parsed.attachments,
    embeds: [],
    mentions: [],
    reactions: []
  });

  await message.populate("author", "username displayName avatar");

  io.to(channelRoom(parsed.channelId)).emit("new_message", message);
};

export const handleEditMessage = async (
  io: Server,
  socket: NexusSocket,
  payload: unknown
): Promise<void> => {
  const userId = socket.data.user?.userId;
  if (!userId) {
    return;
  }

  const parsed = editMessageSchema.parse(payload);

  const message = await MessageModel.findById(parsed.messageId);
  if (!message || message.authorId.toString() !== userId) {
    return;
  }

  message.content = parsed.content;
  message.edited = true;
  message.editedAt = new Date();
  await message.save();
  await message.populate("author", "username displayName avatar");

  io.to(channelRoom(message.channelId.toString())).emit("message_updated", message);
};

export const handleDeleteMessage = async (
  io: Server,
  socket: NexusSocket,
  payload: unknown
): Promise<void> => {
  const userId = socket.data.user?.userId;
  if (!userId) {
    return;
  }

  const parsed = deleteMessageSchema.parse(payload);

  const message = await MessageModel.findById(parsed.messageId);
  if (!message) {
    return;
  }

  const isOwner = message.authorId.toString() === userId;
  const isAdmin = await canDeleteAsAdmin(message.channelId.toString(), userId);

  if (!isOwner && !isAdmin) {
    return;
  }

  message.deleted = true;
  message.content = "";
  await message.save();

  io.to(channelRoom(message.channelId.toString())).emit("message_deleted", {
    messageId: message._id.toString(),
    channelId: message.channelId.toString()
  });
};

export const handleTypingStart = async (
  _io: Server,
  socket: NexusSocket,
  payload: unknown
): Promise<void> => {
  const user = socket.data.user;
  if (!user) {
    return;
  }

  const parsed = typingSchema.parse(payload);

  socket.to(channelRoom(parsed.channelId)).emit("typing", {
    userId: user.userId,
    channelId: parsed.channelId,
    username: user.username
  });
};

export const handleTypingStop = async (
  _io: Server,
  socket: NexusSocket,
  payload: unknown
): Promise<void> => {
  const user = socket.data.user;
  if (!user) {
    return;
  }

  const parsed = typingSchema.parse(payload);

  socket.to(channelRoom(parsed.channelId)).emit("stop_typing", {
    userId: user.userId,
    channelId: parsed.channelId
  });
};
