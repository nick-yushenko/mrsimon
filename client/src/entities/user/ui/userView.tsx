"use client";

import { useCallback, useMemo } from "react";

import {
  normalizeUserDetailsFormValues,
  toUserDetailsFormValues,
  userDetailsFields,
  userDetailsSchema,
} from "@/features/users/model/userForm";
import { EntityView, type EntityViewLayoutItem } from "@/shared/ui/entityView";
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

export const UserView = ({
  id,
  user,
  isLoading = false,
  error,
  variant = "page",
  actions,
}: TProps) => {
  const isEmbedded = variant === "embedded";
  const formValues = useMemo(() => (user ? toUserDetailsFormValues(user) : null), [user]);

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
      await actions?.edit?.(normalizeUserDetailsFormValues(values));
    },
    [actions],
  );

  return (
    <Grid container spacing={2}>
      {isEmbedded && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <OpenInNewLink href={`users/${id}`}>Перейти в профиль</OpenInNewLink>
        </Box>
      )}

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

          {!isLoading && !error && user && formValues && (
            <EntityView
              entity={formValues}
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
