"use client";

import type { CardProps } from "@mui/material/Card";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";

import { varAlpha } from "@/shared/theme/utils";
import { PaletteColorKey } from "@/shared/theme/themeConfig";
import { Chart } from "@/shared/ui/chart";
import { SvgColor } from "@/shared/ui/svg-color";
import { SkeletonIcon } from "@/shared/ui/skeleton/icon";
import { SkeletonTypography } from "@/shared/ui/skeleton/typography";
import Typography from "@mui/material/Typography";

type Props = CardProps & {
  title: string;
  iconSrc: string;
  color?: PaletteColorKey;
};

export const StatsWidgetLoading = ({ title, iconSrc, color = "primary", sx, ...other }: Props) => {
  const theme = useTheme();

  const renderTrending = () => (
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
      <SkeletonIcon loading={true} size={20} />
      <SkeletonTypography loading={true} skeletonWidth={48} />
    </Box>
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

          <SkeletonTypography variant="h4" loading={true} skeletonWidth={96} />
        </Box>

        <Chart
          loading={true}
          sx={{ width: 84, height: 56 }}
          series={[{ data: [] }]}
          options={{
            xaxis: { categories: [] },
          }}
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
};
