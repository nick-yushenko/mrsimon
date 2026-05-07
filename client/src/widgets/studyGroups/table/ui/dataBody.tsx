"use client";

import type { PagedResult } from "@/shared/api/types";
import type { GridRowParams } from "@mui/x-data-grid/models";
import type { StudyGroupListItem } from "@/entities/studyGroup/model/types";

import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { AppDataGrid } from "@/shared/ui/appTable";

import { studyGroupsColumns } from "../config";

export type StudyGroupsDataBodyProps = {
  data?: PagedResult<StudyGroupListItem>;
  loading?: boolean;
};

export const StudyGroupsDataBody = ({ data, loading = false }: StudyGroupsDataBodyProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openGroup = useCallback(
    (id: number) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set("groupId", String(id));

      window.history.pushState(null, "", `${pathname}?${nextParams.toString()}`);
    },
    [pathname, searchParams],
  );

  const handleRowClick = useCallback(
    (rowParams: GridRowParams<StudyGroupListItem>) => {
      openGroup(Number(rowParams.row.id));
    },
    [openGroup],
  );

  return (
    <>
      <AppDataGrid
        rows={data?.items ?? []}
        columns={studyGroupsColumns}
        loading={loading}
        onRowClick={handleRowClick}
        sx={{
          cursor: "pointer",
        }}
      />
    </>
  );
};
