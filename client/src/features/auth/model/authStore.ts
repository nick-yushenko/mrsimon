import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "@/entities/user/model/types";
import { authApi } from "../api/authApi";
import {
  getApiErrorMessage,
  isInvalidSessionError,
  isTemporaryAuthCheckError,
} from "@/shared/api/apiError";
import { AuthResponse, AuthSession, LoginRequest, RegisterRequest, SessionId } from "../types";

type AuthState = {
  sessions: AuthSession[];
  activeSessionId: SessionId | null;

  accounts: Record<SessionId, User>;

  isLoading: boolean;
  isInitialized: boolean;
  hasHydrated: boolean;
  error: string | null;

  // getters
  getActiveSession: () => AuthSession | null;
  getAccessToken: () => string | null;
  getCurrentUser: () => User | null;
  getAccountBySessionId: (sessionId: SessionId) => User | null;

  // actions
  setHasHydrated: () => void;
  initialize: () => Promise<void>;

  fetchCurrentAccount: () => Promise<User | null>;
  fetchAccountBySessionId: (sessionId: SessionId) => Promise<User | null>;
  fetchAccounts: () => Promise<void>;

  login: (data: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest, signInAfterRegister?: boolean) => Promise<User>;

  switchSession: (sessionId: SessionId) => Promise<User | null>;

  logoutCurrent: () => void;
  logoutSession: (sessionId: SessionId) => void;
  logoutAll: () => void;

  clearError: () => void;
};

