import type { PaletteColorKey } from "@/shared/theme/themeConfig";

import { Suspense } from "react";

import Stack from "@mui/material/Stack";

import { TotalUsers } from "./total";
import { AnalyticWidgetLoading } from "./ui/widgetLoading";

// TODO добавить текущих и архивных пользователей + число посетителей (активные пользователи по неделям)
export const UsersAnalytics = () => {
  const colors: PaletteColorKey[] = ["primary", "secondary", "info", "success", "warning", "error"];
  return (
    <Stack direction="row" spacing={2} sx={{ width: "100%", flexWrap: "wrap" }}>
      {colors.map((color, index) => {
        return (
          <Suspense
            key={index}
            fallback={
              <AnalyticWidgetLoading
                title="Пользователей"
                color={color}
                iconSrc={"/assets/icons/glass/ic-glass-users-primary.svg"}
              />
            }
          >
            <TotalUsers color={color} />
          </Suspense>
        );
      })}
    </Stack>
  );
};
