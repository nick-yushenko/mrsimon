"use client";

import type { ReactNode } from "react";

import AppTable, { useAppTableUrlState } from "@/shared/ui/appTable";

import { UsersToolbar } from "./ui/toolbar";

type UsersTableShellProps = {
  body: ReactNode;
  pagination: ReactNode;
};

export const UsersTableShell = ({ body, pagination }: UsersTableShellProps) => {
  const { search, setSearch } = useAppTableUrlState({
    delay: 400,
  });

  return (
    <AppTable
      toolbar={<UsersToolbar search={search} onSearchChange={setSearch} />}
      body={body}
      pagination={pagination}
    />
  );
};
