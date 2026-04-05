import { Document, Schema, Types, model } from "mongoose";
import type { IMessageAttachment, IMessageReaction } from "./Message";

export interface IDirectMessageContent extends Document {
  dmId: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  attachments: IMessageAttachment[];
  replyTo?: Types.ObjectId;
  reactions: IMessageReaction[];
  edited: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema<IMessageAttachment>(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true }
  },
  { _id: false }
);

const reactionSchema = new Schema<IMessageReaction>(
  {
    emoji: { type: String, required: true },
    userIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: []
    }
  },
  { _id: false }
);

const dmContentSchema = new Schema<IDirectMessageContent>(
  {
    dmId: {
      type: Schema.Types.ObjectId,
      ref: "DirectMessage",
      required: true,
      index: true
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    content: {
      type: String,
      default: "",
      maxlength: 4000
    },
    attachments: {
      type: [attachmentSchema],
      default: []
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "DirectMessageContent",
      default: null
    },
    reactions: {
      type: [reactionSchema],
      default: []
    },
    edited: {
      type: Boolean,
      default: false,
      required: true
    },
    deleted: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  {
    timestamps: true
  }
);

dmContentSchema.index({ dmId: 1, createdAt: -1 });

dmContentSchema.virtual("author", {
  ref: "User",
  localField: "authorId",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "username displayName avatar"
  }
});

export const DirectMessageContentModel = model<IDirectMessageContent>("DirectMessageContent", dmContentSchema);
