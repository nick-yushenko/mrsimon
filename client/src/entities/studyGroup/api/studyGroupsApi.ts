import type { PagedResult } from "@/shared/api/types";
import type {
  StudyGroupDetails,
  StudyGroupListItem,
  GetStudyGroupsParams,
  CreateStudyGroupRequest,
  UpdateStudyGroupRequest,
} from "@/entities/studyGroup/model/types";

import { apiClient } from "@/shared/api/apiClient";

export const studyGroupsApi = {
  getStudyGroups: async ({
    page = 1,
    pageSize = 20,
    search = "",
    includeArchived = false,
  }: GetStudyGroupsParams = {}): Promise<PagedResult<StudyGroupListItem>> => {
    const searchParams = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      includeArchived: String(includeArchived),
    });

    if (search.trim()) {
      searchParams.set("search", search.trim());
    }

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // await sleep(3000);
    return apiClient.get<PagedResult<StudyGroupListItem>>(
      `/api/study-groups?${searchParams.toString()}`,
      {
        cache: "no-store",
      },
    );
  },

  getStudyGroupById: async (id: number): Promise<StudyGroupDetails> => {
    return apiClient.get<StudyGroupDetails>(`/api/study-groups/${id}`);
  },

  createStudyGroup: async (request: CreateStudyGroupRequest): Promise<StudyGroupDetails> => {
    return apiClient.post<StudyGroupDetails>("/api/study-groups", request);
  },

  updateStudyGroup: async (id: number, request: UpdateStudyGroupRequest): Promise<void> => {
    return apiClient.put<void>(`/api/study-groups/${id}`, request);
  },

  archiveStudyGroup: async (id: number): Promise<void> => {
    return apiClient.patch<void>(`/api/study-groups/${id}/archive`);
  },
};
