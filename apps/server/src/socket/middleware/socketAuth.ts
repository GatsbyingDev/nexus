import type { Socket } from "socket.io";
import { verifyAccessToken } from "../../utils/jwt";

export interface SocketUser {
  userId: string;
  username: string;
  email: string;
}

export type NexusSocket = Socket & {
  data: {
    user?: SocketUser;
    heartbeatInterval?: NodeJS.Timeout;
    voiceChannelId?: string;
  };
};

export const socketAuth = (socket: NexusSocket, next: (err?: Error) => void): void => {
  try {
    const token = socket.handshake.auth?.token as string | undefined;

    if (!token) {
      next(new Error("Unauthorized"));
      return;
    }

    const payload = verifyAccessToken(token);
    socket.data.user = {
      userId: payload.userId,
      username: payload.username,
      email: payload.email
    };

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};
