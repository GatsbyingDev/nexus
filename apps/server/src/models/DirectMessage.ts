import { Document, Schema, Types, model } from "mongoose";

export interface IDirectMessage extends Document {
  participants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const directMessageSchema = new Schema<IDirectMessage>(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
      validate: {
        validator: (participants: Types.ObjectId[]) => participants.length === 2,
        message: "DirectMessage must have exactly two participants"
      },
      required: true
    }
  },
  {
    timestamps: true
  }
);

directMessageSchema.index({ participants: 1 });
directMessageSchema.index({ participants: 1, updatedAt: -1 });

export const DirectMessageModel = model<IDirectMessage>("DirectMessage", directMessageSchema);
