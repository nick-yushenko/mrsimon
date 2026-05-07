"use client";

import type { ReactNode } from "react";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { getBooleanParam } from "@/shared/lib/utlis/param";
import AppTable, { useAppTableUrlState } from "@/shared/ui/appTable";

import { StudyGroupsToolbar } from "./ui/toolbar";

type StudyGroupsTableShellProps = {
  body: ReactNode;
  pagination: ReactNode;
};

export const StudyGroupsTableShell = ({ body, pagination }: StudyGroupsTableShellProps) => {
  const searchParams = useSearchParams();
  const { search, setSearch, updateParams } = useAppTableUrlState({
    delay: 400,
  });

  const includeArchived = getBooleanParam(searchParams.get("includeArchived") ?? undefined);

  const handleIncludeArchivedChange = useCallback(
    (nextIncludeArchived: boolean) => {
      updateParams((nextParams) => {
        if (nextIncludeArchived) {
          nextParams.set("includeArchived", "true");
        } else {
          nextParams.delete("includeArchived");
        }

        nextParams.delete("page");
      });
    },
    [updateParams],
  );

  return (
    <AppTable
      toolbar={
        <StudyGroupsToolbar
          includeArchived={includeArchived}
          onIncludeArchivedChange={handleIncludeArchivedChange}
          search={search}
          onSearchChange={setSearch}
        />
      }
      body={body}
      pagination={pagination}
    />
  );
};
