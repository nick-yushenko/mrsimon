"use client";

import { useEffect } from "react";

import { useUsersStore } from "@/features/users/model/usersStore";
import Stack from "@mui/material/Stack";
import { UsersSummaryCard } from "./usersSummaryCard";

export const UsersSummary = () => {
  const summary = useUsersStore((state) => state.summary);
  const isSummaryLoading = useUsersStore((state) => state.isSummaryLoading);

  const fetchSummary = useUsersStore((state) => state.fetchSummary);
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);
  return (
    <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
      <UsersSummaryCard
        data={summary?.total}
        isLoading={isSummaryLoading}
        sx={{ maxWidth: 300, minWidth: 210 }}
      />
      <UsersSummaryCard data={summary?.total} isLoading={true} />
      <UsersSummaryCard data={summary?.total} isLoading={false} />
    </Stack>
  );
};
