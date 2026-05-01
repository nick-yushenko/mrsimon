"use client";

import { UserView } from "@/entities/user/ui/userView";
import { useUsersStore } from "@/features/users/model/usersStore";
import { ResizableDrawer } from "@/shared/ui/resizableDrawer";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const UserDetailsDrawer = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  const isDetailsOpen = Boolean(userId);

  const clearSelectedUser = useUsersStore((state) => state.clearSelectedUser);
  const fetchUserById = useUsersStore((state) => state.fetchUserById);

  const closeUserDetails = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("userId");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  useEffect(() => {
    if (!userId) {
      clearSelectedUser();
      return;
    }

    fetchUserById(userId);
  }, [userId, fetchUserById, clearSelectedUser]);

  // TODO - доделать
  // сделать общий компонент просмотра пользователя. можно будет посмотреть в drawer ?либо на отдельной сранице (более полная версия)?
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
        <Box sx={{ overflowY: "auto", p: 2 }}>
          <UserView id={userId!} variant="embedded" />
        </Box>
        {/* TODO добавить UserViewCompact */}
      </ResizableDrawer>
    </Box>
  );
};
