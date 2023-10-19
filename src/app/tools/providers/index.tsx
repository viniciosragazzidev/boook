"use client";
import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import AppContextProvider from "@/app/_context/AppContext";
const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>{children}</AppContextProvider>
    </QueryClientProvider>
  );
};

export default Providers;
