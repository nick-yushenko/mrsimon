import type { PagedResult } from "@/shared/api/types";
import type { StudyGroupListItem } from "@/entities/studyGroup/model/types";

import { StudyGroupsPagination } from "../ui/pagination";

type StudyGroupsPaginationServerProps = {
  dataPromise: Promise<PagedResult<StudyGroupListItem>>;
};
export const StudyGroupsPaginationServer = async ({
  dataPromise,
}: StudyGroupsPaginationServerProps) => {
  const data = await dataPromise;

  return (
    <StudyGroupsPagination count={data.totalCount} page={data.page} pageSize={data.pageSize} />
  );
};
