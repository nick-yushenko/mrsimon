import "@mui/x-data-grid";
import type { ReactNode } from "react";
import type { DataGridToolbarAction } from "@/shared/ui/dataGrid/dataGridToolbar";
import type { MenuOptionAction } from "@/shared/ui/menu/menuOptions";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    actions?: DataGridToolbarAction[];
    leftSlot?: ReactNode;
    menuActions?: MenuOptionAction[];
    onSearchChange?: (value: string) => void;
    rightSlot?: ReactNode;
    search?: string;
  }
}
