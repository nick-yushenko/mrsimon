import { alpha, Theme, Components } from "@mui/material/styles";

export const surfacesCustomizations: Components<Theme> = {
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => {
        return {
          // border: `1px solid ${(theme.vars || theme).palette.divider}`,
          padding: "1rem",
          boxShadow: theme.shadows[0],
        };
      },
    },
    variants: [
      {
        props: { variant: "plain" },
        style: ({ theme }) => ({
          borderRadius: theme.radius.lg,
          boxShadow: theme.shadows[4],
          flex: 1,
        }),
      },
      {
        props: { variant: "panel" },
        style: ({ theme }) => ({
          borderRadius: theme.radius.sm,
          boxShadow: theme.shadows[1],
          border: `1px solid ${theme.palette.divider}`,
          padding: 1,
        }),
      },
    ],
  },
  // MuiCardContent: {
  //   styleOverrides: {
  //     root: {
  //       padding: 0,
  //       "&:last-child": { paddingBottom: 0 },
  //     },
  //   },
  // },
  // MuiCardHeader: {
  //   styleOverrides: {
  //     root: {
  //       padding: 0,
  //     },
  //   },
  // },
  // MuiCardActions: {
  //   styleOverrides: {
  //     root: {
  //       padding: 0,
  //     },
  //   },
  // },
  MuiStack: {
    defaultProps: {
      useFlexGap: true,
    },
  },
};
