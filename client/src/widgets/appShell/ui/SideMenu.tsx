"use client";

import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";
import OptionsMenu from "./OptionsMenu";
import SelectContent from "./SelectContent";
import { useAuthStore } from "@/features/auth/model/authStore";
import { layoutConfig } from "@/shared/config/layout";

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
  const user = useAuthStore((state) => state.getCurrentUser());
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
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
      {/* <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt="Riley Carter"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: "16px" }}>
            {user?.name ?? "Неопознанный"} {user?.lastName ?? "пользователь"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {user?.email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack> */}

      <Box sx={{ p: 4 }}>
        <Typography variant="body2" sx={{ textAlign: "center", color: "grey.400" }}>
          version {process.env.NEXT_PUBLIC_APP_VERSION ?? "unknown"}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default SideMenu;
