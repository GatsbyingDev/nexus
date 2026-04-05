import { useInfiniteQuery } from "@tanstack/react-query";
import type { IMessage, PaginatedResponse } from "@nexus/shared/src/types";
import { api } from "@/lib/axios";

export const useMessages = (channelId?: string) => {
  return useInfiniteQuery({
    queryKey: ["messages", channelId],
    enabled: Boolean(channelId),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await api.get<PaginatedResponse<IMessage>>(`/channels/${channelId}/messages`, {
        params: {
          before: pageParam,
          limit: 50
        }
      });

      return response.data;
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined)
  });
};
