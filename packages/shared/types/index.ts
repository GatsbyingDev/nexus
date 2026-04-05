export type ID = string;

export type PresenceStatus = "online" | "idle" | "dnd" | "invisible" | "offline";
export type FriendStatus = "pending" | "accepted" | "blocked";
export type ChannelType = "TEXT" | "VOICE" | "ANNOUNCEMENT";
export type RTCSignal = Record<string, unknown>;
export type RTCIce = Record<string, unknown>;

export interface FriendRelation {
  userId: ID;
  status: FriendStatus;
}

export interface User {
  _id: ID;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  banner?: string;
  status: PresenceStatus;
  customStatus?: string;
  friends: FriendRelation[];
  createdAt: string;
  updatedAt: string;
}

export interface Server {
  _id: ID;
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  ownerId: ID;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  _id: ID;
  serverId: ID;
  name: string;
  color: string;
  position: number;
  permissions: string[];
}

export interface ServerMember {
  _id: ID;
  serverId: ID;
  userId: ID;
  roles: ID[];
  nickname?: string;
  joinedAt: string;
}

export interface Channel {
  _id: ID;
  serverId: ID;
  name: string;
  topic?: string;
  type: ChannelType;
  position: number;
  categoryName?: string;
  isPrivate: boolean;
  slowMode: number;
  createdAt: string;
}

export interface MessageAttachment {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface MessageEmbed {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface Reaction {
  emoji: string;
  userIds: ID[];
}

export interface PopulatedAuthor {
  _id: ID;
  username: string;
  displayName: string;
  avatar?: string;
}

export interface Message {
  _id: ID;
  channelId: ID;
  authorId: ID;
  author?: PopulatedAuthor;
  content: string;
  attachments: MessageAttachment[];
  embeds: MessageEmbed[];
  mentions: ID[];
  replyTo?: ID;
  reactions: Reaction[];
  edited: boolean;
  editedAt?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DirectMessage {
  _id: ID;
  participants: ID[];
  createdAt: string;
  updatedAt: string;
}

export interface DirectMessageContent {
  _id: ID;
  dmId: ID;
  authorId: ID;
  content: string;
  attachments: MessageAttachment[];
  replyTo?: ID;
  reactions: Reaction[];
  edited: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  accessToken: string;
  user: User;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
}

export interface ClientToServerEvents {
  join_server: (serverId: ID) => void;
  leave_server: (serverId: ID) => void;
  join_channel: (channelId: ID) => void;
  leave_channel: (channelId: ID) => void;
  send_message: (payload: { channelId: ID; content: string; replyTo?: ID; attachments?: MessageAttachment[] }) => void;
  edit_message: (payload: { messageId: ID; content: string }) => void;
  delete_message: (payload: { messageId: ID }) => void;
  typing_start: (payload: { channelId: ID }) => void;
  typing_stop: (payload: { channelId: ID }) => void;
  join_dm: (dmId: ID) => void;
  send_dm: (payload: { dmId: ID; content: string }) => void;
  voice_join: (payload: { channelId: ID }) => void;
  voice_leave: (payload: { channelId: ID }) => void;
  voice_signal: (payload: { to: ID; signal: RTCSignal }) => void;
  voice_ice: (payload: { to: ID; candidate: RTCIce }) => void;
}

export interface ServerToClientEvents {
  new_message: (message: Message) => void;
  message_updated: (message: Message) => void;
  message_deleted: (payload: { messageId: ID; channelId: ID }) => void;
  typing: (payload: { userId: ID; channelId: ID; username: string }) => void;
  stop_typing: (payload: { userId: ID; channelId: ID }) => void;
  user_presence: (payload: { userId: ID; status: PresenceStatus }) => void;
  new_dm: (message: DirectMessageContent) => void;
  voice_user_joined: (payload: { userId: ID; channelId: ID }) => void;
  voice_user_left: (payload: { userId: ID; channelId: ID }) => void;
  voice_signal: (payload: { from: ID; signal: RTCSignal }) => void;
  voice_ice: (payload: { from: ID; candidate: RTCIce }) => void;
  server_updated: (server: Server) => void;
  channel_created: (channel: Channel) => void;
  channel_deleted: (payload: { channelId: ID }) => void;
  member_joined: (payload: { serverId: ID; member: ServerMember }) => void;
  member_left: (payload: { serverId: ID; userId: ID }) => void;
}
