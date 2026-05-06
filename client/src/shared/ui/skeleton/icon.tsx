"use client";

import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";

import Box, { type BoxProps } from "@mui/material/Box";
import Skeleton, { type SkeletonProps } from "@mui/material/Skeleton";

type SkeletonIconProps = Omit<BoxProps, "children"> & {
  children?: ReactNode;
  loading?: boolean;
  size?: SkeletonProps["width"];
  skeletonProps?: Omit<SkeletonProps, "children" | "height" | "variant" | "width">;
  skeletonVariant?: SkeletonProps["variant"];
};

const toSxArray = (sx?: SxProps<Theme>) => (Array.isArray(sx) ? sx : [sx]);

export const SkeletonIcon = ({
  children,
  loading = false,
  size = 20,
  skeletonProps,
  skeletonVariant = "circular",
  sx,
  ...boxProps
}: SkeletonIconProps) => {
  const { sx: skeletonSx, ...restSkeletonProps } = skeletonProps ?? {};

  if (loading) {
    return (
      <Skeleton
        variant={skeletonVariant}
        width={size}
        height={size}
        sx={toSxArray(skeletonSx)}
        {...restSkeletonProps}
      />
    );
  }

  return (
    <Box
      component="span"
      sx={[
        {
          width: size,
          height: size,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        },
        ...toSxArray(sx),
      ]}
      {...boxProps}
    >
      {children}
    </Box>
  );
};
