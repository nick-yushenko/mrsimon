import type { GetStudyGroupsParams } from "../../../features/studyGroups/types";

import { useQuery } from "@tanstack/react-query";

import { studyGroupsQueryKeys } from "./queryKeys";
import { studyGroupsApi } from "../api/studyGroupsApi";

export const useStudyGroupListQuery = (params: Required<GetStudyGroupsParams>) => {
  return useQuery({
    queryKey: studyGroupsQueryKeys.list(params),
    queryFn: () => studyGroupsApi.getStudyGroups(params),
  });
};

export const useStudyGroupQuery = (id: number) => {
  return useQuery({
    queryKey: studyGroupsQueryKeys.detail(id),
    queryFn: () => studyGroupsApi.getStudyGroupById(id),
    enabled: !!id,
  });
};
