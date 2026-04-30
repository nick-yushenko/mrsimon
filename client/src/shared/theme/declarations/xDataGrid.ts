import "@mui/x-data-grid";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    search?: string;
    onSearchChange?: (value: string) => void;
    isHeightLimited?: boolean;
    onHeightLimitToggle?: () => void;
    onAddUserClick?: () => void;
  }
}
