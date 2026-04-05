import { nanoid } from "nanoid";
import { Document, Schema, Types, model } from "mongoose";

export interface IServer extends Document {
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  ownerId: Types.ObjectId;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const serverSchema = new Schema<IServer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    description: {
      type: String,
      default: null,
      maxlength: 512
    },
    icon: {
      type: String,
      default: null
    },
    banner: {
      type: String,
      default: null
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    inviteCode: {
      type: String,
      unique: true,
      index: true,
      required: true
    }
  },
  {
    timestamps: true
  }
);

serverSchema.index({ inviteCode: 1 }, { unique: true });
serverSchema.index({ ownerId: 1 });

serverSchema.pre("validate", function setInviteCode(next) {
  if (!this.inviteCode) {
    this.inviteCode = nanoid(8);
  }
  next();
});

export const ServerModel = model<IServer>("Server", serverSchema);
