"use client";

import { styled, ThemeProvider } from "@mui/material/styles";

import { theme } from "@/shared/theme/theme";

const Layout = styled("div")({
  position: "relative",
  minHeight: "100vh",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  justifyContent: "center",
  alignItems: "center",

  padding: "24px",

  overflow: "visible",
});

const Background = styled("div")({
  position: "fixed",
  inset: 0,
  backgroundImage: "url(/images/background-1.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  zIndex: 0,
  pointerEvents: "none",
});

const Overlay = styled("div")({
  position: "fixed",
  inset: 0,
  backdropFilter: "blur(12px)",
  backgroundColor: "rgba(255, 255, 255, 0.4)",
  zIndex: 1,
  pointerEvents: "none",
});

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <GuestOnlyRoute>
    <ThemeProvider theme={theme}>
      <Layout>
        {/* Фон */}
        <Background />

        {/* Blur overlay */}
        <Overlay />
        {children}
      </Layout>
    </ThemeProvider>
    // </GuestOnlyRoute>
  );
}
