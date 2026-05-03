"use client";

import { GlobalStyles } from "@mui/material";
import { ToastContainer } from "react-toastify/unstyled";
import "react-toastify/ReactToastify.css";

export function AppToastContainer() {
  return (
    <>
      <GlobalStyles
        styles={(theme) => ({
          ".Toastify__toast": {
            minHeight: 48,
            padding: "12px 14px",
            borderRadius: 12,
            fontSize: "0.875rem",
            lineHeight: "1.334rem",
            boxShadow: theme.shadows[3],
            overflow: "hidden",
          },

          ".Toastify__toast--success": {
            backgroundColor: theme.palette.success.light,
            color: theme.palette.success.dark,
          },

          ".Toastify__toast--error": {
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.dark,
          },

          ".Toastify__toast--warning": {
            backgroundColor: theme.palette.warning.light,
            color: theme.palette.warning.dark,
          },

          ".Toastify__toast--info": {
            backgroundColor: theme.palette.info.light,
            color: theme.palette.info.dark,
          },

          ".Toastify__progress-bar, .Toastify__progress-bar--bg, .Toastify__progress-bar--wrp": {
            height: 2,
          },

          ".Toastify__progress-bar--success": {
            backgroundColor: theme.palette.success.main,
          },

          ".Toastify__progress-bar--error": {
            backgroundColor: theme.palette.error.main,
          },

          ".Toastify__progress-bar--warning": {
            backgroundColor: theme.palette.warning.main,
          },

          ".Toastify__progress-bar--info": {
            backgroundColor: theme.palette.info.main,
          },
        })}
      />
      <ToastContainer
        position="bottom-left"
        autoClose={4000}
        closeButton={false}
        closeOnClick
        draggable
        draggablePercent={60}
      />
    </>
  );
}
