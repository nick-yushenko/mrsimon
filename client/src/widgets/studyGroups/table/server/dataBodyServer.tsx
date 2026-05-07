import type { PagedResult } from "@/shared/api/types";
import type { StudyGroupListItem } from "@/entities/studyGroup/model/types";

import { StudyGroupsDataBody } from "../ui/dataBody";

type StudyGroupsDataBodyServerProps = {
  dataPromise: Promise<PagedResult<StudyGroupListItem>>;
};

export const StudyGroupsDataBodyServer = async ({
  dataPromise,
}: StudyGroupsDataBodyServerProps) => {
  const data = await dataPromise;
  return <StudyGroupsDataBody data={data} />;
};
