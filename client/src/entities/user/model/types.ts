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

export type UserDetails = UserListItem & {
  // TODO добавить новые поля
};
