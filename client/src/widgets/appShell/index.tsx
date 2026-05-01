"use client";

import { ReactNode } from "react";

import AppNavbar from "./ui/AppNavbar";
import SideMenu from "./ui/SideMenu";
import { Header } from "@/widgets/header";
import { theme } from "@/shared/theme/theme";
import { AppToastContainer } from "@/shared/ui/toast/appToastContainer";

import "react-toastify/ReactToastify.css";

import { alpha, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

type TProps = {
  children: ReactNode | ReactNode[];
};

export const AppShell = ({ children }: TProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <AppToastContainer />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={1}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />

            <Box
              sx={{
                width: "100%",
                maxWidth: { sm: "100%", md: "1700px" },
                containerType: "inline-size",
              }}
            >
              {children}
            </Box>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
