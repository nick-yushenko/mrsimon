"use client";

import type { User } from "@/entities/user/model/types";
import type { AppTableToolbarAction } from "@/shared/ui/appTable";

import { useMemo, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import AddIcon from "@mui/icons-material/Add";

import { AppTableToolbar } from "@/shared/ui/appTable";

import { AddDialog } from "../../actions/addDialog";

export type UsersToolbarProps = {
  onSearchChange: (search: string) => void;
  search: string;
};

export const UsersToolbar = ({ onSearchChange, search }: UsersToolbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const openProfile = useCallback(
    (id: string) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set("userId", id);

      window.history.pushState(null, "", `${pathname}?${nextParams.toString()}`);
    },
    [pathname, searchParams],
  );

  const handleAddUserSuccess = useCallback(
    async (user: User) => {
      setIsAddUserOpen(false);
      router.refresh();
      openProfile(user.id);
    },
    [openProfile, router],
  );

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
