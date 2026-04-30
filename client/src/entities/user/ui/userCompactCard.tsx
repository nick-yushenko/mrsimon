"use client";

import { UserListItem } from "../model/types";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

type TProps = Omit<UserListItem, "id" | "role"> & {
  onClick?: () => void;
};

export const UserCompactCard = ({ name, lastName, email, onClick }: TProps) => {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      {/* TODO добавить автар */}
      <Avatar sx={{ width: 24, height: 24, fontSize: "0.875rem" }}>
        {name?.[0]}
        {lastName?.[0]}
      </Avatar>
      <Stack direction="column">
        <Typography
          variant="body2"
          component={"span"}
          onClick={onClick}
          sx={{
            "&:hover": {
              textDecoration: onClick ? "underline" : "none",
              cursor: onClick ? "pointer" : "default",
            },
          }}
        >
          {name} {lastName}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {email}
        </Typography>
      </Stack>
    </Stack>
  );
};
