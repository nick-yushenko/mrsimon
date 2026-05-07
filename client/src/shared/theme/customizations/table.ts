import type { Theme, Components } from "@mui/material/styles";

// TODO првоерить необходимость и удалить старый код, так как table больше не используется
export const tableCustomizations: Components<Theme> = {
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.grey[100],
        "& .MuiTableCell-head": {
          fontSize: "0.875rem",
          color: theme.palette.grey[600],
        },
      }),
    },
  },
  MuiTableRow: {
    defaultProps: {},

    styleOverrides: {
      root: ({ theme }) => ({
        borderTop: "1px solid",
        borderColor: theme.palette.grey[200],
        "&:hover": {
          backgroundColor: theme.palette.grey[100],
        },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "0.5rem 1rem",
      }),
    },
  },
};
