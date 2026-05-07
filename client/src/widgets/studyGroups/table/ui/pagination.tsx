"use client";

import type { AppTablePaginationProps } from "@/shared/ui/appTable";

import { AppTablePagination, useAppTableUrlState } from "@/shared/ui/appTable";

type StudyGroupsPaginationProps = Omit<
  AppTablePaginationProps,
  "onPageChange" | "onPageSizeChange"
>;

export const StudyGroupsPagination = ({ ...params }: StudyGroupsPaginationProps) => {
  const { setPage, setPageSize } = useAppTableUrlState({
    delay: 400,
  });
  return <AppTablePagination onPageChange={setPage} onPageSizeChange={setPageSize} {...params} />;
};
