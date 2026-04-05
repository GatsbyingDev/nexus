import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/authStore";

let socket: Socket | null = null;

const createSocket = (): Socket => {
  return io(import.meta.env.VITE_SOCKET_URL as string, {
    autoConnect: false,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 10_000,
    randomizationFactor: 0.5
  });
};

export const getSocket = (): Socket => {
  if (!socket) {
    socket = createSocket();
  }

  return socket;
};

export const connectSocket = (): void => {
  const token = useAuthStore.getState().token;
  if (!token) {
    return;
  }

  const client = getSocket();
  client.auth = { token };

  if (!client.connected) {
    client.connect();
  }
};

export const disconnectSocket = (): void => {
  if (!socket) {
    return;
  }

  if (socket.connected) {
    socket.disconnect();
  }
};
