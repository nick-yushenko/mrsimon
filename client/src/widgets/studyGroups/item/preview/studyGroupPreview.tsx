"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import { ResizableDrawer } from "@/shared/ui/resizableDrawer";

import { StudyGroup } from "../studyGroup";

export const StudyGroupPreview = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const groupId = Number(searchParams.get("groupId"));
  const isDetailsOpen = Boolean(groupId);

  const closeGroupDetails = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("groupId");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <Box>
      <ResizableDrawer
        anchor="right"
        open={isDetailsOpen}
        onClose={closeGroupDetails}
        defaultSize={500}
        minSize={340}
        maxSize={theme.breakpoints.values.md - 1}
        slotProps={{
          paper: {
            sx: {
              containerType: "inline-size",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box sx={{ overflowY: "auto", p: 2 }}>
          {groupId && <StudyGroup id={groupId} variant="embedded" />}
        </Box>
      </ResizableDrawer>
    </Box>
  );
};
