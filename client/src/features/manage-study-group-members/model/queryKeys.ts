import type { GroupMemberRole } from "@/entities/studyGroup/model/types";

export const studyGroupMembersQueryKeys = {
  all: ["studyGroupMembers"],
  lists: () => [...studyGroupMembersQueryKeys.all, "list"] as const,
  // у каждой группы 2 списка, разделенных по ролям - учителя и студенты
  groupLists: (groupId: number) => [...studyGroupMembersQueryKeys.lists(), groupId] as const,
  list: (groupId: number, role: GroupMemberRole) =>
    [...studyGroupMembersQueryKeys.groupLists(groupId), role] as const,
};
