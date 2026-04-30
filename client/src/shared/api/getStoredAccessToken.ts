type StoredAuthSession = {
  sessionId: string;
  accessToken: string;
};

type PersistedAuthStorage = {
  state?: {
    sessions?: StoredAuthSession[];
    activeSessionId?: string | null;
  };
};

const AUTH_STORAGE_KEY = "auth-storage";

export const getStoredAccessToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PersistedAuthStorage;

    const activeSessionId = parsed.state?.activeSessionId;
    const sessions = parsed.state?.sessions ?? [];

    if (!activeSessionId) {
      return null;
    }

    return sessions.find((session) => session.sessionId === activeSessionId)?.accessToken ?? null;
  } catch {
    return null;
  }
};
