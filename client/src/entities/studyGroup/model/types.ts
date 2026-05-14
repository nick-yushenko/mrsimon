export type GroupStatus = "Active" | "Archived";

export type GroupMemberRole = "Student" | "Teacher";

export type GroupMember = {
  id: number;
  userId: string;
  userName: string;
  userLastName: string;
  userNote: string;
  role: GroupMemberRole;
  customPrice: number | null;
  joinedAt: string;
};

export type StudyGroupListItem = {
  id: number;
  name: string;
  description?: string | null;
  subjectId: number;
  subjectName: string;
  pricePerLesson: number;
  startsOn: string;
  endsOn: string;
  status: GroupStatus;
  studentsCount: number;
  createdAt: string;
};

export type StudyGroupDetails = StudyGroupListItem & {
  members: GroupMember[];
  updatedAt: string;
};

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
