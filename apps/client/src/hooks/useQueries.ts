import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { Channel, DirectMessage, Message, PaginatedResponse, Server, ServerMember, User } from "@nexus/shared/types";
import { api } from "@/lib/axios";

export const useMessages = (channelId?: string) =>
  useInfiniteQuery({
    queryKey: ["messages", channelId],
    initialPageParam: undefined as string | undefined,
    enabled: Boolean(channelId),
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<PaginatedResponse<Message>>(`/channels/${channelId}/messages`, {
        params: { before: pageParam, limit: 50 }
      });
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
  });

export const useServerMembers = (serverId?: string) =>
  useQuery({
    queryKey: ["serverMembers", serverId],
    enabled: Boolean(serverId),
    queryFn: async () => (await api.get<ServerMember[]>(`/servers/${serverId}/members`)).data
  });

export const useServers = () =>
  useQuery({
    queryKey: ["servers"],
    queryFn: async () => (await api.get<Server[]>("/servers")).data,
    retry: false
  });

export const useServer = (serverId?: string) =>
  useQuery({
    queryKey: ["server", serverId],
    enabled: Boolean(serverId),
    queryFn: async () => (await api.get<Server>(`/servers/${serverId}`)).data
  });

export const useChannels = (serverId?: string) =>
  useQuery({
    queryKey: ["channels", serverId],
    enabled: Boolean(serverId),
    queryFn: async () => (await api.get<Channel[]>(`/servers/${serverId}/channels`)).data
  });

export const useDMs = () =>
  useQuery({
    queryKey: ["dms"],
    queryFn: async () => (await api.get<DirectMessage[]>("/dm")).data
  });

export const useUser = (userId?: string) =>
  useQuery({
    queryKey: ["user", userId],
    enabled: Boolean(userId),
    queryFn: async () => (await api.get<User>(`/users/${userId}`)).data
  });
