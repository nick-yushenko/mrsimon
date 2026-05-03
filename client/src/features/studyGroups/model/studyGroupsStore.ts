import type { StudyGroupDetails, StudyGroupListItem } from "@/entities/studyGroup/model/types";
import { getApiErrorMessage } from "@/shared/api/apiError";
import { create } from "zustand";
import { studyGroupsApi } from "../api/studyGroupsApi";
import type { GetStudyGroupsParams, StudyGroupFormValues } from "../types";

type StudyGroupsState = {
  items: StudyGroupListItem[];
  selectedGroup: StudyGroupDetails | null;

  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  search: string;
  includeArchived: boolean;

  isLoading: boolean;
  isDetailsLoading: boolean;
  isSaving: boolean;
  isArchiving: boolean;

  error: string | null;
  detailsError: string | null;
  saveError: string | null;

  fetchStudyGroups: (params?: GetStudyGroupsParams) => Promise<void>;
  fetchStudyGroupById: (id: string | number) => Promise<void>;
  createStudyGroup: (values: StudyGroupFormValues) => Promise<StudyGroupDetails>;
  updateStudyGroup: (id: string | number, values: StudyGroupFormValues) => Promise<void>;
  archiveStudyGroup: (id: string | number) => Promise<void>;

  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setIncludeArchived: (includeArchived: boolean) => void;

  clearSelectedGroup: () => void;
  clearError: () => void;
};

let studyGroupsRequestId = 0;

export const useStudyGroupsStore = create<StudyGroupsState>((set, get) => ({
  items: [],
  selectedGroup: null,

  page: 1,
  pageSize: 5,
  totalCount: 0,
  totalPages: 0,
  search: "",
  includeArchived: false,

  isLoading: false,
  isDetailsLoading: false,
  isSaving: false,
  isArchiving: false,

  error: null,
  detailsError: null,
  saveError: null,

  fetchStudyGroups: async (params) => {
    const requestId = ++studyGroupsRequestId;
    const currentState = get();

    const page = params?.page ?? currentState.page;
    const pageSize = params?.pageSize ?? currentState.pageSize;
    const search = params?.search ?? currentState.search;
    const includeArchived = params?.includeArchived ?? currentState.includeArchived;

    set({
      isLoading: true,
      error: null,
    });

    try {
      const result = await studyGroupsApi.getStudyGroups({
        page,
        pageSize,
        search,
        includeArchived,
      });

      // Защита от гонки запросов: старый ответ не должен перезаписать более свежий список.
      if (requestId !== studyGroupsRequestId) {
        return;
      }

      set({
        items: result.items,
        page: result.page,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        isLoading: false,
      });
    } catch (error) {
      if (requestId !== studyGroupsRequestId) {
        return;
      }

      set({
        isLoading: false,
        error: getApiErrorMessage(error, "Не удалось загрузить список групп"),
      });
    }
  },

  fetchStudyGroupById: async (id) => {
    set({
      isDetailsLoading: true,
      detailsError: null,
    });

    try {
      const group = await studyGroupsApi.getStudyGroupById(id);

      set({
        selectedGroup: group,
        isDetailsLoading: false,
      });
    } catch (error) {
      set({
        selectedGroup: null,
        isDetailsLoading: false,
        detailsError: getApiErrorMessage(error, "Не удалось загрузить группу"),
      });
    }
  },

  createStudyGroup: async (values) => {
    set({
      isSaving: true,
      saveError: null,
    });

    try {
      const group = await studyGroupsApi.createStudyGroup(values);

      set({
        selectedGroup: group,
        isSaving: false,
      });

      return group;
    } catch (error) {
      const message = getApiErrorMessage(error, "Не удалось создать группу");

      set({
        isSaving: false,
        saveError: message,
      });

      throw error;
    }
  },

  updateStudyGroup: async (id, values) => {
    set({
      isSaving: true,
      saveError: null,
    });

    try {
      await studyGroupsApi.updateStudyGroup(id, values);
      const group = await studyGroupsApi.getStudyGroupById(id);

      set({
        selectedGroup: group,
        isSaving: false,
      });

      await get().fetchStudyGroups();
    } catch (error) {
      const message = getApiErrorMessage(error, "Не удалось сохранить группу");

      set({
        isSaving: false,
        saveError: message,
      });

      throw error;
    }
  },

  archiveStudyGroup: async (id) => {
    set({
      isArchiving: true,
      saveError: null,
    });

    try {
      await studyGroupsApi.archiveStudyGroup(id);

      set({
        isArchiving: false,
      });

      await get().fetchStudyGroups();
    } catch (error) {
      const message = getApiErrorMessage(error, "Не удалось архивировать группу");

      set({
        isArchiving: false,
        saveError: message,
      });

      throw error;
    }
  },

  setPage: (page) => {
    set({ page });
  },

  setPageSize: (pageSize) => {
    set({ pageSize });
  },

  setSearch: (search) => {
    set({
      search,
      page: 1,
    });
  },

  setIncludeArchived: (includeArchived) => {
    set({
      includeArchived,
      page: 1,
    });
  },

  clearSelectedGroup: () => {
    set({
      selectedGroup: null,
      detailsError: null,
      saveError: null,
    });
  },

  clearError: () => {
    set({
      error: null,
      detailsError: null,
      saveError: null,
    });
  },
}));
