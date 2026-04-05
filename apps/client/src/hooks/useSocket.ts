import { useEffect } from "react";
import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import type { IChannel, IMessage, IServer, IServerMember, PaginatedResponse } from "@nexus/shared/src/types";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import { useAuthStore } from "@/stores/authStore";

const updateMessageInPages = (
  oldData: InfiniteData<PaginatedResponse<IMessage>> | undefined,
  updater: (message: IMessage) => IMessage
): InfiniteData<PaginatedResponse<IMessage>> | undefined => {
  if (!oldData) {
    return oldData;
  }

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      data: page.data.map((message) => updater(message))
    }))
  };
};

export const useSocket = (): void => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

    connectSocket();
    const socket = getSocket();

    const onNewMessage = (message: IMessage): void => {
      queryClient.setQueryData<InfiniteData<PaginatedResponse<IMessage>>>(
        ["messages", message.channelId],
        (oldData) => {
          if (!oldData) {
            return {
              pages: [{ success: true, data: [message], hasMore: false }],
              pageParams: [undefined]
            };
          }

          const pages = [...oldData.pages];
          const lastIndex = pages.length - 1;
          pages[lastIndex] = {
            ...pages[lastIndex],
            data: [...pages[lastIndex].data, message]
          };

          return {
            ...oldData,
            pages
          };
        }
      );
    };

    const onMessageUpdated = (message: IMessage): void => {
      queryClient.setQueryData<InfiniteData<PaginatedResponse<IMessage>>>(
        ["messages", message.channelId],
        (oldData) => updateMessageInPages(oldData, (item) => (item._id === message._id ? message : item))
      );
    };

    const onMessageDeleted = (payload: { messageId: string; channelId: string }): void => {
      queryClient.setQueryData<InfiniteData<PaginatedResponse<IMessage>>>(
        ["messages", payload.channelId],
        (oldData) =>
          updateMessageInPages(oldData, (item) =>
            item._id === payload.messageId ? { ...item, deleted: true, content: "" } : item
          )
      );
    };

    const onUserPresence = (): void => {
      void queryClient.invalidateQueries({ queryKey: ["serverMembers"] });
    };

    const onChannelCreated = (channel: IChannel): void => {
      queryClient.setQueryData<IChannel[]>(["channels", channel.serverId], (old) => {
        const base = old ?? [];
        if (base.some((item) => item._id === channel._id)) {
          return base;
        }

        return [...base, channel].sort((a, b) => a.position - b.position);
      });
    };

    const onChannelDeleted = (payload: { channelId: string }): void => {
      queryClient.setQueriesData({ queryKey: ["channels"] }, (oldData: unknown) => {
        if (!Array.isArray(oldData)) {
          return oldData;
        }

        return (oldData as IChannel[]).filter((channel) => channel._id !== payload.channelId);
      });
    };

    const onMemberJoined = (payload: { serverId: string; member: IServerMember }): void => {
      queryClient.setQueryData<IServerMember[]>(["serverMembers", payload.serverId], (old) => {
        const base = old ?? [];
        if (base.some((member) => member._id === payload.member._id)) {
          return base;
        }

        return [...base, payload.member];
      });
    };

    const onMemberLeft = (payload: { serverId: string; userId: string }): void => {
      queryClient.setQueryData<IServerMember[]>(["serverMembers", payload.serverId], (old) => {
        const base = old ?? [];
        return base.filter((member) => member.userId !== payload.userId);
      });
    };

    const onServerUpdated = (server: IServer): void => {
      queryClient.setQueryData<IServer>(["server", server._id], server);
      queryClient.setQueryData<IServer[]>(["servers"], (old) => {
        const base = old ?? [];
        const idx = base.findIndex((s) => s._id === server._id);
        if (idx === -1) {
          return [...base, server];
        }

        const next = [...base];
        next[idx] = server;
        return next;
      });
    };

    socket.on("new_message", onNewMessage);
    socket.on("message_updated", onMessageUpdated);
    socket.on("message_deleted", onMessageDeleted);
    socket.on("user_presence", onUserPresence);
    socket.on("channel_created", onChannelCreated);
    socket.on("channel_deleted", onChannelDeleted);
    socket.on("member_joined", onMemberJoined);
    socket.on("member_left", onMemberLeft);
    socket.on("server_updated", onServerUpdated);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("message_updated", onMessageUpdated);
      socket.off("message_deleted", onMessageDeleted);
      socket.off("user_presence", onUserPresence);
      socket.off("channel_created", onChannelCreated);
      socket.off("channel_deleted", onChannelDeleted);
      socket.off("member_joined", onMemberJoined);
      socket.off("member_left", onMemberLeft);
      socket.off("server_updated", onServerUpdated);
      disconnectSocket();
    };
  }, [token, queryClient]);
};
