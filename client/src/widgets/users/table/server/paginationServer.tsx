import type { PagedResult } from "@/shared/api/types";
import type { UserListItem } from "@/entities/user/model/types";

import { UsersPagination } from "../ui/pagination";

type UsersPaginationServerProps = {
  dataPromise: Promise<PagedResult<UserListItem>>;
};

export const UsersPaginationServer = async ({ dataPromise }: UsersPaginationServerProps) => {
  const data = await dataPromise;

  return <UsersPagination count={data.totalCount} page={data.page} pageSize={data.pageSize} />;
};
