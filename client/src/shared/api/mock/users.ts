import { UserDetails } from "@/entities/user/model/types";

const roles: UserDetails["role"][] = ["Student", "Teacher", "Admin"];

export const mockUsers: UserDetails[] = Array.from({ length: 200 }, (_, index) => {
  const userNumber = index + 1;
  const day = String((index % 28) + 1).padStart(2, "0");

  return {
    id: `${String(userNumber).padStart(8, "0")}-1111-1111-1111-111111111111`,
    name: `User${userNumber}`,
    lastName: `Lastname${userNumber}`,
    email: `user${userNumber}@example.com`,
    role: roles[index % roles.length],
    createdAt: `2026-04-${day}T10:00:00.000Z`,
    updatedAt: `2026-04-${day}T10:00:00.000Z`,
    note:
      index % 3 === 0 ? "Пользователь требует дополнительного внимания по учебному прогрессу." : "",
  };
});
