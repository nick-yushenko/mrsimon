"use client";

import type { StudyGroupFormValues } from "@/features/studyGroups/types";

import { toast } from "react-toastify/unstyled";
import { useMemo, useEffect, useCallback } from "react";

import { useSubjectsStore } from "@/features/subjects/model/subjectsStore";

import { useStudyGroupQuery } from "@/entities/studyGroup/model/queries";
import { useStudyGroupActions } from "@/entities/studyGroup/model/actions";
import {
  StudyGroupView,
  type StudyGroupViewActions,
} from "@/entities/studyGroup/ui/studyGroupView";

type StudyGroupDetailsViewProps = {
  id: number;
  variant?: "page" | "embedded";
};

export const StudyGroup = ({ id, variant = "page" }: StudyGroupDetailsViewProps) => {
  const {
    archiveStudyGroup,
    updateStudyGroup,
    isUpdating,
    isArchiving,
    updateError,
    archiveError,
  } = useStudyGroupActions();

  const subjects = useSubjectsStore((state) => state.items);
  const fetchSubjects = useSubjectsStore((state) => state.fetchSubjects);
  const createSubject = useSubjectsStore((state) => state.createSubject);

  const queryById = useStudyGroupQuery(id);

  const group = queryById.data;

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const editGroup = useCallback(
    async (values: StudyGroupFormValues) => {
      await toast.promise(updateStudyGroup({ id, values }), {
        pending: "Сохранение группы",
        success: "Группа сохранена",
        error: "Не удалось сохранить группу",
      });
    },
    [id, updateStudyGroup],
  );

  const archiveGroup = useCallback(async () => {
    await toast.promise(archiveStudyGroup(id), {
      pending: "Архивация группы",
      success: "Группа отправлена в архив",
      error: "Не удалось архивировать группу",
    });
  }, [archiveStudyGroup, id]);

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

  const actions = useMemo<StudyGroupViewActions>(
    () => ({
      edit: editGroup,
      archive: archiveGroup,
      createSubject: createSubjectFromAutocomplete,
    }),
    [archiveGroup, createSubjectFromAutocomplete, editGroup],
  );

  return (
    <StudyGroupView
      id={id}
      group={group ?? null}
      isLoading={isUpdating}
      isArchiving={isArchiving}
      // TODO доработать ошибки в useStudyGroupActions
      error={updateError?.message || archiveError?.message}
      variant={variant}
      subjects={subjects}
      actions={actions}
    />
  );
};
