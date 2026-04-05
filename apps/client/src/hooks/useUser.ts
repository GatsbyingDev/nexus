import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, IUser } from "@nexus/shared/src/types";
import { api } from "@/lib/axios";

export const useUser = (userId?: string) => {
  return useQuery({
    queryKey: ["user", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<IUser>>(`/users/${userId}`);
      return response.data.data ?? null;
    }
  });
};
