"use client";

import type { UserDetails } from "@/entities/user/model/types";

import { useMemo, useCallback } from "react";

import { useUserQuery } from "@/entities/user/model/queries";
import { UserView, type UserViewActions } from "@/entities/user/ui/userView";

type TProps = {
  id: string;
  variant?: "page" | "embedded";
};

export const ProfileView = ({ id, variant = "page" }: TProps) => {
  const query = useUserQuery(id);
  const user = query.data;

  // TODO добавить редактирование пользователя
  const editUser = useCallback(async (values: UserDetails) => {
    console.log("User details submitted", values);
  }, []);

  const actions = useMemo<UserViewActions>(
    () => ({
      edit: editUser,
    }),
    [editUser],
  );

  return (
    <UserView
      id={id}
      user={user ?? null}
      isLoading={query.isFetching}
      error={query.error?.message}
      variant={variant}
      actions={actions}
    />
  );
};
