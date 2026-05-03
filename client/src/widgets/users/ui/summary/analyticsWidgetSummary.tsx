import type { CardProps } from "@mui/material/Card";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";

import { varAlpha } from "@/shared/theme/utils";
import { PaletteColorKey } from "@/shared/theme/themeConfig";
import { Chart, useChart, type ChartOptions } from "@/shared/ui/chart";
import { SvgColor } from "@/shared/ui/svg-color";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import { formatNumber, formatPercent, formatShortenNumber } from "@/shared/lib/format/number";
import { SkeletonIcon } from "@/shared/ui/skeleton/icon";
import { SkeletonTypography } from "@/shared/ui/skeleton/typography";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";

type Props = CardProps & {
  title: string;
  total: number | null;
  percent: number | null;
  color?: PaletteColorKey;
  iconSrc: string;
  isLoading?: boolean;
  chart: {
    series: number[];
    categories: string[];
    options?: ChartOptions;
  };
};

export function AnalyticsWidgetSummary({
  sx,
  iconSrc,
  title,
  total,
  chart,
  percent,
  isLoading = false,
  color = "primary",
  ...other
}: Props) {
  const theme = useTheme();

  const chartColors = [theme.palette[color].dark];
  const isPercentLoading = isLoading || percent === null;
  const isTotalLoading = isLoading || total === null;

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    xaxis: { categories: chart.categories },
    yaxis: { show: false },
    grid: {
      padding: {
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
      },
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft",
        offsetX: 0,
        offsetY: -75,
      },
      x: {
        show: true,
      },
      y: { formatter: (value: number) => formatNumber(value), title: { formatter: () => "" } },
    },
    markers: {
      strokeWidth: 0,
    },
    ...chart.options,
  });

  const renderTrending = useCallback(
    () => (
      <Box
        sx={{
          top: 16,
          gap: 0.5,
          right: 24,
          display: "flex",
          position: "absolute",
          alignItems: "center",
        }}
      >
        <SkeletonIcon loading={isPercentLoading} size={20}>
          {(percent ?? 0) < 0 ? (
            <TrendingDownRoundedIcon sx={{ fontSize: 20 }} />
          ) : (
            <TrendingUpRoundedIcon sx={{ fontSize: 20 }} />
          )}
        </SkeletonIcon>
        <SkeletonTypography
          variant="subtitle2"
          loading={isPercentLoading}
          skeletonWidth={48}
          sx={{ userSelect: "none" }}
        >
          {percent !== null && (
            <>
              {percent > 0 && "+"}
              {formatPercent(percent)}
            </>
          )}
        </SkeletonTypography>
      </Box>
    ),
    [isPercentLoading, percent],
  );

  return (
    <Card
      variant="plain"
      sx={[
        () => ({
          p: 3,
          flex: "unset",
          position: "relative",
          color: `${color}.darker`,
          backgroundColor: "common.white",
          backgroundImage: `linear-gradient(135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)})`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="img"
        src={iconSrc}
        alt={""}
        sx={{
          width: 48,
          height: 48,
          mb: 1,
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {renderTrending()}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112, maxWidth: 130 }}>
          <Typography variant="subtitle2" sx={{ lineHeight: "1rem", mb: 1 }}>
            {title}
          </Typography>

          <SkeletonTypography variant="h4" loading={isTotalLoading} skeletonWidth={96}>
            {total !== null ? formatShortenNumber(total) : null}
          </SkeletonTypography>
        </Box>

        <Chart
          type="line"
          series={[{ data: chart.series }]}
          options={chartOptions}
          loading={isLoading}
          sx={{ width: 84, height: 56 }}
        />
      </Box>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: 0,
          height: 240,
          opacity: 0.24,
          position: "absolute",
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}
