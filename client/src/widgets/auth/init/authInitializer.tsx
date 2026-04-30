"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/model/authStore";

export const AuthInitializer = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // НЕТ ПОВЕРКИ ЧТО УЖЕ ИНИЦИАЛИЗРОВАНО
    void initialize();
  }, [initialize]);

  return null;
};
