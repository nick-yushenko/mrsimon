"use client";

import { useCallback } from "react";
import z from "zod";

import {
  EntityView,
  type EntityFieldConfig,
  type EntityViewLayoutItem,
} from "@/shared/ui/entityView";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { UserDetails } from "../model/types";
import { ContainerGridItem } from "@/shared/ui/containerGridItem";
import { OpenInNewLink } from "@/shared/ui/openInNew/openInNew";

export type UserViewActions = Record<string, (values: UserDetails) => Promise<void>>;

type TProps = {
  id: string;
  user: UserDetails | null;
  isLoading?: boolean;
  error?: string | null;
  variant?: "page" | "embedded";
  actions?: UserViewActions;
};

const userDetailsSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(1, "Введите имя"),
  lastName: z.string().min(1, "Введите фамилию"),
  email: z.string().min(1, "Введите email").pipe(z.email("Некорректный email")),
  role: z.enum(["Admin", "Teacher", "Student", "User"]),
  createdAt: z.string().min(1, "Укажите дату создания"),
  updatedAt: z.string().min(1, "Укажите дату обновления"),
  note: z.string().optional(),
});

const userDetailsFields: EntityFieldConfig<UserDetails>[] = [
  { key: "name", label: "Имя", kind: "text", editable: true, autoComplete: true },
  { key: "lastName", label: "Фамилия", kind: "text", editable: true, autoComplete: false },
  { key: "email", label: "Email", kind: "email", editable: true },
  {
    key: "role",
    label: "Роль",
    kind: "select",
    editable: true,
    options: [
      { label: "Администратор", value: "Admin" },
      { label: "Преподаватель", value: "Teacher" },
      { label: "Студент", value: "Student" },
      { label: "Пользователь", value: "User" },
    ],
  },
  {
    key: "note",
    label: "Комментарий",
    kind: "textarea",
    editable: true,
    placeholder: "Добавьте заметку о пользователе",
  },
];

export const UserView = ({
  id,
  user,
  isLoading = false,
  error,
  variant = "page",
  actions,
}: TProps) => {
  const isEmbedded = variant === "embedded";

  const renderUserFields = useCallback((items: EntityViewLayoutItem<UserDetails>[]) => {
    return (
      <Grid container spacing={2}>
        {items.map((item) => (
          <ContainerGridItem
            key={item.field.key}
            containerSize={{ xs: 12, sm: item.field.key === "note" ? 12 : 6 }}
          >
            {item.node}
          </ContainerGridItem>
        ))}
      </Grid>
    );
  }, []);

  const handleUserSubmit = useCallback(
    async (values: UserDetails) => {
      await actions?.edit?.(values);
    },
    [actions],
  );

  return (
    <Grid container spacing={2}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <OpenInNewLink href={`users/${id}`}>Перейти в профиль</OpenInNewLink>
      </Box>

      <ContainerGridItem containerSize={{ xs: 12, sm: 4 }}>
        <Card variant="plain">
          <Stack
            direction={"column"}
            sx={{
              paddingTop: isEmbedded ? "auto" : "50px",
              alignItems: "center",
            }}
            spacing={2}
          >
            <Avatar
              src="/avatar/avatar-25.webp"
              sx={{
                width: "144px",
                height: "144px",
              }}
            />

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", maxWidth: "150px", textAlign: "center" }}
            >
              Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3 Mb
            </Typography>
          </Stack>
        </Card>
      </ContainerGridItem>

      <ContainerGridItem containerSize={{ xs: 12, sm: 8 }}>
        <Card sx={{ p: 3, containerType: "inline-size" }} variant="plain">
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {!isLoading && error && <Alert severity="error">{error}</Alert>}

          {!isLoading && !error && user && (
            <EntityView
              entity={user}
              fields={userDetailsFields}
              schema={userDetailsSchema}
              editable
              defaultEditMode
              renderFields={renderUserFields}
              onSubmit={handleUserSubmit}
            />
          )}

          {!isLoading && !error && !user && (
            <Typography color="text.secondary">Пользователь не найден.</Typography>
          )}
        </Card>
      </ContainerGridItem>
    </Grid>
  );
};
