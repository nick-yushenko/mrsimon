"use client";

import { UserListItem } from "@/entities/user/model/types";
import { UserCompactCard } from "@/entities/user/ui/userCompactCard";
import { useUsersStore } from "@/features/users/model/usersStore";
import { layoutConfig } from "@/shared/config/layout";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const detailsDrawerWidth = `calc(100vw - ${layoutConfig.mainDrawerWidth}px - ${layoutConfig.detailsDrawerOffset}px)`;

export const UserDetailsDrawer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  const isDetailsOpen = Boolean(userId);

  const selectedUser = useUsersStore((state) => state.selectedUser);
  const clearSelectedUser = useUsersStore((state) => state.clearSelectedUser);
  const isDetailsLoading = useUsersStore((state) => state.isDetailsLoading);

  const detailsError = useUsersStore((state) => state.detailsError);

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

    if (selectedUser?.id === userId) {
      return;
    }

    fetchUserById(userId);
  }, [userId, selectedUser?.id, fetchUserById, clearSelectedUser]);

  // TODO - доделать
  // сделать общий компонент просмотра пользователя. можно будет посмотреть в drawer ?либо на отдельной сранице (более полная версия)?
  return (
    <Box>
      <Drawer
        anchor="right"
        open={isDetailsOpen}
        onClose={closeUserDetails}
        slotProps={{
          paper: {
            sx: {
              width: detailsDrawerWidth,
              minWidth: "min(100%, 400px)",
            },
          },
        }}
      >
        <Box>
          <Stack spacing={2}>
            <Typography variant="h6">Детали пользователя</Typography>
            {detailsError && <Alert severity="error">{detailsError}</Alert>}

            <Typography>
              <strong>Email:</strong> {selectedUser?.email}
            </Typography>

            <Button onClick={closeUserDetails}>Закрыть</Button>
          </Stack>

          <UserCompactCard
            onClick={() => {
              console.log("f");
            }}
            {...(selectedUser as UserListItem)}
          />
        </Box>
      </Drawer>

      {/* <Dialog open={isDetailsOpen} onClose={closeUserDetails} fullWidth maxWidth="sm">
        <DialogTitle>Детали пользователя</DialogTitle>

        <DialogContent>
          {isDetailsLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!isDetailsLoading && selectedUser && (
            <Stack spacing={2}>
              <Typography>
                <strong>ID:</strong> {selectedUser.id}
              </Typography>

              <Typography>
                <strong>Имя:</strong> {selectedUser.name}
              </Typography>

              <Typography>
                <strong>Фамилия:</strong> {selectedUser.lastName}
              </Typography>

              <Typography>
                <strong>Email:</strong> {selectedUser.email}
              </Typography>

              <Typography>
                <strong>Роль:</strong> {selectedUser.role}
              </Typography>

              <Typography>
                <strong>Создан:</strong> {new Date(selectedUser.createdAt).toLocaleString("ru-RU")}
              </Typography>

              <Typography>
                <strong>Обновлен:</strong>{" "}
                {new Date(selectedUser.updatedAt).toLocaleString("ru-RU")}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={closeUserDetails}>Закрыть</Button>
              </Box>
            </Stack>
          )}

          {!isDetailsLoading && !selectedUser && userId && !detailsError && (
            <Typography color="text.secondary">Пользователь не найден.</Typography>
          )}
        </DialogContent>
      </Dialog> */}
    </Box>
  );
};
