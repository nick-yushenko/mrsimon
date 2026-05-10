"use client";

import type { ReactNode, HTMLAttributes } from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";

export type AppTableEmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  emptyDescription?: ReactNode;
  emptyTitle?: ReactNode;
};

export const AppTableEmptyState = ({
  emptyDescription = "Попробуйте изменить параметры поиска или добавить новую запись",
  emptyTitle = "Нет данных",
  ...rootProps
}: AppTableEmptyStateProps) => {
  return (
    <Stack
      {...rootProps}
      spacing={2}
      sx={{
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
        minHeight: 220,
        p: 3,
        textAlign: "center",
        color: "grey.300",
        userSelect: "none",
      }}
    >
      <ContentPasteSearchIcon
        sx={{
          width: 140,
          height: 140,
        }}
      />
      <Stack
        spacing={1}
        sx={{ alignItems: "center", maxWidth: 300, width: "100%", color: "text.secondary" }}
      >
        <Typography variant="subtitle1" sx={{ fontSize: "1.35rem" }}>
          {emptyTitle}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
          {emptyDescription}
        </Typography>
      </Stack>
    </Stack>
  );
};
