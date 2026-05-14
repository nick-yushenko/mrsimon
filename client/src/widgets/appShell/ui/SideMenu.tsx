"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";

import { layoutConfig } from "@/shared/config/layout";

import CardAlert from "./CardAlert";
import MenuContent from "./MenuContent";
import SelectContent from "./SelectContent";

const drawerWidth = layoutConfig.mainDrawerWidth;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

const SideMenu = () => {
  return (
    <Drawer
      // TODO добавить сжатие бокового меню
      variant="persistent"
      open
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
      slotProps={{
        paper: {
          sx: {
            boxShadow: "none",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1.5,
          height: 80,
        }}
      >
        <SelectContent />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardAlert />

        <Divider />

        <MenuContent />
      </Box>
      <Box sx={{ p: 4 }}>
        <Typography variant="body2" sx={{ textAlign: "center", color: "grey.400" }}>
          version {process.env.NEXT_PUBLIC_APP_VERSION ?? "unknown"}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default SideMenu;
