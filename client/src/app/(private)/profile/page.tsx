"use client";

import { useAuthStore } from "@/features/auth/model/authStore";
import { Header } from "@/widgets/header";
import Box from "@mui/material/Box";

export default function LoginPage() {
  const user = useAuthStore((state) => state.getCurrentUser());

  const logout = useAuthStore((state) => state.logoutCurrent);

  return (
    <>
      <Header />
      <Box>hello world</Box>
    </>
  );
}
