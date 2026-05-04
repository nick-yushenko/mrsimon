import { lazy, Suspense } from "react";

import { styled } from "@mui/material/styles";
import { useIsClient } from "@/shared/lib/hooks/useIsClient";

import { chartClasses } from "./classes";
import { ChartLoading } from "./components";

import type { ChartProps } from "./types";

import cn from "classnames";
import ApexChart from "react-apexcharts";
const LazyChart = lazy(() =>
  import("react-apexcharts").then((module) => ({ default: module.default })),
);

export function Chart({
  type,
  series,
  options,
  loading = false,
  slotProps,
  className,
  sx,
  ...other
}: ChartProps) {
  const isClient = useIsClient();

  const renderFallback = () => <ChartLoading type={type} sx={slotProps?.loading} />;

  return (
    <ChartRoot dir="ltr" className={cn([chartClasses.root, className])} sx={sx} {...other}>
      {isClient ? (
        <>
          {loading ? (
            renderFallback()
          ) : (
            <Suspense fallback={renderFallback()}>
              <LazyChart type={type} series={series} options={options} width="100%" height="100%" />
            </Suspense>
            // <ApexChart type={type} series={series} options={options} width="100%" height="100%" />
          )}
        </>
      ) : (
        renderFallback()
      )}
    </ChartRoot>
  );
}

const ChartRoot = styled("div")(({ theme }) => ({
  width: "100%",
  flexShrink: 0,
  position: "relative",
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));
