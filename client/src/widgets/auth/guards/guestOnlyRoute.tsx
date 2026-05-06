"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuthStore } from "@/features/auth/model/authStore";

type GuestOnlyRouteProps = {
  children: ReactNode;
  fallbackUrl?: string;
};

export const GuestOnlyRoute = ({ children, fallbackUrl = "/profile" }: GuestOnlyRouteProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);
  const getActiveSession = useAuthStore((state) => state.getActiveSession);

  const activeSession = getActiveSession();

  const callbackUrl = searchParams.get("callbackUrl");

  useEffect(() => {
    if (!isInitialized || isLoading || !activeSession) {
      return;
    }
    // Защита от передачи опасного сайта в урле
    router.replace(callbackUrl?.startsWith("/") ? callbackUrl : fallbackUrl);
  }, [isInitialized, isLoading, activeSession, searchParams, router, callbackUrl, fallbackUrl]);

  if (!isInitialized || isLoading) {
    return (
      <Backdrop
        sx={(theme) => ({
          background: "var(--background)",
          color: "var(--primary)",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (activeSession) {
    return null;
  }

  return <>{children}</>;
};
