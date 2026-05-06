"use client";

import type { StudyGroupFormValues } from "@/features/studyGroups/types";
import type { StudyGroupDetails } from "@/entities/studyGroup/model/types";

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
import { useStudyGroupsStore } from "@/features/studyGroups/model/studyGroupsStore";
import {
  studyGroupFormSchema,
  createStudyGroupFormFields,
  normalizeStudyGroupFormValues,
  createEmptyStudyGroupFormValues,
} from "@/features/studyGroups/model/studyGroupForm";

import { EntityView } from "@/shared/ui/entityView";

const FORM_ID = "add-study-group-form";

type AddStudyGroupDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (group: StudyGroupDetails) => void | Promise<void>;
};

// TODO refactor, запросы не должны идти в момент открытия диалогового окна. Запрос fetchSubjects, должен идти в момент открытия выпадающего списка
export const AddDialog = ({ open, onClose, onSuccess }: AddStudyGroupDialogProps) => {
  const subjects = useSubjectsStore((state) => state.items);
  const fetchSubjects = useSubjectsStore((state) => state.fetchSubjects);
  const createSubject = useSubjectsStore((state) => state.createSubject);

  const createStudyGroup = useStudyGroupsStore((state) => state.createStudyGroup);
  const saveError = useStudyGroupsStore((state) => state.saveError);
  const isSaving = useStudyGroupsStore((state) => state.isSaving);

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

    await onSuccess?.(group);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle component="div">
        <Typography component="h1" variant="h4">
          Создать группу
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {saveError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveError}
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
          loading={isSaving}
          loadingPosition="end"
          size="large"
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
