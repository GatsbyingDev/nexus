import type { Server } from "socket.io";
import { redis } from "../../config/redis";
import { channelRoom } from "../../utils/room";
import type { NexusSocket } from "../middleware/socketAuth";

const voiceUserKey = (channelId: string, userId: string): string => `voice:${channelId}:${userId}`;

const activeVoiceChannelBySocket = new Map<string, string>();

export const handleVoiceJoin = async (
  io: Server,
  socket: NexusSocket,
  payload: { channelId: string }
): Promise<void> => {
  const userId = socket.data.user?.userId;
  if (!userId) {
    return;
  }

  const { channelId } = payload;

  if (socket.data.voiceChannelId && socket.data.voiceChannelId !== channelId) {
    await handleVoiceLeave(io, socket, { channelId: socket.data.voiceChannelId });
  }

  const participantKeys = (await redis.keys(`voice:${channelId}:*`)) as string[];
  const participants = participantKeys
    .map((key) => key.split(":").at(-1))
    .filter((id): id is string => Boolean(id));

  await redis.set(voiceUserKey(channelId, userId), "1", { ex: 3600 });

  socket.data.voiceChannelId = channelId;
  activeVoiceChannelBySocket.set(socket.id, channelId);
  socket.join(channelRoom(channelId));

  socket.emit("voice_participants", {
    channelId,
    participants
  });

  socket.to(channelRoom(channelId)).emit("voice_user_joined", {
    userId,
    channelId
  });
};

export const handleVoiceLeave = async (
  _io: Server,
  socket: NexusSocket,
  payload?: { channelId?: string }
): Promise<void> => {
  const userId = socket.data.user?.userId;
  if (!userId) {
    return;
  }

  const channelId = payload?.channelId ?? socket.data.voiceChannelId ?? activeVoiceChannelBySocket.get(socket.id);
  if (!channelId) {
    return;
  }

  await redis.del(voiceUserKey(channelId, userId));

  socket.data.voiceChannelId = undefined;
  activeVoiceChannelBySocket.delete(socket.id);
  socket.leave(channelRoom(channelId));

  socket.to(channelRoom(channelId)).emit("voice_user_left", {
    userId,
    channelId
  });
};

export const handleVoiceSignal = async (
  io: Server,
  socket: NexusSocket,
  payload: { to: string; signal: Record<string, unknown> }
): Promise<void> => {
  const from = socket.data.user?.userId;
  if (!from) {
    return;
  }

  io.to(`user:${payload.to}`).emit("voice_signal", {
    from,
    signal: payload.signal
  });
};

export const handleVoiceICE = async (
  io: Server,
  socket: NexusSocket,
  payload: { to: string; candidate: Record<string, unknown> }
): Promise<void> => {
  const from = socket.data.user?.userId;
  if (!from) {
    return;
  }

  io.to(`user:${payload.to}`).emit("voice_ice", {
    from,
    candidate: payload.candidate
  });
};

export const cleanupVoiceOnDisconnect = async (io: Server, socket: NexusSocket): Promise<void> => {
  await handleVoiceLeave(io, socket, { channelId: socket.data.voiceChannelId });
};
