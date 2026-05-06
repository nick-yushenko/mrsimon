"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const loginSchema = z.object({
  email: z.string().min(1, "Введите email").pipe(z.email("Некорректный email")),
  password: z.string().min(8, "Пароль должен быть не короче 8 символов"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

type TProps = {
  formId: string;
  onSubmit: (values: LoginFormValues) => Promise<void>;
};

export const LoginForm = ({ formId, onSubmit }: TProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Box id={formId} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack direction="column" spacing={2}>
        <TextField
          fullWidth
          label="Логин"
          autoComplete="username"
          autoFocus
          variant="outlined"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register("email")}
        />

        <TextField
          fullWidth
          label="Пароль"
          type="password"
          autoComplete="current-password"
          variant="outlined"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register("password")}
        />
      </Stack>
    </Box>
  );
};
