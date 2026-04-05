import { Document, Schema, Types, model } from "mongoose";

export interface IRole extends Document {
  serverId: Types.ObjectId;
  name: string;
  color: string;
  position: number;
  permissions: string[];
}

const roleSchema = new Schema<IRole>(
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
      maxlength: 64
    },
    color: {
      type: String,
      required: true,
      default: "#99aab5",
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    },
    position: {
      type: Number,
      required: true,
      default: 0
    },
    permissions: {
      type: [String],
      default: []
    }
  },
  {
    versionKey: false
  }
);

roleSchema.index({ serverId: 1, position: -1 });
roleSchema.index({ serverId: 1, name: 1 }, { unique: true });

export const RoleModel = model<IRole>("Role", roleSchema);
