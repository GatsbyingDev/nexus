import type { Server } from "socket.io";
import { z } from "zod";
import { DirectMessageContentModel } from "../../models/DirectMessageContent";
import { DirectMessageModel } from "../../models/DirectMessage";
import type { NexusSocket } from "../middleware/socketAuth";

const joinDmSchema = z.string();

const sendDmSchema = z.object({
  dmId: z.string(),
  content: z.string().min(1).max(2000)
});

export const handleJoinDM = async (
  _io: Server,
  socket: NexusSocket,
  dmIdPayload: unknown
): Promise<void> => {
  const dmId = joinDmSchema.parse(dmIdPayload);
  socket.join(`dm:${dmId}`);
};

export const handleSendDM = async (
  io: Server,
  socket: NexusSocket,
  payload: unknown
): Promise<void> => {
  const userId = socket.data.user?.userId;
  if (!userId) {
    return;
  }

  const parsed = sendDmSchema.parse(payload);

  const dm = await DirectMessageModel.findById(parsed.dmId);
  if (!dm) {
    return;
  }

  if (!dm.participants.some((participant) => participant.toString() === userId)) {
    return;
  }

  const message = await DirectMessageContentModel.create({
    dmId: parsed.dmId,
    authorId: userId,
    content: parsed.content,
    attachments: [],
    reactions: []
  });

  await message.populate("author", "username displayName avatar");

  io.to(`dm:${parsed.dmId}`).emit("new_dm", message);
};
