import type { Theme, Components } from "@mui/material/styles";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const accordionCustomizations: Components<Theme> = {
  MuiAccordion: {
    defaultProps: {
      slots: {
        heading: "div",
      },
    },
    styleOverrides: {
      root: ({ theme }) => ({
        // border: "1px solid",
        // borderColor: theme.palette.grey[500],
        boxShadow: "none",
        "&:not(:last-child)": {
          borderBottom: "none",
        },
        "&:before": {
          display: "none",
        },
      }),
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "0rem 0.75rem 1rem",
        // borderTop: "1px solid",
        // borderColor: theme.palette.grey[500],
      }),
    },
  },
  MuiAccordionSummary: {
    defaultProps: {
      expandIcon: <ExpandMoreIcon />,
      slots: {
        // root: "div",
      },
    },
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: "unset",
        padding: "1rem 0.75rem",
        "&.Mui-expanded": {
          minHeight: "unset",
        },
      }),
      content: ({ theme }) => ({
        margin: 0,

        "&.Mui-expanded": {
          margin: 0,
        },
      }),
    },
  },

  MuiAccordionActions: {
    defaultProps: {},
  },
};
