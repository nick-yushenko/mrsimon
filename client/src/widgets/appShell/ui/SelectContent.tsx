"use client";

import { useState } from "react";

import MuiAvatar from "@mui/material/Avatar";
import MuiListItemAvatar from "@mui/material/ListItemAvatar";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import Select, { SelectChangeEvent, selectClasses } from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAuthStore } from "@/features/auth/model/authStore";
import { User } from "@/entities/user/model/types";
import { SessionId } from "@/features/auth/types";
import { AddAccount } from "@/widgets/auth/ui/addAccount";

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

const getUserInfo = (user: User | null) => {
  return {
    name: `${user?.name} ${user?.lastName}`,
    email: user?.email,
  };
};
const SelectContent = () => {
  const [addAccountOpen, setAddAccountOpen] = useState<boolean>(false);

  const activeSessionId = useAuthStore((state) => state.activeSessionId);
  const accounts = useAuthStore((state) => state.accounts);
  const user = useAuthStore((state) => state.getCurrentUser());
  const userInfo = getUserInfo(user);

  const switchAccount = useAuthStore((state) => state.switchSession);
  const logout = useAuthStore((state) => state.logoutCurrent);

  const handleChange = async (event: SelectChangeEvent<SessionId>) => {
    switch (event.target.value) {
      case "logout":
        logout();
        break;
      case "add":
        setAddAccountOpen(true);
        break;
      default:
        await switchAccount(event.target.value as string);
    }
  };

  return (
    <>
      <Select
        labelId="account-select"
        id="account-switch-select"
        value={activeSessionId as string}
        onChange={handleChange}
        displayEmpty
        inputProps={{
          "aria-label": "Смена аккаунта",
        }}
        MenuProps={{
          transitionDuration: {
            exit: 0,
          },
        }}
        fullWidth
        sx={{
          maxHeight: 56,
          outline: "none !important",

          [`& .${selectClasses.select}`]: {
            display: "flex",
            alignItems: "center",
            gap: "2px",
            pl: 1,
          },
        }}
      >
        <ListSubheader sx={{ pt: 0 }}>Текущий профиль</ListSubheader>
        <MenuItem value={activeSessionId as string}>
          <ListItemAvatar>
            <Avatar>
              <DevicesRoundedIcon sx={{ fontSize: "1rem" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={userInfo.name} secondary={userInfo.email} />
        </MenuItem>

        {Object.entries(accounts).length > 1 && <Divider sx={{ mx: -1 }} />}
        {Object.entries(accounts).length > 1 && <ListSubheader>Доступные профили</ListSubheader>}

        {Object.entries(accounts).map(([sessionId, user]) => {
          const userInfo = getUserInfo(user);

          if (sessionId === activeSessionId) return null;

          return (
            <MenuItem value={sessionId} key={sessionId}>
              <ListItemAvatar>
                <Avatar>
                  <ConstructionRoundedIcon sx={{ fontSize: "1rem" }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={userInfo.name} secondary={userInfo.email} />
            </MenuItem>
          );
        })}

        <Divider sx={{ mx: -1 }} />
        <MenuItem value={"add"}>
          <ListItemIcon>
            <AddRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Добавить аккаунт" />
        </MenuItem>

        <MenuItem value={"logout"}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Выйти" />
        </MenuItem>
      </Select>

      <AddAccount open={addAccountOpen} onClose={() => setAddAccountOpen(false)} />
    </>
  );
};

export default SelectContent;
