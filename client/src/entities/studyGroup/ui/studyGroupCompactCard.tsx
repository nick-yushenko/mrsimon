"use client";

import type { StudyGroupListItem } from "@/entities/studyGroup/model/types";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

type StudyGroupCompactCardProps = StudyGroupListItem & {
  onClick?: () => void;
};

export const StudyGroupCompactCard = ({
  name,
  subjectName,
  description,
  onClick,
}: StudyGroupCompactCardProps) => {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      onClick={onClick}
      sx={{
        alignItems: "center",
        minWidth: 0,
        width: "100%",
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 40,
          height: 40,
          bgcolor: "primary.lighter",
          color: "primary.main",
        }}
      >
        <SchoolRoundedIcon fontSize="small" />
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap component="div">
          {subjectName || description || "Предмет не указан"}
        </Typography>
      </Box>
    </Stack>
  );
};
