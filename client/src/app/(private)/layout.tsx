import { AppShell } from "@/widgets/appShell";
import { ProtectedRoute } from "@/widgets/auth/guards/protectedRoute";
import Box from "@mui/material/Box";
import { Suspense } from "react";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
