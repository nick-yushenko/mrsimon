import type { Metadata } from "next";
import { Poppins, Roboto, Barlow } from "next/font/google";
import "./globals.css";
import "@/shared/ui/chart/styles.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { AuthInitializer } from "@/widgets/auth/init/authInitializer";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "auto",
});

export const metadata: Metadata = {
  title: "MrSimon",
  description: "Mr Simon Academy - личный кабинет ученика",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={robotoSans.variable}>
      <body>
        {/* Спорное место для инциализации. Возможно лучше переделать в обертку */}
        <AuthInitializer />
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
