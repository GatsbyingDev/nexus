import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, IChannel } from "@nexus/shared/src/types";
import { api } from "@/lib/axios";

export const useChannels = (serverId?: string) => {
  return useQuery({
    queryKey: ["channels", serverId],
    enabled: Boolean(serverId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<IChannel[]>>(`/servers/${serverId}/channels`);
      return response.data.data ?? [];
    }
  });
};
