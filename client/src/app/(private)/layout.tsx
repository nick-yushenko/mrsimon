"use client";
// Нужен ли здесь use client??
import { AppShell } from "@/widgets/appShell";
import { ProtectedRoute } from "@/widgets/auth/guards/protectedRoute";
import { Header } from "@/widgets/header";

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
