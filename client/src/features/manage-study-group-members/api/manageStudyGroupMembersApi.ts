import type { AddMemberRequest } from "../model/types";
import type { GroupMember, GroupMemberRole } from "@/entities/studyGroup/model/types";

import { apiClient } from "@/shared/api/apiClient";

export const manageStudyGroupMembersApi = {
  getMembers: async (groupId: number, role: GroupMemberRole): Promise<GroupMember[]> => {
    return apiClient.get<GroupMember[]>(`/api/study-groups/${groupId}/members?role=${role}`);
  },

  addMember: async (groupId: number, request: AddMemberRequest): Promise<void> => {
    return apiClient.post(`/api/study-groups/${groupId}/members`, request);
  },

  removeMember: async (groupId: number, userId: string): Promise<void> => {
    return apiClient.delete(`/api/study-groups/${groupId}/members/${userId}`);
  },
};