const createSession = (response: AuthResponse): AuthSession => {
  return {
    sessionId: crypto.randomUUID(),
    accessToken: response.accessToken,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,

      accounts: {},

      isLoading: false,
      isInitialized: false,
      hasHydrated: false,
      error: null,

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();

        if (!activeSessionId) {
          return null;
        }

        return sessions.find((session) => session.sessionId === activeSessionId) ?? null;
      },

      getAccessToken: () => {
        return get().getActiveSession()?.accessToken ?? null;
      },

      getCurrentUser: () => {
        const activeSessionId = get().activeSessionId;

        if (!activeSessionId) {
          return null;
        }

        return get().accounts[activeSessionId] ?? null;
      },

      getAccountBySessionId: (sessionId) => {
        return get().accounts[sessionId] ?? null;
      },

      setHasHydrated: () => {
        set({ hasHydrated: true });
      },

      initialize: async () => {
        // Важно: persist гидратирует state асинхронно.
        // Если вызвать initialize до гидрации, можно затереть сохранённые sessions пустым массивом.
        if (!get().hasHydrated) {
          await new Promise<void>((resolve) => {
            const unsubscribe = useAuthStore.subscribe((state) => {
              if (!state.hasHydrated) {
                return;
              }

              unsubscribe();
              resolve();
            });
          });
        }

        const { sessions, activeSessionId } = get();

        set({
          isLoading: true,
          error: null,
        });

        // Копия массива, где текущая сессия всегда имеет позицию 0
        const orderedSessions = [
          ...sessions.filter((session) => session.sessionId === activeSessionId),
          ...sessions.filter((session) => session.sessionId !== activeSessionId),
        ];

        const validSessions: AuthSession[] = [];
        const accounts: Record<SessionId, User> = {};
        const usedUserIds = new Set<string>();

        for (const session of orderedSessions) {
          try {
            const user = await authApi.me(session.accessToken);

            const isDuplicateUser = usedUserIds.has(user.id);

            if (isDuplicateUser) {
              continue;
            }

            usedUserIds.add(user.id);
            validSessions.push(session);
            accounts[session.sessionId] = user;
          } catch (error) {
            if (isInvalidSessionError(error)) {
              // токен протух / пользователь удалён / доступ запрещён
              // сессию просто не добавляем в validSessions
              continue;
            }

            if (isTemporaryAuthCheckError(error)) {
              // backend/network временно недоступен
              // НЕ удаляем сессии
              set({
                isInitialized: true,
                isLoading: false,
                error: "Не удалось проверить авторизацию. Попробуйте обновить страницу.",
              });

              return;
            }

            throw error;
          }
        }

        const nextActiveSessionId = validSessions[0]?.sessionId ?? null;

        set({
          sessions: validSessions,
          activeSessionId: nextActiveSessionId,
          accounts,
          isInitialized: true,
          isLoading: false,
          error: null,
        });
      },

      fetchCurrentAccount: async () => {
        const activeSession = get().getActiveSession();

        if (!activeSession) {
          return null;
        }

        return get().fetchAccountBySessionId(activeSession.sessionId);
      },

      fetchAccountBySessionId: async (sessionId) => {
        const session = get().sessions.find((session) => session.sessionId === sessionId);

        if (!session) {
          return null;
        }

        try {
          const user = await authApi.me(session.accessToken);

          set((state) => ({
            accounts: {
              ...state.accounts,
              [sessionId]: user,
            },
          }));

          return user;
        } catch {
          get().logoutSession(sessionId);
          return null;
        }
      },

      fetchAccounts: async () => {
        const { sessions } = get();

        // Ошибки внутри fetchAccountBySessionId не пробрасываются:
        // невалидные сессии будут удалены, а результатом будет null.
        await Promise.all(
          sessions.map((session) => get().fetchAccountBySessionId(session.sessionId)),
        );
      },

      login: async (data) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const response = await authApi.login(data);
          // Нужна ли проверка что такого пользователя еще нет в списке сессий ??
          const newSession = createSession(response);

          set((state) => ({
            sessions: [...state.sessions, newSession],
            activeSessionId: newSession.sessionId,
            accounts: {
              ...state.accounts,
              [newSession.sessionId]: response.user,
            },
            isLoading: false,
            isInitialized: true, // Как будто бы ставить true не верно, так как другие сессии еще не были проверены. важно чтобы для текущей сессии не было 2 запроса
            error: null,
          }));

          return response.user;
        } catch (error) {
          set({
            isLoading: false,
            error: getApiErrorMessage(error, "Ошибка авторизации"),
          });

          throw error;
        }
      },

      register: async (data, signInAfterRegister = true) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const response = await authApi.register(data);
          if (signInAfterRegister) {
            const newSession = createSession(response);

            set((state) => ({
              sessions: [...state.sessions, newSession],
              activeSessionId: newSession.sessionId,
              accounts: {
                ...state.accounts,
                [newSession.sessionId]: response.user,
              },
            }));
          }

          set(() => ({
            isLoading: false,
            isInitialized: true,
            error: null,
          }));

          return response.user;
        } catch (error) {
          set({
            isLoading: false,
            error: getApiErrorMessage(error, "Ошибка регистрации"),
          });

          throw error;
        }
      },

      switchSession: async (sessionId) => {
        const session = get().sessions.find((session) => session.sessionId === sessionId);

        if (!session) {
          return null;
        }

        set({
          activeSessionId: sessionId,
          error: null,
        });

        const alreadyLoadedAccount = get().accounts[sessionId];

        if (alreadyLoadedAccount) {
          return null;
        }

        return get().fetchAccountBySessionId(sessionId);
      },

      logoutCurrent: () => {
        const activeSessionId = get().activeSessionId;

        if (!activeSessionId) {
          return;
        }

        get().logoutSession(activeSessionId);
      },

      logoutSession: (sessionId) => {
        const { sessions, activeSessionId, accounts } = get();

        const newSessions = sessions.filter((session) => session.sessionId !== sessionId);

        const newAccounts = { ...accounts };
        delete newAccounts[sessionId];

        // Излишняя логика, так как по UX можно выйти только из акивного аккаунта
        const shouldReplaceActiveSession = activeSessionId === sessionId;

        set({
          sessions: newSessions,
          activeSessionId: shouldReplaceActiveSession
            ? (newSessions[0]?.sessionId ?? null)
            : activeSessionId,
          accounts: newAccounts,
          error: null,
        });
      },

      logoutAll: () => {
        set({
          sessions: [],
          activeSessionId: null,
          accounts: {},
          error: null,
          isInitialized: true,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated();
      },
    },
  ),
);
