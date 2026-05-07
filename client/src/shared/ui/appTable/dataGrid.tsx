"use client";

import type { Theme, SxProps } from "@mui/material/styles";
import type { GridValidRowModel, DataGridProps as MuiDataGridProps } from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import { DataGrid as MuiDataGrid } from "@mui/x-data-grid/DataGrid";

import { useAppTableContext, APP_TABLE_DEFAULT_BODY_HEIGHT } from "./context";

type BlockedDataGridProps =
  | "autoHeight"
  | "hideFooter"
  | "hideFooterPagination"
  | "onPaginationModelChange"
  | "pageSizeOptions"
  | "pagination"
  | "paginationMeta"
  | "paginationMode"
  | "paginationModel"
  | "rowCount"
  | "showToolbar";

export type AppDataGridProps<R extends GridValidRowModel = GridValidRowModel> = Omit<
  MuiDataGridProps<R>,
  BlockedDataGridProps
> & {
  height?: number | string;
  minHeight?: number | string;
};

const toSxArray = (sx?: SxProps<Theme>) => (Array.isArray(sx) ? sx : [sx]);

export const AppDataGrid = <R extends GridValidRowModel = GridValidRowModel>({
  height,
  minHeight,
  sx,
  ...dataGridProps
}: AppDataGridProps<R>) => {
  const tableContext = useAppTableContext();
  const isBodyHeightLimited = tableContext?.isBodyHeightLimited ?? true;
  const limitedHeight = height ?? tableContext?.bodyHeight ?? APP_TABLE_DEFAULT_BODY_HEIGHT;
  const resolvedHeight = isBodyHeightLimited ? limitedHeight : "auto";
  const resolvedMinHeight = minHeight ?? (isBodyHeightLimited ? limitedHeight : undefined);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: resolvedMinHeight,
        height: resolvedHeight,
      }}
    >
      <MuiDataGrid
        {...dataGridProps}
        autoHeight={!isBodyHeightLimited}
        disableRowSelectionOnClick
        hideFooter
        showToolbar={false}
        sx={toSxArray(sx)}
      />
    </Box>
  );
};
