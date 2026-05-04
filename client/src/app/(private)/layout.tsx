import { AppShell } from "@/widgets/appShell";
import { ProtectedRoute } from "@/widgets/auth/guards/protectedRoute";
import { Suspense } from "react";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={null}>
      <ProtectedRoute>
        <AppShell>{children}</AppShell>
      </ProtectedRoute>
    </Suspense>
  );
}
