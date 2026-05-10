import type { AddMemberRequest } from "./types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { studyGroupMembersQueryKeys } from "./queryKeys";
import { manageStudyGroupMembersApi } from "../api/manageStudyGroupMembersApi";

// TODO rename - неудачное незвание, слишком длинное
export const useManageStudyGroupMembersActions = () => {
  const queryClient = useQueryClient();

  // TODO добавить инвалидацию для groupDetail и возможно для списка групп
  const invalidate = {
    list: (id: number) =>
      queryClient.invalidateQueries({
        queryKey: studyGroupMembersQueryKeys.groupLists(id),
      }),
  } as const;

  const add = useMutation({
    mutationFn: ({ groupId, member }: { groupId: number; member: AddMemberRequest }) =>
      manageStudyGroupMembersApi.addMember(groupId, member),
    onSuccess: async (_data, variables) => {
      await invalidate.list(variables.groupId);
    },
  });

  const remove = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: number; userId: string }) =>
      manageStudyGroupMembersApi.removeMember(groupId, userId),
    onSuccess: async (_data, variables) => {
      await invalidate.list(variables.groupId);
    },
  });

  return {
    addMember: add.mutateAsync,
    removeMember: remove.mutateAsync,

    isAdding: add.isPending,
    isRemoving: remove.isPending,

    addError: add.error,
    removeError: remove.error,
  };
};
