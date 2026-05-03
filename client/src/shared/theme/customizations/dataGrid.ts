import type { Components, Theme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";

export const dataGridCustomizations: Components<Theme> = {
  MuiDataGrid: {
    defaultProps: {
      disableRowSelectionOnClick: true,
      disableColumnMenu: true,
      pageSizeOptions: [5, 10, 25],

      columnHeaderHeight: 48,
      rowHeight: 48,
    },

    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 0,
        backgroundColor: theme.palette.background.paper,
        border: "none",

        color: theme.palette.text.primary,
        fontSize: "0.875rem",

        "& .MuiDataGrid-filler > *": {
          border: "none",
        },

        "& .MuiDataGrid-columnHeader": {
          backgroundColor: theme.palette.grey[100],
          border: "none !important",
          padding: "0 14px",
          marginBottom: "-1px",
        },

        "& .MuiDataGrid-columnHeader .MuiDataGrid-sortButton": {
          backgroundColor: "transparent",
        },

        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: 500,
          color: theme.palette.text.secondary,
        },

        "& .MuiDataGrid-columnSeparator": {
          display: "none",
        },

        "& .MuiDataGrid-columnHeaderTitleContainer": {
          gap: "10px",
        },

        "& .MuiDataGrid-row": {
          backgroundColor: theme.palette.background.paper,
        },
        "& .MuiDataGrid-row:hover": {
          backgroundColor: theme.palette.grey[100],
        },

        "& .MuiDataGrid-cell": {
          padding: "6px 14px",

          display: "flex",
          alignItems: "center",
          color: theme.palette.text.primary,
          borderTop: `1px solid ${theme.palette.grey[200]}`,
        },

        "& .MuiDataGrid-cellEmpty": {
          display: "none",
        },

        "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
          outline: "none",
        },

        "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
          outline: "none",
        },

        "& .MuiDataGrid-footerContainer": {
          minHeight: 50,
          height: 50,
          borderTop: "none",
          paddingLeft: 18,
          paddingRight: 18,
          backgroundColor: theme.palette.background.paper,
        },
        "& .MuiDataGrid-footerContainer .MuiButtonBase-root": {
          padding: "2px",
        },

        "& .MuiTablePagination-root": {
          color: theme.palette.text.primary,
          fontSize: "0.875rem",
        },

        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
          fontSize: "0.875rem",
          color: theme.palette.text.primary,
        },

        "& .MuiTablePagination-select": {
          fontSize: "0.875rem",
        },

        "& .MuiIconButton-root": {
          color: theme.palette.text.secondary,
        },

        "& .MuiDataGrid-toolbar": {
          padding: "20px",
          height: "100px",
          minHeight: "unset",
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          justifyContent: "space-between",
        },
      }),
    },
  },
};
