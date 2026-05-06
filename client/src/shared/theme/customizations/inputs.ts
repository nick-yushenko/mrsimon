import type { Theme, Components } from "@mui/material/styles";

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
  MuiAutocomplete: {
    defaultProps: {
      selectOnFocus: true,
      clearOnBlur: true,
      handleHomeEndKeys: true,
    },

    styleOverrides: {
      paper: ({ theme }) => ({
        boxShadow: theme.shadows[8],
        marginTop: 2,

        "& .MuiAutocomplete-listbox": {
          padding: 0,
        },
      }),
    },
  },

  MuiSelect: {
    styleOverrides: {
      // menu: ({ theme }) => ({
      //   boxShadow: theme.shadows[8],
      //   // border: "1px solid",
      //   // borderColor: theme.palette.divider,
      // }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        boxShadow: theme.shadows[8],
        transform: "scale(1, 1)",
      }),
    },
  },
};
