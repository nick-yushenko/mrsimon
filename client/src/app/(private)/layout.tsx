import { AppShell } from "@/widgets/appShell";
import { ProtectedRoute } from "@/widgets/auth/guards/protectedRoute";

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
