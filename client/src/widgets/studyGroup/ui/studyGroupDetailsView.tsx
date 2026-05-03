"use client";

import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify/unstyled";

import {
  StudyGroupView,
  type StudyGroupViewActions,
} from "@/entities/studyGroup/ui/studyGroupView";
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

  const group = useStudyGroupsStore((state) => state.selectedGroup);
  const isLoading = useStudyGroupsStore((state) => state.isDetailsLoading);
  const isArchiving = useStudyGroupsStore((state) => state.isArchiving);
  const error = useStudyGroupsStore((state) => state.detailsError);

  useEffect(() => {
    fetchStudyGroupById(id);
  }, [fetchStudyGroupById, id]);

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

  const actions = useMemo<StudyGroupViewActions>(
    () => ({
      edit: editGroup,
      archive: archiveGroup,
    }),
    [archiveGroup, editGroup],
  );

  return (
    <StudyGroupView
      id={id}
      group={group}
      isLoading={isLoading}
      isArchiving={isArchiving}
      error={error}
      variant={variant}
      actions={actions}
    />
  );
};
