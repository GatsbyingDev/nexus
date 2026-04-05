import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, IServerMember } from "@nexus/shared/src/types";
import { api } from "@/lib/axios";

export const useServerMembers = (serverId?: string) => {
  return useQuery({
    queryKey: ["serverMembers", serverId],
    enabled: Boolean(serverId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<IServerMember[]>>(`/servers/${serverId}/members`);
      return response.data.data ?? [];
    }
  });
};
