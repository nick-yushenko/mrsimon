"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import { useStudyGroupsStore } from "@/features/studyGroups/model/studyGroupsStore";

import { ResizableDrawer } from "@/shared/ui/resizableDrawer";

import { StudyGroup } from "../studyGroup";

export const StudyGroupPreview = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const groupId = searchParams.get("groupId");
  const isDetailsOpen = Boolean(groupId);

  const clearSelectedGroup = useStudyGroupsStore((state) => state.clearSelectedGroup);

  const closeGroupDetails = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("groupId");

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  useEffect(() => {
    if (!groupId) {
      clearSelectedGroup();
    }
  }, [groupId, clearSelectedGroup]);

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
