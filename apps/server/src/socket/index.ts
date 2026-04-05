import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "../config/env";
import {
  handleDeleteMessage,
  handleEditMessage,
  handleSendMessage,
  handleTypingStart,
  handleTypingStop
} from "./handlers/messageHandler";
import { handleJoinDM, handleSendDM } from "./handlers/dmHandler";
import { handleJoinServer, handleLeaveServer } from "./handlers/serverHandler";
import { handleConnect, handleDisconnect } from "./handlers/connectionHandler";
import { handleVoiceICE, handleVoiceJoin, handleVoiceLeave, handleVoiceSignal } from "./handlers/voiceHandler";
import { socketAuth, type NexusSocket } from "./middleware/socketAuth";

export let io: Server;

const safelyRun = (fn: () => Promise<void>): void => {
  void fn().catch(() => {
    // swallow handler errors to keep socket alive
  });
};

const registerAllHandlers = (instance: Server, socket: NexusSocket): void => {
  socket.on("join_server", (serverId: string) => {
    safelyRun(async () => handleJoinServer(instance, socket, serverId));
  });

  socket.on("leave_server", (serverId: string) => {
    safelyRun(async () => handleLeaveServer(instance, socket, serverId));
  });

  socket.on("join_channel", (channelId: string) => {
    socket.join(`channel:${channelId}`);
  });

  socket.on("leave_channel", (channelId: string) => {
    socket.leave(`channel:${channelId}`);
  });

  socket.on("send_message", (payload: unknown) => {
    safelyRun(async () => handleSendMessage(instance, socket, payload));
  });

  socket.on("edit_message", (payload: unknown) => {
    safelyRun(async () => handleEditMessage(instance, socket, payload));
  });

  socket.on("delete_message", (payload: unknown) => {
    safelyRun(async () => handleDeleteMessage(instance, socket, payload));
  });

  socket.on("typing_start", (payload: unknown) => {
    safelyRun(async () => handleTypingStart(instance, socket, payload));
  });

  socket.on("typing_stop", (payload: unknown) => {
    safelyRun(async () => handleTypingStop(instance, socket, payload));
  });

  socket.on("join_dm", (payload: unknown) => {
    safelyRun(async () => handleJoinDM(instance, socket, payload));
  });

  socket.on("send_dm", (payload: unknown) => {
    safelyRun(async () => handleSendDM(instance, socket, payload));
  });

  socket.on("voice_join", (payload: { channelId: string }) => {
    safelyRun(async () => handleVoiceJoin(instance, socket, payload));
  });

  socket.on("voice_leave", (payload?: { channelId?: string }) => {
    safelyRun(async () => handleVoiceLeave(instance, socket, payload));
  });

  socket.on("voice_signal", (payload: { to: string; signal: Record<string, unknown> }) => {
    safelyRun(async () => handleVoiceSignal(instance, socket, payload));
  });

  socket.on("voice_ice", (payload: { to: string; candidate: Record<string, unknown> }) => {
    safelyRun(async () => handleVoiceICE(instance, socket, payload));
  });
};

export const createSocketServer = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true
    }
  });

  io.use((socket, next) => {
    socketAuth(socket as NexusSocket, next);
  });

  io.on("connection", (socket) => {
    const nexusSocket = socket as NexusSocket;

    registerAllHandlers(io, nexusSocket);
    safelyRun(async () => handleConnect(io, nexusSocket));

    nexusSocket.on("disconnect", () => {
      safelyRun(async () => handleDisconnect(io, nexusSocket));
    });
  });

  return io;
};
