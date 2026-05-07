import type { ReactNode } from "react";
import type { ButtonProps } from "@mui/material/Button";

export type AppTablePaginationConfig = {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  rowsPerPageOptions?: number[];
};

export type AppTableToolbarAction = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: ButtonProps["onClick"];
  buttonProps?: Omit<ButtonProps, "children" | "disabled" | "onClick" | "startIcon">;
};
