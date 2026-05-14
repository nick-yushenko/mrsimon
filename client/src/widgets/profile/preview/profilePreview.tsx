"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import { ResizableDrawer } from "@/shared/ui/resizableDrawer";

import { ProfileView } from "../profileView";

export const ProfilePreview = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  const isDetailsOpen = Boolean(userId);

  const closeUserDetails = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("userId");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <Box>
      <ResizableDrawer
        anchor="right"
        open={isDetailsOpen}
        onClose={closeUserDetails}
        defaultSize={400}
        minSize={320}
        maxSize={theme.breakpoints.values.sm - 1}
        slotProps={{
          paper: {
            sx: {
              containerType: "inline-size",
              overflow: "hidden",
            },
          },
        }}
      >
        {userId && <ProfileView id={userId} variant="embedded" />}
      </ResizableDrawer>
    </Box>
  );
};
