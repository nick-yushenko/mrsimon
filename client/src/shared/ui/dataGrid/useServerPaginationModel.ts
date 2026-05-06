"use client";

import type { GridPaginationModel } from "@mui/x-data-grid";

import { useMemo, useCallback } from "react";

export type UseServerPaginationModelOptions = {
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const useServerPaginationModel = ({
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
}: UseServerPaginationModelOptions) => {
  const paginationModel = useMemo<GridPaginationModel>(
    () => ({
      page: Math.max(page - 1, 0),
      pageSize,
    }),
    [page, pageSize],
  );

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      const nextPage = model.page + 1;

      if (nextPage !== page) {
        onPageChange(nextPage);
      }

      if (model.pageSize !== pageSize) {
        onPageSizeChange(model.pageSize);
      }
    },
    [onPageChange, onPageSizeChange, page, pageSize],
  );

  return {
    paginationModel,
    onPaginationModelChange: handlePaginationModelChange,
  };
};
