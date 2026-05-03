import { CreateSubjectRequest } from "../types";

export const createEmptySubject = (): CreateSubjectRequest => ({
  name: "",
  description: "",
});
