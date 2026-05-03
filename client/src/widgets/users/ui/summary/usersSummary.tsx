"use client";

import { useEffect } from "react";

import { useUsersStore } from "@/features/users/model/usersStore";
import Stack from "@mui/material/Stack";
import { AnalyticsWidgetSummary } from "./analyticsWidgetSummary";
import { formatMonthFromParts } from "@/shared/lib/format/date";

export const UsersSummary = () => {
  const summary = useUsersStore((state) => state.summary);
  const isSummaryLoading = useUsersStore((state) => state.isSummaryLoading);

  const fetchSummary = useUsersStore((state) => state.fetchSummary);
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const monthlyCounts = summary?.monthlyCounts ?? [];

  return (
    <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
      <AnalyticsWidgetSummary
        title="Пользователей"
        percent={summary?.monthlyGrowthPercent ?? null}
        total={summary?.total ?? null}
        color="secondary"
        iconSrc={"/assets/icons/glass/ic-glass-users.svg"}
        isLoading={isSummaryLoading}
        chart={{
          categories: monthlyCounts.map((item) => formatMonthFromParts(item.year, item.month)),
          series: monthlyCounts.map((item) => item.count),
        }}
        sx={{
          maxWidth: 300,
        }}
      />
      {/* <UsersSummaryCard
        data={summary?.total}
        isLoading={isSummaryLoading}
        error={summaryError}
        sx={{ maxWidth: 300, minWidth: 210 }}
      />
      <UsersSummaryCard data={summary?.total} isLoading={true} error={summaryError} />
      <UsersSummaryCard data={summary?.total} isLoading={false} error={"Ошибка загрузки данных"} /> */}
    </Stack>
  );
};
