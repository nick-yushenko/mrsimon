"use client";

import type { GroupMember } from "@/entities/studyGroup/model/types";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

import { formatDate } from "@/shared/lib/format/date";
import { formatCurrency } from "@/shared/lib/format/number";

type TProps = Omit<GroupMember, "id" | "role"> & {
  onRemove: (userId: string) => void;
  isRemoving: boolean;
};

// TODO переделать на Chip
export const StudentCard = ({ onRemove, isRemoving, ...props }: TProps) => {
  const { userId, userLastName, userName, joinedAt, customPrice } = props;

  return (
    <Accordion>
      <AccordionSummary
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar sx={{ width: 30, height: 30, fontSize: "0.875rem" }}>
            {userName[0]}
            {userLastName[0]}
          </Avatar>
          <Typography
            variant="body2"
            component={"span"}
            sx={{
              fontSize: "0.875rem",
            }}
          >
            {userName} {userLastName}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Добавлен в группу: {formatDate(joinedAt)}</Typography>
        {customPrice === null && <Typography>цена: {formatCurrency(customPrice)}</Typography>}
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<PersonRemoveIcon />}
            size="medium"
            disabled={isRemoving}
            onClick={() => onRemove(userId)}
            color="error"
            sx={{ flex: 1 }}
          >
            Исключить
          </Button>
          <Button
            startIcon={<LockPersonIcon />}
            size="medium"
            disabled={isRemoving}
            onClick={() => onRemove(userId)}
            color="warning"
            sx={{ flex: 1 }}
          >
            Отключить
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
