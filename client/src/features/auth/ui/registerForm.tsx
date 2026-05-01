"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const registerSchema = z
  .object({
    name: z.string().min(1, "Введите имя"),
    lastName: z.string().min(1, "Введите фамилию"),
    email: z.string().min(1, "Введите email").pipe(z.email("Некорректный email")),
    password: z.string().min(8, "Пароль должен быть не короче 8 символов"),
    confirmPassword: z.string().min(1, "Повторите пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

type TProps = {
  formId: string;
  onSubmit: (values: RegisterFormValues) => Promise<void>;
};

export const RegisterForm = ({ formId, onSubmit }: TProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Box id={formId} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack direction="column" spacing={2} sx={{ justifyContent: "space-between" }}>
        <TextField
          fullWidth
          label="Имя"
          autoComplete="given-name"
          autoFocus
          variant="outlined"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register("name")}
        />

        <TextField
          fullWidth
          autoComplete="family-name"
          variant="outlined"
          label="Фамилия"
          error={Boolean(errors.lastName)}
          helperText={errors.lastName?.message}
          {...register("lastName")}
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          autoComplete="email"
          variant="outlined"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register("email")}
        />

        <TextField
          fullWidth
          label="Пароль"
          type="password"
          autoComplete="new-password"
          variant="outlined"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register("password")}
        />

        <TextField
          fullWidth
          label="Повторите пароль"
          type="password"
          autoComplete="new-password"
          variant="outlined"
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </Stack>
    </Box>
  );
};
