import type { GetStudyGroupsParams } from "./types";

export const studyGroupsQueryKeys = {
  all: ["studyGroups"],
  lists: () => [...studyGroupsQueryKeys.all, "list"] as const,
  list: (params: Required<GetStudyGroupsParams>) =>
    [...studyGroupsQueryKeys.lists(), params] as const,
  details: () => [...studyGroupsQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...studyGroupsQueryKeys.details(), String(id)] as const,
};
