import bcrypt from "bcryptjs";
import { Document, Schema, Types, model } from "mongoose";

export type FriendStatus = "pending" | "accepted" | "blocked";

export interface IFriend {
  userId: Types.ObjectId;
  status: FriendStatus;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  displayName: string;
  avatar?: string;
  banner?: string;
  status: "online" | "idle" | "dnd" | "invisible";
  customStatus?: string;
  friends: IFriend[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const friendSchema = new Schema<IFriend>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "pending",
      required: true
    }
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 32
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    avatar: {
      type: String,
      default: null
    },
    banner: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ["online", "idle", "dnd", "invisible"],
      default: "online",
      required: true
    },
    customStatus: {
      type: String,
      default: null,
      maxlength: 120
    },
    friends: {
      type: [friendSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const UserModel = model<IUser>("User", userSchema);
