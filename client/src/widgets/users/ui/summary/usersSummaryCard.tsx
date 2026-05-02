"use client";

import { useUsersStore } from "@/features/users/model/usersStore";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { type SxProps, type Theme } from "@mui/material/styles";

type TProps = {
  // TODO типизировать summary более детально. сюда будет передаваться 1 элемент из summary а не весь summary
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  isLoading: boolean;
  sx?: SxProps<Theme>;
};
export const UsersSummaryCard = ({ data, isLoading, sx }: TProps) => {
  return (
    <Card
      variant="plain"
      sx={[
        (theme) => ({
          position: "relative",
          backgroundColor: theme.palette.chart[100],
          backgroundPosition: "center center, center center",
          backgroundRepeat: "no-repeat, no-repeat",
          zIndex: 0,
          minHeight: 50,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
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
          {isLoading ? (
            <Skeleton variant="text" sx={{ fontSize: "1.25rem" }} />
          ) : (
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.25rem",
                color: "chart.200",
              }}
            >
              {data}
            </Typography>
          )}

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
    </Card>
  );
};
