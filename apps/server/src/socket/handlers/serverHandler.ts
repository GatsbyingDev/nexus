import type { Server } from "socket.io";
import { ChannelModel } from "../../models/Channel";
import { channelRoom, serverRoom } from "../../utils/room";
import type { NexusSocket } from "../middleware/socketAuth";

export const handleJoinServer = async (
  _io: Server,
  socket: NexusSocket,
  serverId: string
): Promise<void> => {
  socket.join(serverRoom(serverId));

  const channels = await ChannelModel.find({ serverId }).select("_id");
  for (const channel of channels) {
    socket.join(channelRoom(channel._id.toString()));
  }
};

export const handleLeaveServer = async (
  _io: Server,
  socket: NexusSocket,
  serverId: string
): Promise<void> => {
  socket.leave(serverRoom(serverId));

  const channels = await ChannelModel.find({ serverId }).select("_id");
  for (const channel of channels) {
    socket.leave(channelRoom(channel._id.toString()));
  }
};
