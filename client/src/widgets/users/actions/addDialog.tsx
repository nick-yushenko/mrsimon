"use client";

import type { User } from "@/entities/user/model/types";
import type { RegisterFormValues } from "@/features/auth/ui/registerForm";

import { toast } from "react-toastify/unstyled";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { useAuthStore } from "@/features/auth/model/authStore";
import { RegisterForm } from "@/features/auth/ui/registerForm";

const FORM_ID = "add-user-form";

type AddUserDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (user: User) => void;
};

export const AddDialog = ({ onClose, onSuccess, open }: AddUserDialogProps) => {
  const registerUser = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const onSubmit = async (values: RegisterFormValues) => {
    const user = await toast.promise(registerUser(values, false), {
      pending: "Добавление пользователя",
      success: {
        render({ data }) {
          return `Пользователь ${data.name} ${data.lastName} добавлен`;
        },
      },
      error: "Не удалось добавить пользователя",
    });

    onSuccess?.(user);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle component={"div"}>
        <Typography component="h1" variant="h4">
          Добавить пользователя
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <RegisterForm formId={FORM_ID} onSubmit={onSubmit} />
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          pb: 3,
        }}
      >
        <Button type="button" variant="text" size="large" onClick={onClose}>
          Отмена
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
