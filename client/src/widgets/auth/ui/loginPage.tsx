"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/model/authStore";
import { LoginForm, LoginFormValues } from "@/features/auth/ui/loginForm";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

const FORM_ID = "login-page-form";

export const LoginPageWidget = () => {
  const router = useRouter();

  const loginUser = useAuthStore((state) => state.login);

  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.getCurrentUser());

  const onSubmit = async (values: LoginFormValues) => {
    await loginUser(values);

    router.push("/profile");
  };

  useEffect(() => {
    if (isInitialized && !isLoading && user) {
      router.replace("/profile");
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
          Вход
        </Typography>
        <LoginForm formId={FORM_ID} onSubmit={onSubmit} />

        <Box>
          <Button fullWidth type="submit" form={FORM_ID} variant="contained" size="large">
            Войти
          </Button>
          <Button fullWidth href="/register" variant="text" size="medium">
            Регистрация
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};
