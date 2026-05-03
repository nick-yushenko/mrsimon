export type GetStudyGroupsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  includeArchived?: boolean;
};

export type StudyGroupFormValues = {
  name: string;
  description?: string | null;
  subjectId: number;
  pricePerLesson: number;
  startsOn: string;
  endsOn: string;
};

export type CreateStudyGroupRequest = StudyGroupFormValues;

export type UpdateStudyGroupRequest = StudyGroupFormValues;
