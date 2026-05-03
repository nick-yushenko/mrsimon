export type GroupStatus = "Active" | "Archived";

export type GroupMemberRole = "Student" | "Teacher";

export type GroupMember = {
  id: number;
  userId: string;
  userName: string;
  userLastName: string;
  role: GroupMemberRole;
  customPrice?: number | null;
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
