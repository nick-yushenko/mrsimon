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

const FORM_ID = "add-study-group-form";

type AddStudyGroupDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (group: StudyGroupDetails) => void;
};

// TODO refactor, запросы не должны идти в момент открытия диалогового окна. Запрос fetchSubjects, должен идти в момент открытия выпадающего списка
export const AddDialog = ({ open, onClose, onSuccess }: AddStudyGroupDialogProps) => {
  const { createStudyGroup, createError, isCreating } = useStudyGroupActions();

  // TODO убрать стор для subjects
  const subjects = useSubjectsStore((state) => state.items);
  const fetchSubjects = useSubjectsStore((state) => state.fetchSubjects);
  const createSubject = useSubjectsStore((state) => state.createSubject);

  useEffect(() => {
    if (open) {
      fetchSubjects();
    }
  }, [fetchSubjects, open]);

  const createSubjectFromAutocomplete = useCallback(
    async (name: string) => {
      return await toast.promise(createSubject({ name }), {
        pending: "Создание дисциплины",
        success: "Дисциплина создана",
        error: "Не удалось создать дисциплину",
      });
    },
    [createSubject],
  );

  const fields = useMemo(
    () =>
      createStudyGroupFormFields({
        subjects,
        onCreateSubject: createSubjectFromAutocomplete,
      }),
    [createSubjectFromAutocomplete, subjects],
  );

  const handleSubmit = async (values: StudyGroupFormValues) => {
    const group = await toast.promise(createStudyGroup(normalizeStudyGroupFormValues(values)), {
      pending: "Создание группы",
      success: {
        render({ data }) {
          return `Группа ${data.name} создана`;
        },
      },
      error: "Не удалось создать группу",
    });

    onSuccess?.(group);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle component="div">
        <Typography component="h1" variant="h4">
          Создать группу
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {createError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {createError?.message ?? "Ошибка"}
          </Alert>
        )}

        <EntityView
          formId={FORM_ID}
          entity={createEmptyStudyGroupFormValues()}
          fields={fields}
          schema={studyGroupFormSchema}
          editable
          defaultEditMode
          actions="none"
          onSubmit={handleSubmit}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, pb: 3 }}>
        <Button type="button" variant="text" size="large" onClick={onClose}>
          Отмена
        </Button>
        <Button
          type="submit"
          form={FORM_ID}
          variant="contained"
          loading={isCreating}
          loadingPosition="end"
          size="large"
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
