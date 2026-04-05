import { refreshPresence } from "../../config/redis";
import type { NexusSocket } from "../middleware/socketAuth";

export const startHeartbeat = (socket: NexusSocket): void => {
  const userId = socket.data.user?.userId;
  if (!userId) {
    return;
  }

  if (socket.data.heartbeatInterval) {
    clearInterval(socket.data.heartbeatInterval);
  }

  socket.data.heartbeatInterval = setInterval(() => {
    void refreshPresence(userId);
  }, 60_000);
};

export const stopHeartbeat = (socket: NexusSocket): void => {
  if (!socket.data.heartbeatInterval) {
    return;
  }

  clearInterval(socket.data.heartbeatInterval);
  socket.data.heartbeatInterval = undefined;
};
