"use client";

import TablePagination, { type TablePaginationProps } from "@mui/material/TablePagination";

import { DEFAULT_ROWS_PER_PAGE_OPTIONS } from "./constants";

export type AppTableUrlPaginationProps = {
  count: number;
  page: number;
  pageSize: number;
  rowsPerPageOptions?: number[];
};

export type AppTablePaginationProps = AppTableUrlPaginationProps & {
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const AppTablePagination = ({
  count,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
}: AppTablePaginationProps) => {
  const handlePageChange: TablePaginationProps["onPageChange"] = (_event, nextPage) => {
    onPageChange(nextPage + 1);
  };

  const handleRowsPerPageChange: NonNullable<TablePaginationProps["onRowsPerPageChange"]> = (
    event,
  ) => {
    onPageSizeChange(Number.parseInt(event.target.value, 10));
  };

  return (
    <TablePagination
      component="div"
      variant="head"
      count={count}
      page={Math.max(page - 1, 0)}
      rowsPerPage={pageSize}
      rowsPerPageOptions={rowsPerPageOptions}
      labelRowsPerPage="Строк на странице:"
      labelDisplayedRows={({ count: total, from, to }) =>
        `${from}-${to} из ${total !== -1 ? total : `больше ${to}`}`
      }
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  );
};
