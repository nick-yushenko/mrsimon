"use client";

import type { AppTableUrlPaginationProps } from "@/shared/ui/appTable";

import { AppTablePagination, useAppTableUrlState } from "@/shared/ui/appTable";

export const UsersPagination = (params: AppTableUrlPaginationProps) => {
  const { setPage, setPageSize } = useAppTableUrlState({
    delay: 400,
  });

  return <AppTablePagination onPageChange={setPage} onPageSizeChange={setPageSize} {...params} />;
};
