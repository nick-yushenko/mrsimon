"use client";

import type { User } from "@/entities/user/model/types";
import type { AppTableToolbarAction } from "@/shared/ui/appTable";

import { usePathname } from "next/navigation";
import { useMemo, useState, useCallback } from "react";

import AddIcon from "@mui/icons-material/Add";

import { AppTableToolbar } from "@/shared/ui/appTable";

import { AddDialog } from "../../actions/addDialog";

export type UsersToolbarProps = {
  onSearchChange: (search: string) => void;
  search: string;
};

export const UsersToolbar = ({ onSearchChange, search }: UsersToolbarProps) => {
  const pathname = usePathname();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const openProfile = useCallback(
    (id: string) => {
      const nextParams = new URLSearchParams(window.location.search);
      nextParams.set("userId", id);
      const query = nextParams.toString();

      window.history.pushState(null, "", `${pathname}${query ? `?${query}` : ""}`);
    },
    [pathname],
  );

  const handleAddUserSuccess = (user: User) => {
    handleAddUserClose();
    openProfile(user.id);
  };

  const handleAddUserOpen = useCallback(() => {
    setIsAddUserOpen(true);
  }, []);

  const handleAddUserClose = useCallback(() => {
    setIsAddUserOpen(false);
  }, []);

  const actions = useMemo<AppTableToolbarAction[]>(
    () => [
      {
        id: "add-user",
        label: "Добавить",
        icon: <AddIcon fontSize="small" />,
        onClick: handleAddUserOpen,
      },
    ],
    [handleAddUserOpen],
  );

  return (
    <>
      <AppTableToolbar
        actions={actions}
        onSearchChange={onSearchChange}
        search={search}
        searchPlaceholder="Поиск пользователей..."
      />

      <AddDialog
        open={isAddUserOpen}
        onClose={handleAddUserClose}
        onSuccess={handleAddUserSuccess}
      />
    </>
  );
};
