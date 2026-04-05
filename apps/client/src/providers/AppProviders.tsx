import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/queryClient";

export const AppProviders = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <Toaster position="top-right" />
  </QueryClientProvider>
);
