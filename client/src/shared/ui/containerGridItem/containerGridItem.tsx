"use client";

import { forwardRef } from "react";

import type { Breakpoint, CSSObject, Theme } from "@mui/material/styles";
import type { GridProps, GridSize } from "@mui/material/Grid";
import type { SxProps } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

export type ContainerGridSize = Partial<Record<Breakpoint, GridSize>>;

export type ContainerGridItemProps = Omit<GridProps, "size"> & {
  containerSize: ContainerGridSize;
};

const CONTAINER_BREAKPOINTS: Exclude<Breakpoint, "xs">[] = ["sm", "md", "lg", "xl"];

export const getContainerGridSpanStyles = (size: GridSize): CSSObject => {
  if (size === "grow") {
    return {
      flexBasis: 0,
      flexGrow: 1,
      maxWidth: "100%",
    };
  }

  if (size === "auto") {
    return {
      flexBasis: "auto",
      flexGrow: 0,
      flexShrink: 0,
      maxWidth: "none",
      width: "auto",
    };
  }

  if (typeof size === "number") {
    return {
      flexBasis: "auto",
      flexGrow: 0,
      width: `calc(100% * ${size} / var(--Grid-parent-columns) - (var(--Grid-parent-columns) - ${size}) * (var(--Grid-parent-columnSpacing) / var(--Grid-parent-columns)))`,
    };
  }

  return {};
};

const getContainerSizeSx =
  (containerSize: ContainerGridSize): SxProps<Theme> =>
  (theme) =>
    CONTAINER_BREAKPOINTS.reduce<CSSObject>((styles, breakpoint) => {
      const size = containerSize[breakpoint];

      if (size === undefined || size === false) {
        return styles;
      }

      styles[theme.containerQueries.up(breakpoint)] = getContainerGridSpanStyles(size);

      return styles;
    }, {});

export const ContainerGridItem = forwardRef<HTMLDivElement, ContainerGridItemProps>(
  ({ containerSize, sx, ...props }, ref) => {
    const baseSize = containerSize.xs ?? 12;
    const sxArray = Array.isArray(sx) ? sx : [sx];

    return (
      <Grid
        ref={ref}
        {...props}
        size={baseSize}
        sx={[getContainerSizeSx(containerSize), ...sxArray]}
      />
    );
  },
);

ContainerGridItem.displayName = "ContainerGridItem";
