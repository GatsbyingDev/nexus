import { Document, Schema, Types, model } from "mongoose";

export interface IMessageAttachment {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface IMessageEmbed {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface IMessageReaction {
  emoji: string;
  userIds: Types.ObjectId[];
}

export interface IMessage extends Document {
  channelId: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  attachments: IMessageAttachment[];
  embeds: IMessageEmbed[];
  mentions: Types.ObjectId[];
  replyTo?: Types.ObjectId;
  reactions: IMessageReaction[];
  edited: boolean;
  editedAt?: Date;
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

const embedSchema = new Schema<IMessageEmbed>(
  {
    url: { type: String },
    title: { type: String },
    description: { type: String },
    image: { type: String }
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

const messageSchema = new Schema<IMessage>(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
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
    embeds: {
      type: [embedSchema],
      default: []
    },
    mentions: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: []
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
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
    editedAt: {
      type: Date,
      default: null
    },
    deleted: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

messageSchema.index({ channelId: 1, createdAt: -1 });

messageSchema.virtual("author", {
  ref: "User",
  localField: "authorId",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "username displayName avatar"
  }
});

export const MessageModel = model<IMessage>("Message", messageSchema);
