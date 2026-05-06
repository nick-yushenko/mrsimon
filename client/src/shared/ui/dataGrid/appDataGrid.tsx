"use client";

import type { Theme, SxProps } from "@mui/material/styles";
import type { DataGridProps, GridValidRowModel } from "@mui/x-data-grid";

import { useState, useCallback } from "react";

import { DataGrid } from "@mui/x-data-grid/DataGrid";
import Card, { type CardProps } from "@mui/material/Card";

import { DataGridToolbar, type DataGridToolbarProps } from "./dataGridToolbar";
import {
  useServerPaginationModel,
  type UseServerPaginationModelOptions,
} from "./useServerPaginationModel";

export type AppDataGridServerPagination = UseServerPaginationModelOptions;

export type AppDataGridProps<R extends GridValidRowModel = GridValidRowModel> = DataGridProps<R> & {
  cardProps?: Omit<CardProps, "children">;
  height?: number | string;
  minHeight?: number | string;
  defaultHeightLimited?: boolean;
  serverPagination?: AppDataGridServerPagination;
  toolbarProps?: DataGridToolbarProps;
};

const toSxArray = (sx?: SxProps<Theme>) => (Array.isArray(sx) ? sx : [sx]);

const noop = () => undefined;

export const AppDataGrid = <R extends GridValidRowModel = GridValidRowModel>({
  cardProps,
  height = 432,
  minHeight = 432,
  defaultHeightLimited = false,
  serverPagination,
  showToolbar,
  slotProps,
  slots,
  sx,
  toolbarProps,
  ...dataGridProps
}: AppDataGridProps<R>) => {
  const [isHeightLimited, setIsHeightLimited] = useState<boolean>(defaultHeightLimited);

  const handleHeightLimitToggle = useCallback(() => {
    setIsHeightLimited((value) => !value);
  }, []);

  const serverPaginationModel = useServerPaginationModel({
    page: serverPagination?.page ?? 1,
    pageSize: serverPagination?.pageSize ?? 5,
    onPageChange: serverPagination?.onPageChange ?? noop,
    onPageSizeChange: serverPagination?.onPageSizeChange ?? noop,
  });

  const shouldShowToolbar = showToolbar ?? Boolean(toolbarProps || slots?.toolbar);
  const { sx: cardSx, ...restCardProps } = cardProps ?? {};

  return (
    <Card
      variant="plain"
      {...restCardProps}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight,
          height: isHeightLimited ? height : "auto",
          maxHeight: isHeightLimited ? height : "none",
          p: 0,
        },
        ...toSxArray(cardSx),
      ]}
    >
      <DataGrid
        {...dataGridProps}
        {...(serverPagination
          ? {
              pagination: true,
              paginationMode: "server" as const,
              paginationModel: serverPaginationModel.paginationModel,
              onPaginationModelChange: serverPaginationModel.onPaginationModelChange,
            }
          : {})}
        autoHeight={!isHeightLimited}
        showToolbar={shouldShowToolbar}
        slots={{
          ...(shouldShowToolbar ? { toolbar: DataGridToolbar } : {}),
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          toolbar: {
            ...toolbarProps,
            ...(slotProps?.toolbar as object | undefined),
            isHeightLimited,
            handleHeightLimitToggle: handleHeightLimitToggle,
          },
        }}
        sx={toSxArray(sx)}
      />
    </Card>
  );
};
