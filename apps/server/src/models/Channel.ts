import { Document, Schema, Types, model } from "mongoose";

export interface IChannel extends Document {
  serverId: Types.ObjectId;
  name: string;
  topic?: string;
  type: "TEXT" | "VOICE" | "ANNOUNCEMENT";
  position: number;
  categoryName?: string;
  isPrivate: boolean;
  slowMode: number;
  createdAt: Date;
}

const channelSchema = new Schema<IChannel>(
  {
    serverId: {
      type: Schema.Types.ObjectId,
      ref: "Server",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    topic: {
      type: String,
      default: null,
      maxlength: 1024
    },
    type: {
      type: String,
      enum: ["TEXT", "VOICE", "ANNOUNCEMENT"],
      default: "TEXT",
      required: true
    },
    position: {
      type: Number,
      required: true,
      default: 0
    },
    categoryName: {
      type: String,
      default: null,
      maxlength: 64
    },
    isPrivate: {
      type: Boolean,
      default: false,
      required: true
    },
    slowMode: {
      type: Number,
      default: 0,
      min: 0,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  {
    versionKey: false
  }
);

channelSchema.index({ serverId: 1, position: 1 });
channelSchema.index({ serverId: 1, categoryName: 1, position: 1 });

export const ChannelModel = model<IChannel>("Channel", channelSchema);
