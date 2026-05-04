import { formatMonthFromParts } from "@/shared/lib/format/date";
import { usersApi } from "@/features/users/api/usersApi";
import { StatsWidget } from "./ui/widget";
import { PaletteColorKey } from "@/shared/theme/themeConfig";

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
      iconSrc={"/assets/icons/glass/ic-glass-users-primary.svg"}
      chart={{
        categories: monthlyData.map((item) => formatMonthFromParts(item.year, item.month)),
        series: monthlyData.map((item) => item.count),
      }}
    />
  );
};
