import type { GroupMemberRole } from "@/entities/studyGroup/model/types";

import { useQuery } from "@tanstack/react-query";

import { studyGroupMembersQueryKeys } from "./queryKeys";
import { manageStudyGroupMembersApi } from "../api/manageStudyGroupMembersApi";

export const useStudyGroupMemberListQuery = (groupId: number, role: GroupMemberRole) => {
  return useQuery({
    queryKey: studyGroupMembersQueryKeys.list(groupId, role),
    queryFn: () => manageStudyGroupMembersApi.getMembers(groupId, role),
  });
};
