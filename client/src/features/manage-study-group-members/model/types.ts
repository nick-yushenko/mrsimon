import type { GroupMemberRole } from "@/entities/studyGroup/model/types";

export type AddMemberRequest = {
  userId: string;
  role: GroupMemberRole;
  customPrice?: number;
};
