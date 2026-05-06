"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuthStore } from "@/features/auth/model/authStore";

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);
  const getActiveSession = useAuthStore((state) => state.getActiveSession);

  const activeSession = getActiveSession();

  useEffect(() => {
    if (!isInitialized || isLoading || activeSession) {
      return;
    }

    const queryString = searchParams.toString();
    const callbackUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }, [isInitialized, isLoading, activeSession, router, pathname, searchParams]);

  // TODO переделать на скелетон лоадеры
  if (!isInitialized) {
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

  if (!activeSession) {
    return null;
  }

  return children;
};
