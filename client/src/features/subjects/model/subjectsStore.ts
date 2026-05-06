import type { CreateSubjectRequest } from "../types";
import type { Subject } from "@/entities/subject/model/types";

import { create } from "zustand";

import { getApiErrorMessage } from "@/shared/api/apiError";

import { subjectsApi } from "../api/subjectsApi";

type SubjectsState = {
  items: Subject[];
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  error: string | null;

  fetchSubjects: () => Promise<void>;
  createSubject: (values: CreateSubjectRequest) => Promise<Subject>;
  deleteSubject: (id: number) => Promise<void>;
  clearError: () => void;
};

export const useSubjectsStore = create<SubjectsState>((set, get) => ({
  items: [],
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  error: null,

  fetchSubjects: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const subjects = await subjectsApi.getSubjects();

      set({
        items: subjects,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, "Не удалось загрузить дисциплины"),
      });
    }
  },

  createSubject: async (values) => {
    set({
      isSaving: true,
      error: null,
    });

    try {
      const subject = await subjectsApi.createSubject({
        name: values.name.trim(),
        description: values.description?.trim() || null,
      });

      set({
        isSaving: false,
      });

      await get().fetchSubjects();

      return subject;
    } catch (error) {
      set({
        isSaving: false,
        error: getApiErrorMessage(error, "Не удалось создать дисциплину"),
      });

      throw error;
    }
  },

  deleteSubject: async (id) => {
    set({
      isDeleting: true,
      error: null,
    });

    try {
      await subjectsApi.deleteSubject(id);

      set({
        isDeleting: false,
      });

      await get().fetchSubjects();
    } catch (error) {
      set({
        isDeleting: false,
        error: getApiErrorMessage(error, "Не удалось удалить дисциплину"),
      });

      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
