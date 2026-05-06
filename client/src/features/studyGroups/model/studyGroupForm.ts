import type { StudyGroupFormValues } from "../types";
import type { Subject } from "@/entities/subject/model/types";
import type { EntityFieldConfig } from "@/shared/ui/entityView";
import type { StudyGroupDetails } from "@/entities/studyGroup/model/types";

import z from "zod";

type StudyGroupSubjectOption = Pick<Subject, "id" | "name">;

type CreateStudyGroupFormFieldsOptions = {
  subjects: StudyGroupSubjectOption[];
  currentSubject?: StudyGroupSubjectOption | null;
  onCreateSubject?: (name: string) => Promise<StudyGroupSubjectOption> | StudyGroupSubjectOption;
};

export const studyGroupFormSchema = z
  .object({
    name: z.string().trim().min(1, "Введите название группы").max(120, "Не больше 120 символов"),
    description: z.string().nullable().optional(),
    subjectId: z.number().min(1, "Укажите ID предмета"),
    pricePerLesson: z.number().min(0, "Цена не может быть меньше 0"),
    startsOn: z.string().min(1, "Укажите дату начала"),
    endsOn: z.string().min(1, "Укажите дату окончания"),
  })
  .refine((values) => values.endsOn >= values.startsOn, {
    message: "Дата окончания должна быть больше или равна дате начала",
    path: ["endsOn"],
  });

export const createStudyGroupFormFields = ({
  subjects,
  currentSubject,
  onCreateSubject,
}: CreateStudyGroupFormFieldsOptions): EntityFieldConfig<StudyGroupFormValues>[] => {
  const subjectOptionsById = new Map<number, StudyGroupSubjectOption>();

  if (currentSubject) {
    subjectOptionsById.set(currentSubject.id, currentSubject);
  }

  subjects.forEach((subject) => {
    subjectOptionsById.set(subject.id, subject);
  });

  return [
    { key: "name", label: "Название", kind: "text", editable: true, autoComplete: false },
    {
      key: "description",
      label: "Описание",
      kind: "textarea",
      editable: true,
      placeholder: "Добавьте описание группы",
    },
    {
      key: "subjectId",
      label: "Дисциплина",
      kind: "select",
      editable: true,
      creatable: Boolean(onCreateSubject),
      placeholder: "Выберите или создайте дисциплину",
      options: Array.from(subjectOptionsById.values()).map((subject) => ({
        label: subject.name,
        value: subject.id,
      })),
      onCreateOption: onCreateSubject
        ? async (subjectName) => {
            const subject = await onCreateSubject(subjectName);

            return {
              label: subject.name,
              value: subject.id,
            };
          }
        : undefined,
    },
    {
      key: "pricePerLesson",
      label: "Цена за занятие",
      kind: "number",
      editable: true,
    },
    // TODO добавить кнопки хелперы
    { key: "startsOn", label: "Начало", kind: "date", editable: true },
    { key: "endsOn", label: "Окончание", kind: "date", editable: true },
  ];
};

export const createEmptyStudyGroupFormValues = (): StudyGroupFormValues => ({
  name: "",
  description: "",
  subjectId: 0,
  pricePerLesson: 0,
  startsOn: "",
  endsOn: "",
});

export const toStudyGroupFormValues = (group: StudyGroupDetails): StudyGroupFormValues => ({
  name: group.name,
  description: group.description ?? "",
  subjectId: group.subjectId,
  pricePerLesson: group.pricePerLesson,
  startsOn: group.startsOn,
  endsOn: group.endsOn,
});

export const normalizeStudyGroupFormValues = (
  values: StudyGroupFormValues,
): StudyGroupFormValues => ({
  ...values,
  name: values.name.trim(),
  description: values.description?.trim() || null,
});
