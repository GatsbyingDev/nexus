import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, IServer } from "@nexus/shared/src/types";
import { api } from "@/lib/axios";

export const useServer = (serverId?: string) => {
  return useQuery({
    queryKey: ["server", serverId],
    enabled: Boolean(serverId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<IServer>>(`/servers/${serverId}`);
      return response.data.data ?? null;
    }
  });
};
