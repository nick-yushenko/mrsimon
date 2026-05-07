"use client";

import type { ReactNode, MouseEvent } from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import type { MenuItemProps } from "@mui/material/MenuItem";
import type { IconButtonProps } from "@mui/material/IconButton";

import { useId, Fragment, useState } from "react";

import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

// TODO refactor this
export type MenuOptionAction = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  disabled?: boolean;
  dividerBefore?: boolean;
  dividerAfter?: boolean;
  keepOpenOnClick?: boolean;
  onClick?: (event: MouseEvent<HTMLLIElement>) => void | Promise<void>;
  menuItemProps?: Omit<MenuItemProps, "children" | "disabled" | "onClick">;
  render?: (params: {
    action: MenuOptionAction;
    closeMenu: () => void;
    content: ReactNode;
    menuItemProps: MenuItemProps;
  }) => ReactNode;
};

export type MenuOptionsProps = {
  actions?: MenuOptionAction[];
  ariaLabel?: string;
  buttonProps?: Omit<IconButtonProps, "children" | "onClick">;
  emptyMessage?: ReactNode;
  icon?: ReactNode;
  menuId?: string;
  menuSx?: SxProps<Theme>;
};

const renderActionContent = (action: MenuOptionAction) => {
  const iconPosition = action.iconPosition ?? "start";

  return (
    <>
      {action.icon && iconPosition === "start" && <ListItemIcon>{action.icon}</ListItemIcon>}
      <ListItemText>{action.label}</ListItemText>
      {action.icon && iconPosition === "end" && (
        <ListItemIcon sx={{ ml: "auto", minWidth: 0 }}>{action.icon}</ListItemIcon>
      )}
    </>
  );
};

export const MenuOptions = ({
  actions = [],
  ariaLabel = "Open menu",
  buttonProps,
  emptyMessage,
  icon = <MoreVertRoundedIcon fontSize="small" />,
  menuId,
  menuSx,
}: MenuOptionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const generatedId = useId();
  const id = menuId ?? `menu-options-${generatedId}`;
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (event: MouseEvent<HTMLLIElement>, action: MenuOptionAction) => {
    action.onClick?.(event);

    if (!action.keepOpenOnClick && !event.defaultPrevented) {
      handleClose();
    }
  };

  return (
    <>
      <IconButton
        aria-controls={open ? id : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        aria-label={ariaLabel}
        onClick={handleClick}
        size="small"
        {...buttonProps}
        sx={[
          { borderColor: "transparent" },
          ...(Array.isArray(buttonProps?.sx) ? buttonProps.sx : [buttonProps?.sx]),
        ]}
      >
        {icon}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id={id}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={menuSx}
      >
        {actions.length === 0 && emptyMessage && <MenuItem disabled>{emptyMessage}</MenuItem>}
        {actions.map((action) => {
          const content = renderActionContent(action);
          const menuItemProps: MenuItemProps = {
            ...action.menuItemProps,
            disabled: action.disabled,
            onClick: (event) => handleItemClick(event, action),
          };

          return (
            <Fragment key={action.id}>
              {action.dividerBefore && <Divider />}
              {action.render ? (
                action.render({ action, closeMenu: handleClose, content, menuItemProps })
              ) : (
                <MenuItem {...menuItemProps}>{content}</MenuItem>
              )}
              {action.dividerAfter && <Divider />}
            </Fragment>
          );
        })}
      </Menu>
    </>
  );
};
