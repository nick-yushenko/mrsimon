"use client";

import type { RegisterFormValues } from "@/features/auth/ui/registerForm";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useAuthStore } from "@/features/auth/model/authStore";
import { RegisterForm } from "@/features/auth/ui/registerForm";

const FORM_ID = "register-page-form";

export const RegisterPageWidget = () => {
  const router = useRouter();

  const registerUser = useAuthStore((state) => state.register);

  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.getCurrentUser());

  const onSubmit = async (values: RegisterFormValues) => {
    await registerUser(values);
    router.replace("/users");
  };

  useEffect(() => {
    if (isInitialized && !isLoading && user) {
      router.replace("/users");
    }
  }, [isInitialized, isLoading, user, router]);

  return (
    <Card
      elevation={10}
      sx={{
        width: "100%",
        maxWidth: "400px",
        p: 3,
        zIndex: 3,
      }}
    >
      <Stack direction="column" spacing={3}>
        <Typography
          component="h1"
          variant="h4"
          sx={{
            textAlign: "center",
          }}
        >
          Регистрация
        </Typography>

        <RegisterForm formId={FORM_ID} onSubmit={onSubmit} />

        <Stack direction="column" spacing={1}>
          <Button
            fullWidth
            type="submit"
            form={FORM_ID}
            variant="contained"
            size="large"
            disabled={isLoading}
          >
            Зарегистрироваться
          </Button>
          <Button fullWidth href="/login" variant="text" size="large">
            Уже есть аккаунт
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};
