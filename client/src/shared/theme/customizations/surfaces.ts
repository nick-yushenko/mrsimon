import { alpha, type Theme, type Components } from "@mui/material/styles";

export const surfacesCustomizations: Components<Theme> = {
  MuiPaper: {
    styleOverrides: {
      root: {
        boxShadow: "none",
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {},
    },
    variants: [
      {
        props: { variant: "dashed" },
        style: ({ theme }) => ({
          borderStyle: "dashed",
        }),
      },
      {
        props: { variant: "middle-dashed" },
        style: ({ theme }) => ({
          borderStyle: "dashed",
          margin: "0 1rem",
        }),
      },
    ],
  },

  MuiBackdrop: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: alpha(theme.palette.grey[800], 0.28), // grey[800]
      }),
      invisible: {
        backgroundColor: "transparent",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "0",
        boxShadow: "none",
      }),
    },
    variants: [
      {
        props: { variant: "plain" },
        style: ({ theme }) => ({
          borderRadius: theme.radius.lg,
          boxShadow: theme.customShadows.card,
          flex: 1,
        }),
      },
      {
        props: { variant: "panel" },
        style: ({ theme }) => ({
          borderRadius: theme.radius.sm,
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    ],
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: "1.5rem",
        paddingBottom: 0,
      },
      subheader: ({ theme }) => ({
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: "1.5rem",
      },
    },
  },

  MuiStack: {
    defaultProps: {
      useFlexGap: true,
    },
  },

  MuiDialog: {
    defaultProps: {
      fullWidth: true,
      maxWidth: "xs",
    },
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: theme.radius.lg,
        boxShadow: theme.customShadows.dialog,
        outline: "none",
      }),
    },
  },

  MuiDialogTitle: {
    defaultProps: {
      component: "div",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        paddingBottom: 0,
        "& + .MuiDialogContent-root": {
          paddingTop: "1rem",
        },
      }),
    },
  },
  MuiDialogContent: {
    defaultProps: {},
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "1rem 1.5rem",
        paddingTop: 10,
      }),
    },
  },
  MuiDialogActions: {
    defaultProps: {},
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "1rem 1.5rem",
      }),
    },
  },

  MuiDrawer: {
    defaultProps: {},
    styleOverrides: {
      paper: ({ theme }) => ({
        containerType: "inline-size",
        overflow: "hidden",
        // boxShadow: theme.customShadows.dialog,
      }),
    },
  },
};
