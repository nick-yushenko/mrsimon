"use client";

import type { ReactNode } from "react";

import { useMemo, useState } from "react";

import Card from "@mui/material/Card";

import { AppTableContextProvider, APP_TABLE_DEFAULT_BODY_HEIGHT } from "./context";

export type AppTableProps = {
  body: ReactNode;
  bodyHeight?: number | string;
  defaultBodyHeightLimited?: boolean;
  pagination: ReactNode;
  toolbar: ReactNode;
};

export const AppTable = ({
  body,
  bodyHeight = APP_TABLE_DEFAULT_BODY_HEIGHT,
  defaultBodyHeightLimited = true,
  pagination,
  toolbar,
}: AppTableProps) => {
  const [isBodyHeightLimited, setIsBodyHeightLimited] = useState(defaultBodyHeightLimited);

  const tableContextValue = useMemo(
    () => ({
      bodyHeight,
      isBodyHeightLimited,
      toggleBodyHeightLimited: () => setIsBodyHeightLimited((current) => !current),
    }),
    [bodyHeight, isBodyHeightLimited],
  );

  return (
    <AppTableContextProvider value={tableContextValue}>
      <Card
        variant="plain"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          p: 0,
        }}
      >
        {toolbar}
        {body}
        {pagination}
      </Card>
    </AppTableContextProvider>
  );
};
