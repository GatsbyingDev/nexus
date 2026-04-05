export enum UserStatus {
  ONLINE = "online",
  IDLE = "idle",
  DND = "dnd",
  INVISIBLE = "invisible",
  OFFLINE = "offline"
}

export enum ChannelType {
  TEXT = "TEXT",
  VOICE = "VOICE",
  ANNOUNCEMENT = "ANNOUNCEMENT"
}

export interface IFriend {
  userId: string;
  status: "pending" | "accepted" | "blocked";
}

export interface IAttachment {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface IEmbed {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface IReaction {
  emoji: string;
  userIds: string[];
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  banner?: string;
  status: Exclude<UserStatus, UserStatus.OFFLINE>;
  customStatus?: string;
  friends: IFriend[];
  createdAt: string;
  updatedAt: string;
}

export interface IServer {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  ownerId: string;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRole {
  _id: string;
  serverId: string;
  name: string;
  color: string;
  position: number;
  permissions: string[];
}

export interface IServerMember {
  _id: string;
  serverId: string;
  userId: string;
  roles: string[];
  nickname?: string;
  joinedAt: string;
}

export interface IChannel {
  _id: string;
  serverId: string;
  name: string;
  topic?: string;
  type: ChannelType;
  position: number;
  categoryName?: string;
  isPrivate: boolean;
  slowMode: number;
  createdAt: string;
}

export interface IMessage {
  _id: string;
  channelId: string;
  authorId: string;
  content: string;
  attachments: IAttachment[];
  embeds: IEmbed[];
  mentions: string[];
  replyTo?: string;
  reactions: IReaction[];
  edited: boolean;
  editedAt?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDirectMessage {
  _id: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IDirectMessageContent {
  _id: string;
  dmId: string;
  authorId: string;
  content: string;
  attachments: IAttachment[];
  replyTo?: string;
  reactions: IReaction[];
  edited: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface SocketEvents {
  clientToServer: {
    join_server: (serverId: string) => void;
    leave_server: (serverId: string) => void;
    join_channel: (channelId: string) => void;
    leave_channel: (channelId: string) => void;
    send_message: (payload: {
      channelId: string;
      content: string;
      replyTo?: string;
      attachments?: IAttachment[];
    }) => void;
    edit_message: (payload: { messageId: string; content: string }) => void;
    delete_message: (payload: { messageId: string }) => void;
    typing_start: (payload: { channelId: string }) => void;
    typing_stop: (payload: { channelId: string }) => void;
    join_dm: (dmId: string) => void;
    send_dm: (payload: { dmId: string; content: string }) => void;
    voice_join: (payload: { channelId: string }) => void;
    voice_leave: (payload: { channelId: string }) => void;
    voice_signal: (payload: { to: string; signal: Record<string, unknown> }) => void;
    voice_ice: (payload: { to: string; candidate: Record<string, unknown> }) => void;
  };
  serverToClient: {
    new_message: (message: IMessage) => void;
    message_updated: (message: IMessage) => void;
    message_deleted: (payload: { messageId: string; channelId: string }) => void;
    typing: (payload: { userId: string; channelId: string; username: string }) => void;
    stop_typing: (payload: { userId: string; channelId: string }) => void;
    user_presence: (payload: { userId: string; status: UserStatus }) => void;
    new_dm: (message: IDirectMessageContent) => void;
    voice_user_joined: (payload: { userId: string; channelId: string }) => void;
    voice_user_left: (payload: { userId: string; channelId: string }) => void;
    voice_signal: (payload: { from: string; signal: Record<string, unknown> }) => void;
    voice_ice: (payload: { from: string; candidate: Record<string, unknown> }) => void;
    server_updated: (server: IServer) => void;
    channel_created: (channel: IChannel) => void;
    channel_deleted: (payload: { channelId: string }) => void;
    member_joined: (payload: { serverId: string; member: IServerMember }) => void;
    member_left: (payload: { serverId: string; userId: string }) => void;
  };
}
