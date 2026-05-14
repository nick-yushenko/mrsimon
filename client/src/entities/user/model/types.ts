// TODO переделать на профиль, и связывать его с пользователем
export type UserRole = "Admin" | "Teacher" | "Student" | "User";

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export type UserListItem = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type UserDetails = Omit<UserListItem, "id"> & {
  // TODO добавить новые поля
  avatar?: string;
  note?: string;
};

export type GetUsersParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole;
};

export type UsersSummary = {
  total: number;
  monthlyGrowthPercent: number;
  monthlyCounts: MonthlyUsersCount[];
};

// TODO возможно стоит вынетси в глобальный тип чтобы переиспользовать для различных чартов
export type MonthlyUsersCount = {
  year: number;
  month: number;
  count: number;
};
