import type { User } from "@/entities/user/model/types";
import type { AuthResponse } from "@/features/auth/types";
import type { RegisterRequest } from "@/features/auth/types";

import { mockUsers } from "@/shared/api/mock/users";

export const isAuth = true;
export const isServerError = false;

// Меняй индекс, если нужно руками переключить ответ /me без логина.
export const currentUserIndex = 0;

export const authResponses: AuthResponse[] = [
  {
    accessToken: "mock-access-token-ivan",
    user: {
      id: "4a42f1a2-48c1-4c88-a0a7-a9a001000001",
      name: "Иван",
      lastName: "Иванов",
      email: "ivan@mail.ru",
      role: "User",
    },
  },
  {
    accessToken: "mock-access-token-anna",
    user: {
      id: "4a42f1a2-48c1-4c88-a0a7-a9a001000002",
      name: "Анна",
      lastName: "Смирнова",
      email: "anna@mail.ru",
      role: "User",
    },
  },
  {
    accessToken: "mock-access-token-petr",
    user: {
      id: "4a42f1a2-48c1-4c88-a0a7-a9a001000003",
      name: "Петр",
      lastName: "Петров",
      email: "petr@mail.ru",
      role: "Admin",
    },
  },
];

export const getAuthResponseByEmail = (email: string) => {
  return (
    authResponses.find((response) => response.user.email === email.trim().toLowerCase()) ??
    authResponses[currentUserIndex]
  );
};

const addUserToMockUsers = (user: User) => {
  if (mockUsers.some((item) => item.id === user.id)) {
    return;
  }

  const now = new Date().toISOString();

  mockUsers.unshift({
    ...user,
    createdAt: now,
    updatedAt: now,
  });
};

export const registerMockUser = (data: RegisterRequest) => {
  const email = data.email.trim().toLowerCase();
  const existingResponse = authResponses.find((response) => response.user.email === email);

  if (existingResponse) {
    addUserToMockUsers(existingResponse.user);
    return existingResponse;
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: data.name,
    lastName: data.lastName,
    email,
    role: "User",
  };

  const response: AuthResponse = {
    accessToken: `mock-access-token-${user.id}`,
    user,
  };

  authResponses.push(response);
  addUserToMockUsers(user);

  return response;
};

export const getUserByAccessToken = (authorization: string | null) => {
  const accessToken = authorization?.replace("Bearer ", "");

  return (
    authResponses.find((response) => response.accessToken === accessToken)?.user ??
    authResponses[currentUserIndex].user
  );
};
