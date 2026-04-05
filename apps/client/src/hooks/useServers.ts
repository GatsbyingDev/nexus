import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, IServer } from "@nexus/shared/src/types";
import { api } from "@/lib/axios";

export const useServers = () => {
  return useQuery({
    queryKey: ["servers"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<IServer[]>>("/servers");
      return response.data.data ?? [];
    }
  });
};
