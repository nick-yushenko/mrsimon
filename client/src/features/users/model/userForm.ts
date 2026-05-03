import type { UserDetails } from "@/entities/user/model/types";
import type { EntityFieldConfig } from "@/shared/ui/entityView";
import z from "zod";

export const userDetailsSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(1, "Введите имя"),
  lastName: z.string().min(1, "Введите фамилию"),
  email: z.string().min(1, "Введите email").pipe(z.email("Некорректный email")),
  role: z.enum(["Admin", "Teacher", "Student", "User"]),
  createdAt: z.string().min(1, "Укажите дату создания"),
  updatedAt: z.string().min(1, "Укажите дату обновления"),
  note: z.string().optional(),
});

export const userDetailsFields: EntityFieldConfig<UserDetails>[] = [
  { key: "name", label: "Имя", kind: "text", editable: true, autoComplete: true },
  { key: "lastName", label: "Фамилия", kind: "text", editable: true, autoComplete: false },
  { key: "email", label: "Email", kind: "email", editable: true },
  {
    key: "role",
    label: "Роль",
    kind: "select",
    editable: true,
    options: [
      { label: "Администратор", value: "Admin" },
      { label: "Преподаватель", value: "Teacher" },
      { label: "Студент", value: "Student" },
      { label: "Пользователь", value: "User" },
    ],
  },
  {
    key: "note",
    label: "Комментарий",
    kind: "textarea",
    editable: true,
    placeholder: "Добавьте заметку о пользователе",
  },
];

export const toUserDetailsFormValues = (user: UserDetails): UserDetails => ({
  ...user,
  note: user.note ?? "",
});

export const normalizeUserDetailsFormValues = (values: UserDetails): UserDetails => ({
  ...values,
  name: values.name.trim(),
  lastName: values.lastName.trim(),
  email: values.email.trim(),
  note: values.note?.trim() ?? "",
});
