"use client";

import { LoginForm, LoginFormValues } from "@/features/auth/ui/loginForm";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuthStore } from "@/features/auth/model/authStore";
import { toast } from "react-toastify/unstyled";

const FORM_ID = "login-form";

type TProps = {
  open: boolean;
  onClose: () => void;
};
export const AddAccount = ({ open, onClose }: TProps) => {
  const loginUser = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const onSubmit = async (values: LoginFormValues) => {
    await toast.promise(loginUser(values), {
      pending: "Вход в аккаунта",
      success: {
        render({ data }) {
          return `Вы вошли, как ${data.name} ${data.lastName}`;
        },
      },
      error: "Не удалось войти в аккаунт",
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={"xs"}>
      <DialogTitle component={"div"}>
        <Typography component="h1" variant="h4">
          Добавить аккаунт
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <LoginForm formId={FORM_ID} onSubmit={onSubmit} />
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          pb: 3,
        }}
      >
        <Button type="button" variant="text" size="large" onClick={onClose}>
          отмена
        </Button>
        <Button
          type="submit"
          form={FORM_ID}
          variant="contained"
          loading={isLoading}
          loadingPosition="end"
          size="large"
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
