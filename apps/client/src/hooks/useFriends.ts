import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, IFriend } from "@nexus/shared/src/types";
import { api } from "@/lib/axios";

export const useFriends = () => {
  return useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<IFriend[]>>("/users/me/friends");
      return response.data.data ?? [];
    }
  });
};
