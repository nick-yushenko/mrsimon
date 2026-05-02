import { User, UserDetails, UserListItem } from "@/entities/user/model/types";
import { create } from "zustand";
import { usersApi } from "../api/usersApi";
import { GetUsersParams, UsersSummary } from "../types";

type UsersState = {
  items: UserListItem[];

  selectedUser: UserDetails | null;

  summary: UsersSummary | null;

  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  search: string;

  isLoading: boolean;
  isDetailsLoading: boolean;
  isSummaryLoading: boolean;

  error: string | null;
  detailsError: string | null;
  summaryError: string | null;

  fetchUsers: (params?: GetUsersParams) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  fetchSummary: () => Promise<void>;

  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;

  clearSelectedUser: () => void;
  clearError: () => void;
};

let usersRequestId = 0;

export const useUsersStore = create<UsersState>((set, get) => ({
  items: [],

  selectedUser: null,

  summary: null,

  page: 1,
  pageSize: 5,
  totalCount: 0,
  totalPages: 0,
  search: "",

  isLoading: false,
  isDetailsLoading: false,
  isSummaryLoading: false,

  error: null,
  detailsError: null,
  summaryError: null,

  fetchUsers: async (params) => {
    const requestId = ++usersRequestId;

    const currentState = get();

    const page = params?.page ?? currentState.page;
    const pageSize = params?.pageSize ?? currentState.pageSize;
    const search = params?.search ?? currentState.search;

    set({
      isLoading: true,
      error: null,
    });

    try {
      const result = await usersApi.getUsers({
        page,
        pageSize,
        search,
      });

      // race condition защита: при задержке ответ от сервера, старым запросам нельзя перезаписывать более свежие данные
      if (requestId !== usersRequestId) {
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
      if (requestId !== usersRequestId) {
        return;
      }
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Не удалось загрузить список пользователей",
      });
    }
  },

  fetchUserById: async (id) => {
    set({
      isDetailsLoading: true,
      detailsError: null,
    });

    try {
      const user = await usersApi.getUserById(id);

      set({
        selectedUser: user,
        isDetailsLoading: false,
      });
    } catch (error) {
      set({
        selectedUser: null,
        isDetailsLoading: false,
        detailsError: error instanceof Error ? error.message : "Не удалось загрузить пользователя",
      });
    }
  },

  fetchSummary: async () => {
    set({
      isSummaryLoading: true,
      summaryError: null,
    });

    try {
      const summary = await usersApi.getSummary();

      set({
        summary: summary,
        isSummaryLoading: false,
      });
    } catch (error) {
      set({
        summary: null,
        isSummaryLoading: false,
        summaryError: error instanceof Error ? error.message : "Ошибка при загрузке сводки",
      });
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

  clearSelectedUser: () => {
    set({
      selectedUser: null,
      detailsError: null,
    });
  },

  clearError: () => {
    set({
      error: null,
      detailsError: null,
    });
  },
}));
