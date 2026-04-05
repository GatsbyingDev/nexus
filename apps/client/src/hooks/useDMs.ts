import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, IDirectMessage } from "@nexus/shared/src/types";
import { api } from "@/lib/axios";

export const useDMs = () => {
  return useQuery({
    queryKey: ["dms"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<IDirectMessage[]>>("/dm");
      return response.data.data ?? [];
    }
  });
};
