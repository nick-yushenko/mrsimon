"use client";

import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

import MenuButton from "@/shared/ui/menu/menuButton";
import NavbarBreadcrumbs from "@/shared/ui/menu/navbarBreadcrumbs";
// import CustomDatePicker from "./CustomDatePicker";

// import Search from "./Search";
// import ColorModeIconDropdown from "@/shared/shared-theme/ColorModeIconDropdown";

export const Header = () => {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        height: 80,
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        {/* <Search /> */}

        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
      </Stack>
    </Stack>
  );
};
