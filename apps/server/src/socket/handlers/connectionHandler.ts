import type { Server } from "socket.io";
import { setPresence } from "../../config/redis";
import { ChannelModel } from "../../models/Channel";
import { ServerMemberModel } from "../../models/ServerMember";
import { channelRoom, serverRoom } from "../../utils/room";
import { startHeartbeat, stopHeartbeat } from "./presenceHandler";
import { cleanupVoiceOnDisconnect } from "./voiceHandler";
import type { NexusSocket } from "../middleware/socketAuth";

const getServerIdsForUser = async (userId: string): Promise<string[]> => {
  const memberships = await ServerMemberModel.find({ userId }).select("serverId");
  return memberships.map((m) => m.serverId.toString());
};

const broadcastPresenceToSharedRooms = (io: Server, serverIds: string[], userId: string, status: string): void => {
  for (const serverId of serverIds) {
    io.to(serverRoom(serverId)).emit("user_presence", {
      userId,
      status
    });
  }
};

export const handleConnect = async (io: Server, socket: NexusSocket): Promise<void> => {
  const user = socket.data.user;
  if (!user) {
    return;
  }

  await setPresence(user.userId, "online", 300);
  startHeartbeat(socket);

  socket.join(`user:${user.userId}`);

  const serverIds = await getServerIdsForUser(user.userId);
  for (const serverId of serverIds) {
    socket.join(serverRoom(serverId));
  }

  if (serverIds.length > 0) {
    const channels = await ChannelModel.find({ serverId: { $in: serverIds } }).select("_id");
    for (const channel of channels) {
      socket.join(channelRoom(channel._id.toString()));
    }
  }

  broadcastPresenceToSharedRooms(io, serverIds, user.userId, "online");
};

export const handleDisconnect = async (io: Server, socket: NexusSocket): Promise<void> => {
  const user = socket.data.user;
  if (!user) {
    return;
  }

  stopHeartbeat(socket);
  await cleanupVoiceOnDisconnect(io, socket);

  await setPresence(user.userId, "offline", 300);

  const serverIds = await getServerIdsForUser(user.userId);
  broadcastPresenceToSharedRooms(io, serverIds, user.userId, "offline");
};
