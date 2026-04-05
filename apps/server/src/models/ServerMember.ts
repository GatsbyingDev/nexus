import { Document, Schema, Types, model } from "mongoose";

export interface IServerMember extends Document {
  serverId: Types.ObjectId;
  userId: Types.ObjectId;
  roles: Types.ObjectId[];
  nickname?: string;
  joinedAt: Date;
}

const serverMemberSchema = new Schema<IServerMember>(
  {
    serverId: {
      type: Schema.Types.ObjectId,
      ref: "Server",
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    roles: {
      type: [{ type: Schema.Types.ObjectId, ref: "Role" }],
      default: []
    },
    nickname: {
      type: String,
      default: null,
      maxlength: 100
    },
    joinedAt: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  {
    versionKey: false
  }
);

serverMemberSchema.index({ serverId: 1, userId: 1 }, { unique: true });
serverMemberSchema.index({ serverId: 1, joinedAt: -1 });

export const ServerMemberModel = model<IServerMember>("ServerMember", serverMemberSchema);
