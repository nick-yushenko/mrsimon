"use client";

import { useUsersStore } from "@/features/users/model/usersStore";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

const CounterCard = styled(Card)(({ theme }) => {
  return {
    position: "relative",
    backgroundColor: theme.palette.chart[100],
    backgroundPosition: "center center, center center",
    backgroundRepeat: "no-repeat, no-repeat",
    zIndex: 0,
    minHeight: 50,
    maxWidth: 300,
    minWidth: 210,
  };
});

export const UsersCounter = () => {
  const totalCount = useUsersStore((state) => state.totalCount);
  return (
    <CounterCard variant="plain">
      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-end" }}>
        <PeopleRoundedIcon
          sx={{
            fontSize: 42,
            color: "chart.200",
          }}
        />

        <Stack
          direction="column"
          spacing={1}
          sx={{ flex: 1, justifyContent: "space-between", alignItems: "cetnter" }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.25rem",
              color: "chart.200",
            }}
          >
            {totalCount}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.7rem",

              color: "chart.200",
              flex: 1,
            }}
          >
            Всего пользователей
          </Typography>
        </Stack>
      </Stack>
    </CounterCard>
  );
};
