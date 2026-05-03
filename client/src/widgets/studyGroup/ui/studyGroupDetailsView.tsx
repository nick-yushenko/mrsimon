"use client";

import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify/unstyled";

import {
  StudyGroupView,
  type StudyGroupViewActions,
} from "@/entities/studyGroup/ui/studyGroupView";
import { useSubjectsStore } from "@/features/subjects/model/subjectsStore";
import { useStudyGroupsStore } from "@/features/studyGroups/model/studyGroupsStore";
import type { StudyGroupFormValues } from "@/features/studyGroups/types";

type StudyGroupDetailsViewProps = {
  id: string;
  variant?: "page" | "embedded";
};

export const StudyGroupDetailsView = ({ id, variant = "page" }: StudyGroupDetailsViewProps) => {
  const fetchStudyGroupById = useStudyGroupsStore((state) => state.fetchStudyGroupById);
  const updateStudyGroup = useStudyGroupsStore((state) => state.updateStudyGroup);
  const archiveStudyGroup = useStudyGroupsStore((state) => state.archiveStudyGroup);
  const subjects = useSubjectsStore((state) => state.items);
  const fetchSubjects = useSubjectsStore((state) => state.fetchSubjects);
  const createSubject = useSubjectsStore((state) => state.createSubject);

  const group = useStudyGroupsStore((state) => state.selectedGroup);
  const isLoading = useStudyGroupsStore((state) => state.isDetailsLoading);
  const isArchiving = useStudyGroupsStore((state) => state.isArchiving);
  const error = useStudyGroupsStore((state) => state.detailsError);

  useEffect(() => {
    fetchStudyGroupById(id);
  }, [fetchStudyGroupById, id]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const editGroup = useCallback(
    async (values: StudyGroupFormValues) => {
      await toast.promise(updateStudyGroup(id, values), {
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

    await fetchStudyGroupById(id);
  }, [archiveStudyGroup, fetchStudyGroupById, id]);

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
      group={group}
      isLoading={isLoading}
      isArchiving={isArchiving}
      error={error}
      variant={variant}
      subjects={subjects}
      actions={actions}
    />
  );
};
