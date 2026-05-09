import type { StudyGroupFormValues } from "../../../features/studyGroups/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { studyGroupsQueryKeys } from "./queryKeys";
import { studyGroupsApi } from "../api/studyGroupsApi";

export const useStudyGroupActions = () => {
  const queryClient = useQueryClient();

  const invalidate = {
    lists: () =>
      queryClient.invalidateQueries({
        queryKey: studyGroupsQueryKeys.lists(),
      }),
    detail: (id: number) =>
      queryClient.invalidateQueries({
        queryKey: studyGroupsQueryKeys.detail(id),
      }),
  } as const;

  const create = useMutation({
    mutationFn: studyGroupsApi.createStudyGroup,
    onSuccess: invalidate.lists,
  });

  const update = useMutation({
    mutationFn: ({ id, values }: { id: number; values: StudyGroupFormValues }) =>
      studyGroupsApi.updateStudyGroup(id, values),
    onSuccess: async (_data, variables) => {
      await Promise.all([invalidate.lists(), invalidate.detail(variables.id)]);
    },
  });

  const archive = useMutation({
    mutationFn: (id: number) => studyGroupsApi.archiveStudyGroup(id),
    onSuccess: async (_data, id) => {
      await Promise.all([invalidate.lists(), invalidate.detail(id)]);
    },
  });

  return {
    createStudyGroup: create.mutateAsync,
    updateStudyGroup: update.mutateAsync,
    archiveStudyGroup: archive.mutateAsync,

    isCreating: create.isPending,
    isUpdating: update.isPending,
    isArchiving: archive.isPending,

    createError: create.error,
    updateError: update.error,
    archiveError: archive.error,
  };
};
