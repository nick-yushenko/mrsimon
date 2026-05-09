import type { PaletteColorKey } from "@/shared/theme/themeConfig";

import { usersApi } from "@/entities/user/api/usersApi";

import { formatMonthFromParts } from "@/shared/lib/format/date";

import { StatsWidget } from "./ui/widget";

type TProps = {
  color?: PaletteColorKey;
};

export const TotalUsersStat = async ({ color }: TProps) => {
  const data = await usersApi.getSummary();
  const monthlyData = data?.monthlyCounts ?? [];

  return (
    <StatsWidget
      title="Пользователей"
      percent={data.monthlyGrowthPercent}
      total={data.total}
      color={color}
      iconSrc={`/assets/icons/glass/ic-glass-users-${color}.svg`}
      chart={{
        categories: monthlyData.map((item) => formatMonthFromParts(item.year, item.month)),
        series: monthlyData.map((item) => item.count),
      }}
    />
  );
};
