import type { StudyGroupDetails } from "@/entities/studyGroup/model/types";
import type { EntityFieldConfig } from "@/shared/ui/entityView";
import z from "zod";
import type { StudyGroupFormValues } from "../types";

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

export const studyGroupFormFields: EntityFieldConfig<StudyGroupFormValues>[] = [
  { key: "name", label: "Название", kind: "text", editable: true, autoComplete: false },
  {
    key: "description",
    label: "Описание",
    kind: "textarea",
    editable: true,
    placeholder: "Добавьте описание группы",
  },
  {
    // переделать на select
    key: "subjectId",
    label: "ID предмета",
    kind: "number",
    editable: true,
    autoComplete: false,
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
