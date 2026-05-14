"use client";

import type { StudyGroupDetails, StudyGroupFormValues } from "@/entities/studyGroup/model/types";

import { toast } from "react-toastify/unstyled";
import { useMemo, useEffect, useCallback } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { useSubjectsStore } from "@/features/subjects/model/subjectsStore";

import { useStudyGroupActions } from "@/entities/studyGroup/model/actions";
import {
  studyGroupFormSchema,
  createStudyGroupFormFields,
  normalizeStudyGroupFormValues,
  createEmptyStudyGroupFormValues,
} from "@/entities/studyGroup/model/studyGroupForm";

import { EntityView } from "@/shared/ui/entityView";
import { useUserListQuery } from "@/entities/user/model/queries";
import { Autocomplete } from "@mui/material";

const FORM_ID = "add-study-group-form";

type TProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (group: StudyGroupDetails) => void;
};

export const AddStudent = ({ open, onClose, onSuccess }: TProps) => {
  // const query = useUserListQuery();

  // const createSubjectFromAutocomplete = useCallback(
  //   async (name: string) => {
  //     return await toast.promise(createSubject({ name }), {
  //       pending: "Создание дисциплины",
  //       success: "Дисциплина создана",
  //       error: "Не удалось создать дисциплину",
  //     });
  //   },
  //   [createSubject],
  // );

  const handleSubmit = async (values: StudyGroupFormValues) => {
    // onSuccess?.();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h4">Создать группу</Typography>
      </DialogTitle>

      <DialogContent>
        <Autocomplete />
        {/* {createError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {createError?.message ?? "Ошибка"}
          </Alert>
        )} */}

        {/* <EntityView
          formId={FORM_ID}
          entity={createEmptyStudyGroupFormValues()}
          fields={fields}
          schema={studyGroupFormSchema}
          editable
          defaultEditMode
          actions="none"
          onSubmit={handleSubmit}
        /> */}
      </DialogContent>

      <DialogActions>
        <Button type="button" variant="text" size="large" onClick={onClose}>
          Отмена
        </Button>
        <Button
          type="submit"
          form={FORM_ID}
          variant="contained"
          // loading={isCreating}
          loadingPosition="end"
          size="large"
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
