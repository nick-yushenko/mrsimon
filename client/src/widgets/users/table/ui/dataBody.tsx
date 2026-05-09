"use client";

import type { PagedResult } from "@/shared/api/types";
import type { GridRowParams } from "@mui/x-data-grid/models";
import type { UserListItem } from "@/entities/user/model/types";

import { useCallback } from "react";
import { usePathname } from "next/navigation";

import { AppDataGrid } from "@/shared/ui/appTable";

import { usersColumns } from "../config";

export type UsersDataBodyProps = {
  data?: PagedResult<UserListItem>;
  loading?: boolean;
};

export const UsersDataBody = ({ data, loading = false }: UsersDataBodyProps) => {
  const pathname = usePathname();

  const openProfile = useCallback(
    (id: string) => {
      const nextParams = new URLSearchParams(window.location.search);
      nextParams.set("userId", id);
      const query = nextParams.toString();

      window.history.pushState(null, "", `${pathname}${query ? `?${query}` : ""}`);
    },
    [pathname],
  );

  const handleRowClick = useCallback(
    (rowParams: GridRowParams<UserListItem>) => {
      openProfile(rowParams.row.id);
    },
    [openProfile],
  );

  return (
    <AppDataGrid
      rows={data?.items ?? []}
      columns={usersColumns}
      loading={loading}
      onRowClick={handleRowClick}
      sx={{
        cursor: "pointer",
      }}
    />
  );
};
