"use client";

import type { Theme, SxProps } from "@mui/material/styles";

import Skeleton, { type SkeletonProps } from "@mui/material/Skeleton";
import Typography, { type TypographyProps } from "@mui/material/Typography";

type SkeletonTypographyProps = TypographyProps & {
  loading?: boolean;
  skeletonHeight?: SkeletonProps["height"];
  skeletonProps?: Omit<SkeletonProps, "children" | "height" | "variant" | "width">;
  skeletonVariant?: SkeletonProps["variant"];
  skeletonWidth?: SkeletonProps["width"];
};

const toSxArray = (sx?: SxProps<Theme>) => (Array.isArray(sx) ? sx : [sx]);

export const SkeletonTypography = ({
  children,
  loading = false,
  skeletonHeight,
  skeletonProps,
  skeletonVariant = "text",
  skeletonWidth = "100%",
  sx,
  variant = "body1",
  ...typographyProps
}: SkeletonTypographyProps) => {
  if (loading) {
    const { sx: skeletonSx, ...restSkeletonProps } = skeletonProps ?? {};

    return (
      <Skeleton
        variant={skeletonVariant}
        width={skeletonWidth}
        height={skeletonHeight}
        sx={[
          (theme) => ({
            ...(variant === "inherit"
              ? undefined
              : (theme.typography as unknown as Record<string, object>)[variant]),
            transform: skeletonVariant === "text" ? "none" : undefined,
          }),
          ...toSxArray(sx),
          ...toSxArray(skeletonSx),
        ]}
        {...restSkeletonProps}
      />
    );
  }

  return (
    <Typography variant={variant} sx={sx} {...typographyProps}>
      {children}
    </Typography>
  );
};
