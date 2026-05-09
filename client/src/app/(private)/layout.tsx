import { Suspense } from "react";

import { AppShell } from "@/widgets/appShell";
import { ProtectedRoute } from "@/widgets/auth/guards/protectedRoute";

import { ReactQueryProvider } from "./providers/reactQueryProvider";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={null}>
      <ReactQueryProvider>
        <ProtectedRoute>
          <AppShell>{children}</AppShell>
        </ProtectedRoute>
      </ReactQueryProvider>
    </Suspense>
  );
}
