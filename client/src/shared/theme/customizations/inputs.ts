import type { Components, Theme } from "@mui/material/styles";

export const inputsCustomizations: Components<Theme> = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        textTransform: "none",
        fontWeight: 400,
      }),
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,

        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.divider,
        },

        // hover
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.text.primary,
        },

        // focus
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
        // "&.Mui-disabled": {
        //   backgroundColor: theme.palette.background.paper,
        // },

        // "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
        // },
      }),
      input: ({ theme }) => ({
        "&.Mui-disabled": {
          WebkitTextFillColor: theme.palette.text.primary, // важно для Chrome
          color: theme.palette.text.primary,
          cursor: "default",
        },
      }),
    },
  },
};
