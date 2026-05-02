"use client";

import { useCallback, useEffect, useMemo } from "react";

import { UserView, type UserViewActions } from "@/entities/user/ui/userView";
import type { UserDetails } from "@/entities/user/model/types";
import { useUsersStore } from "@/features/users/model/usersStore";

type TProps = {
  id: string;
  variant?: "page" | "embedded";
};

export const UserDetailsView = ({ id, variant = "page" }: TProps) => {
  const fetchUserById = useUsersStore((state) => state.fetchUserById);
  const user = useUsersStore((state) => state.selectedUser);
  const isLoading = useUsersStore((state) => state.isDetailsLoading);
  const error = useUsersStore((state) => state.detailsError);

  useEffect(() => {
    fetchUserById(id);
  }, [fetchUserById, id]);

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
      user={user}
      isLoading={isLoading}
      error={error}
      variant={variant}
      actions={actions}
    />
  );
};
