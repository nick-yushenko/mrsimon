"use client";

import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import type { GridCsvExportOptions } from "@mui/x-data-grid/models";

import { useMemo, useState } from "react";

import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { Toolbar, ExportCsv } from "@mui/x-data-grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputAdornment from "@mui/material/InputAdornment";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Button, { type ButtonProps } from "@mui/material/Button";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

import { MenuOptions, type MenuOptionAction, type MenuOptionsProps } from "../menu/menuOptions";

export type DataGridToolbarLayoutProps = {
  children?: ReactNode;
  leftSlot?: ReactNode;
  sx?: SxProps<Theme>;
};

export const DataGridToolbarLayout = ({ children, leftSlot, sx }: DataGridToolbarLayoutProps) => {
  return (
    <Toolbar>
      <Stack
        direction="row"
        spacing={3}
        sx={[
          { width: "100%", minWidth: 0, alignItems: "center", justifyContent: "space-between" },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {leftSlot}

        <Stack
          direction="row"
          spacing={1}
          sx={{ width: "100%", minWidth: 0, alignItems: "center", justifyContent: "flex-end" }}
        >
          {children}
        </Stack>
      </Stack>
    </Toolbar>
  );
};

export type DataGridToolbarSearchProps = Omit<TextFieldProps, "onChange" | "value"> & {
  value: string;
  onChange: (value: string) => void;
};

// TODO сделать поиск по конкретным колонкам: На колонке нажали иконку поиска, в поле поиска появилось что-то вроде :column(ColumnName) ... (ввод тела запроса для поиска)
export const DataGridToolbarSearch = ({
  onChange,
  placeholder = "Поиск...",
  size = "small",
  slotProps,
  sx,
  value,
  ...props
}: DataGridToolbarSearchProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const isExpanded = expanded || Boolean(value);
  return (
    <TextField
      {...props}
      fullWidth
      placeholder={isExpanded ? placeholder : ""}
      size={size}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={() => setExpanded(true)}
      onClick={() => setExpanded(true)}
      onBlur={() => {
        if (!value) {
          setExpanded(false);
        }
      }}
      sx={[
        {
          width: isExpanded ? 260 : 50,
          minWidth: isExpanded ? 220 : 50,
          maxWidth: 600,
          transition: "width 200ms ease, min-width 200ms ease",

          "& .MuiOutlinedInput-root": {
            cursor: isExpanded ? "text" : "pointer",
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: isExpanded ? undefined : "transparent",
          },
        },
        ,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          sx: {
            height: 50,
            padding: "0 12px 0 0",
            "& input": {
              height: "100%",
              padding: 0,
              opacity: isExpanded ? 1 : 0,
              width: isExpanded ? "100%" : 0,
              transition: "opacity 120ms ease",
              cursor: isExpanded ? "text" : "pointer",
            },
          },
          startAdornment: (
            <InputAdornment
              position="start"
              sx={{
                marginRight: 0,
                minWidth: !isExpanded ? "50px" : "40px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export type DataGridToolbarAction = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: ButtonProps["onClick"];
  buttonProps?: Omit<ButtonProps, "children" | "disabled" | "onClick" | "startIcon">;
};

export type DataGridToolbarActionsProps = {
  actions?: DataGridToolbarAction[];
  sx?: SxProps<Theme>;
};

export const DataGridToolbarActions = ({ actions = [], sx }: DataGridToolbarActionsProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (actions.length === 0) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} sx={[{ flexShrink: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {actions.map((action) => (
        <Button
          key={action.id}
          size="large"
          variant="contained"
          {...action.buttonProps}
          disabled={action.disabled}
          onClick={action.onClick}
          disableFocusRipple={true}
          startIcon={action.icon}
          sx={{
            height: "50px",
            gap: "6px",
            "& .MuiButton-startIcon": {
              marginRight: 0,
            },
          }}
        >
          {isSmallScreen ? null : action.label}
        </Button>
      ))}
    </Stack>
  );
};

export type DataGridActionOptions = {
  id?: string;
  label?: ReactNode;
  icon?: ReactNode;
  options?: GridCsvExportOptions;
  disabled?: boolean;
};

type DataGridHeightActionOptions = DataGridActionOptions & {
  isHeightLimited?: boolean;
  onClick?: () => void;
};

export const createDataGridExportCsvAction = ({
  disabled,
  icon = <FileDownloadIcon fontSize="small" />,
  id = "export-csv",
  label = "Экспорт CSV",
  options,
}: DataGridActionOptions = {}): MenuOptionAction => ({
  id,
  label,
  icon,
  disabled,
  render: ({ closeMenu, content, menuItemProps }) => (
    <ExportCsv
      disabled={disabled}
      options={options}
      onClick={closeMenu}
      render={<MenuItem {...menuItemProps}>{content}</MenuItem>}
    />
  ),
});

export const createDataGridToggleHeightAction = ({
  disabled,
  id = "toggle-table-height",
  isHeightLimited,
  onClick,
}: DataGridHeightActionOptions = {}): MenuOptionAction => ({
  id,
  label: isHeightLimited ? "Раскрыть таблицу" : "Ограничить высоту",
  icon: isHeightLimited ? <UnfoldMoreIcon fontSize="small" /> : <UnfoldLessIcon fontSize="small" />,
  disabled,
  onClick,
});

export type DataGridToolbarActionsMenuProps = Omit<MenuOptionsProps, "actions"> & {
  actions?: MenuOptionAction[];
  csvExport?: boolean | DataGridActionOptions;
  isHeightLimited?: boolean;
  handleHeightLimitToggle?: () => void;
};

// TODO настроить функцию экспорта данных для сложных колонок
export const DataGridToolbarActionsMenu = ({
  actions = [],
  ariaLabel = "Действия с таблицей",
  csvExport = true,
  isHeightLimited = false,
  handleHeightLimitToggle,
  ...props
}: DataGridToolbarActionsMenuProps) => {
  const csvAction = useMemo(
    () =>
      csvExport === false
        ? null
        : createDataGridExportCsvAction(typeof csvExport === "object" ? csvExport : undefined),
    [csvExport],
  );
  const toggleHeightAction = useMemo(
    () =>
      createDataGridToggleHeightAction({
        isHeightLimited,
        onClick: handleHeightLimitToggle,
      }),
    [isHeightLimited, handleHeightLimitToggle],
  );

  const menuActions = useMemo(() => {
    const baseActions = [...actions, toggleHeightAction];

    return csvAction ? [...baseActions, csvAction] : baseActions;
  }, [actions, toggleHeightAction, csvAction]);

  return <MenuOptions {...props} ariaLabel={ariaLabel} actions={menuActions} />;
};

export type DataGridToolbarProps = {
  actions?: DataGridToolbarAction[];
  leftSlot?: ReactNode;
  menuActions?: MenuOptionAction[];
  onSearchChange?: (val: string) => void;
  handleHeightLimitToggle?: () => void;
  rightSlot?: ReactNode;
  isHeightLimited?: boolean;
  search?: string;
};

export const DataGridToolbar = ({
  actions,
  leftSlot,
  menuActions,
  onSearchChange,
  handleHeightLimitToggle,
  rightSlot,
  isHeightLimited,
  search = "",
}: DataGridToolbarProps) => {
  return (
    <DataGridToolbarLayout leftSlot={leftSlot}>
      {onSearchChange && <DataGridToolbarSearch value={search} onChange={onSearchChange} />}
      <DataGridToolbarActions actions={actions} />
      {rightSlot}
      <DataGridToolbarActionsMenu
        actions={menuActions}
        isHeightLimited={isHeightLimited}
        handleHeightLimitToggle={handleHeightLimitToggle}
      />
    </DataGridToolbarLayout>
  );
};
