import type { CreateSubjectRequest } from "../types";
import type { Subject } from "@/entities/subject/model/types";

import { apiClient } from "@/shared/api/apiClient";

export const subjectsApi = {
  getSubjects: async (): Promise<Subject[]> => {
    return apiClient.get<Subject[]>("/api/subjects");
  },

  createSubject: async (request: CreateSubjectRequest): Promise<Subject> => {
    return apiClient.post<Subject>("/api/subjects", request);
  },

  deleteSubject: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/api/subjects/${id}`);
  },
};
